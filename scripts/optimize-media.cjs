/* Offline asset preparation. Original client media is never changed. */
const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const cp = require('node:child_process');
const Module = require('node:module');
const ts = require('typescript');
const sharp = require('sharp');
const root = path.resolve(__dirname, '..');
const publicRoot = path.join(root, 'public');
const generated = path.join(publicRoot, 'assets/corniche/optimized');
const ffmpeg = process.env.CORNICHE_FFMPEG;
const widths = [320, 640, 960, 1440, 1920];
sharp.concurrency(2);

async function main() {
  const sources = new Set();
  const heroSources = new Set();
  const desktopHeroSources = new Set();
  const collect = value => {
    if (typeof value === 'string' && /^\/(assets|images)\/.*\.(png|jpe?g|webp|mp4)$/i.test(value) && !value.includes('${')) sources.add(value);
    else if (Array.isArray(value)) value.forEach(collect);
    else if (value && typeof value === 'object') Object.values(value).forEach(collect);
  };
  for (const name of ['corniche', 'restaurants']) {
    const filename = path.join(root, 'src/content', name + '.ts');
    const compiled = ts.transpileModule(await fs.readFile(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
    const module = new Module(filename);
    module._compile(compiled, filename);
    collect(module.exports);
    if (name === 'restaurants') {
      for (const page of module.exports.restaurantPages) {
        heroSources.add(page.hero.src);
        desktopHeroSources.add(page.hero.src);
        if (page.hero.mobileSrc) heroSources.add(page.hero.mobileSrc);
      }
    }
  }
  const files = cp.execFileSync('git', ['ls-files', 'src'], { cwd: root, encoding: 'utf8' }).trim().split(/\r?\n/);
  for (const file of files) {
    for (const match of (await fs.readFile(path.join(root, file), 'utf8')).matchAll(/["'`](\/(?:assets|images)[^"'`\s)]+\.(?:png|jpe?g|webp|mp4))/gi)) collect(match[1]);
  }
  await fs.mkdir(path.join(generated, 'images'), { recursive: true });
  await fs.mkdir(path.join(generated, 'videos'), { recursive: true });
  const manifest = { images: {}, videos: {} };
  const summary = { images: 0, videos: 0, imageOriginalBytes: 0, imageLargestVariantBytes: 0, videoOriginalBytes: 0, videoOptimizedBytes: 0, variantsBytes: 0 };
  for (const src of [...sources].sort()) {
    const original = path.join(publicRoot, src);
    const data = await fs.readFile(original);
    const isHero = heroSources.has(src);
    const id = crypto.createHash('sha256').update(data).update(isHero ? 'corniche-hero-v2-q85' : 'corniche-web-v1').digest('hex').slice(0, 12);
    if (src.endsWith('.mp4')) {
      if (!ffmpeg) throw new Error('Set CORNICHE_FFMPEG to a local FFmpeg executable.');
      const target = path.join(generated, 'videos', id + '.mp4');
      try { await fs.access(target); } catch {
        cp.execFileSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-i', original, '-an', '-vf', "scale='min(480,iw)':-2", '-c:v', 'libx264', '-preset', 'slow', '-crf', '28', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-threads', '2', '-y', target], { stdio: ['ignore', 'ignore', 'pipe'] });
      }
      const optimizedBytes = (await fs.stat(target)).size;
      manifest.videos[src] = optimizedBytes < data.length ? id : null;
      summary.videos++;
      summary.videoOriginalBytes += data.length;
      summary.videoOptimizedBytes += Math.min(optimizedBytes, data.length);
      continue;
    }
    const meta = await sharp(data).metadata();
    const rotated = meta.orientation >= 5 && meta.orientation <= 8;
    const width = rotated ? meta.height : meta.width;
    const height = rotated ? meta.width : meta.height;
    if (desktopHeroSources.has(src) && (width < 1400 || width / height < 1.4)) {
      throw new Error(`Desktop hero needs a landscape original at least 1400px wide: ${src} (${width}x${height})`);
    }
    const variants = [...new Set((isHero ? [...widths, 2560, 3200] : widths).map(w => Math.min(w, width)))];
    for (const variantWidth of variants) {
      const target = path.join(generated, 'images', `${id}-${variantWidth}.webp`);
      try { await fs.access(target); } catch {
        await sharp(data).rotate().resize({ width: variantWidth, withoutEnlargement: true }).webp({ quality: meta.hasAlpha ? 88 : isHero ? 85 : 78, effort: 5 }).toFile(target);
      }
      const bytes = (await fs.stat(target)).size;
      summary.variantsBytes += bytes;
      if (variantWidth === variants.at(-1)) summary.imageLargestVariantBytes += bytes;
    }
    manifest.images[src] = [id, width, height, variants];
    summary.images++;
    summary.imageOriginalBytes += data.length;
  }
  await fs.writeFile(path.join(root, 'src/content/media-manifest.json'), JSON.stringify(manifest) + '\n');
  await fs.writeFile(path.join(root, 'media-optimization-summary.json'), JSON.stringify(summary, null, 2) + '\n');
  console.log(JSON.stringify(summary));
}
main().catch(e => { console.error(e.message); process.exitCode = 1; });
