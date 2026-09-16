// Galeries des pages restaurant.
// Les photos viennent de la photothèque Corniche fournie (une planche par adresse),
// sélectionnées à la main : on garde les vues de salle, la cuisine et l’ambiance,
// on écarte les visuels marketing porteurs de texte.
// Le nom, la signature, les paragraphes et les horaires restent lus depuis
// `experiences` (content/corniche.ts) : une seule source pour la copy.

// Les clips viennent des reels Instagram des adresses : coupés à 10 s maximum,
// muets (obligatoire pour la lecture automatique), 540x960, ~0,3 à 1,8 Mo pièce.
// Chaque clip a une affiche JPG : rien ne se télécharge tant que le cadre
// n’est pas affiché.

export type GalleryFrame = {
  src: string;
  alt: string;
  /** Par défaut une image ; "video" bascule sur un <video> muet en boucle. */
  type?: "image" | "video";
  /** Affiche du clip, affichée avant lecture et en mouvement réduit. */
  poster?: string;
};

export type RestaurantPageContent = {
  slug: string;
  /** Curated photography only: gallery/social thumbnails must never become heroes. */
  hero: Pick<GalleryFrame, "src" | "alt"> & {
    mobileSrc?: string;
    position?: string;
    mobilePosition?: string;
  };
  gallery: readonly GalleryFrame[];
  /** Bande pleine largeur entre le texte et la galerie. Absente si pas de clip. */
  ambiance?: GalleryFrame;
};

const base = (slug: string, file: string) =>
  `/assets/corniche/pages/${slug}/${file}`;

/** Clip vidéo d’une adresse, avec son affiche. */
const clip = (slug: string, name: string, alt: string): GalleryFrame => ({
  src: `/assets/corniche/videos/${slug}/${name}.mp4`,
  poster: `/assets/corniche/videos/${slug}/posters/${name}.jpg`,
  alt,
  type: "video",
});

export const restaurantPages: readonly RestaurantPageContent[] = [
  {
    slug: "marion",
    hero: {
      src: "/assets/corniche/library/marion/911-med_2106.jpg",
      mobileSrc: base("marion", "hero.jpg"),
      alt: "Salon du Marion ouvert sur l’océan",
    },
    ambiance: clip("marion", "ambiance", "Le Marion et sa vue sur l’Atlantique"),
    gallery: [
      { src: base("marion", "01.jpg"), alt: "Table dressée au Marion face à la baie" },
      { src: base("marion", "02.jpg"), alt: "Salle du Marion à la lumière du soir" },
      clip("marion", "01", "Dressage d’une assiette au Marion"),
      { src: base("marion", "03.jpg"), alt: "Grande tablée du Marion face à la mer" },
      { src: base("marion", "04.jpg"), alt: "Terrasse du Marion au coucher du soleil" },
      clip("marion", "02", "Créations du chef au Marion"),
      { src: base("marion", "05.jpg"), alt: "Salle du Marion au crépuscule" },
      { src: base("marion", "06.jpg"), alt: "Création signature du chef" },
      clip("marion", "03", "Le bar à champagne du Marion"),
      { src: base("marion", "07.jpg"), alt: "Dessert signature du Marion" },
      { src: base("marion", "08.jpg"), alt: "Piano à queue pendant le service" },
      { src: base("marion", "09.jpg"), alt: "Bar à champagne du Marion" },
    ],
  },
  {
    slug: "sunset",
    hero: {
      src: "/assets/corniche/library/sunset/1065-sunset-bg-slider.jpg",
      mobileSrc: base("sunset", "hero.jpg"),
      alt: "Cocktails et table ensoleillée au Sunset",
    },
    ambiance: clip("sunset", "ambiance", "La terrasse du Sunset face à l’océan"),
    gallery: [
      { src: base("sunset", "01.jpg"), alt: "Cocktails du Sunset à la tombée du jour" },
      { src: base("sunset", "02.jpg"), alt: "Cocktail servi face à l’océan" },
      clip("sunset", "01", "Préparation d’un cocktail au Sunset"),
      { src: base("sunset", "03.jpg"), alt: "Table du Sunset au coucher du soleil" },
      { src: base("sunset", "04.jpg"), alt: "Assiette de partage au Sunset" },
      { src: base("sunset", "05.jpg"), alt: "Création culinaire du Sunset" },
      { src: base("sunset", "06.jpg"), alt: "Silhouette au soleil couchant" },
      { src: base("sunset", "07.jpg"), alt: "Coucher de soleil sur l’Atlantique" },
      { src: base("sunset", "08.jpg"), alt: "L’océan vu depuis le Sunset" },
      { src: base("sunset", "09.jpg"), alt: "Cocktail et platine vinyle" },
    ],
  },
  {
    slug: "aiku",
    hero: {
      src: "/assets/corniche/library/aiku/1021-med_5008.jpg",
      mobileSrc: base("aiku", "01.jpg"),
      alt: "Salon d’Aï-Ku, lanternes et boiseries japonaises",
    },
    ambiance: clip("aiku", "ambiance", "Les façades lumineuses d’Aï-Ku à la nuit tombée"),
    gallery: [
      { src: base("aiku", "01.jpg"), alt: "Bar et salon d’Aï-Ku" },
      { src: base("aiku", "02.jpg"), alt: "Céramiques japonaises d’Aï-Ku" },
      clip("aiku", "01", "Le chef d’Aï-Ku au travail"),
      { src: base("aiku", "03.jpg"), alt: "Plat signature d’Aï-Ku" },
      { src: base("aiku", "04.jpg"), alt: "Sélection de plats japonais" },
      clip("aiku", "02", "Les lumières tamisées d’Aï-Ku"),
      { src: base("aiku", "05.jpg"), alt: "Couvert dressé à Aï-Ku" },
      { src: base("aiku", "06.jpg"), alt: "Détail de décoration d’Aï-Ku" },
      { src: base("aiku", "07.jpg"), alt: "Entrée d’Aï-Ku à la nuit tombée" },
      { src: base("aiku", "08.jpg"), alt: "Le chef d’Aï-Ku en cuisine" },
      { src: base("aiku", "09.jpg"), alt: "Panneaux de lumière d’Aï-Ku" },
    ],
  },
  {
    slug: "mesanueva",
    hero: {
      src: "/assets/corniche/library/mesanueva/1098-mesanueva.jpg",
      mobilePosition: "20% 50%",
      alt: "Salle de Mesanueva, banquettes et luminaires tressés",
    },
    ambiance: clip("mesanueva", "ambiance", "Cuisson à la flamme chez Mesanueva"),
    gallery: [
      { src: base("mesanueva", "01.jpg"), alt: "Tapas partagés à Mesanueva" },
      clip("mesanueva", "01", "L’esprit flamenco de Mesanueva"),
      { src: base("mesanueva", "02.jpg"), alt: "Table dressée à Mesanueva" },
      clip("mesanueva", "02", "Tablée partagée chez Mesanueva"),
      { src: base("mesanueva", "03.jpg"), alt: "Poteries andalouses de Mesanueva" },
      // La photothèque Mesanueva est plus courte : on complète avec la bibliothèque du site.
      {
        src: "/assets/corniche/library/mesanueva/1106-med_2070.jpg",
        alt: "Le chef de Mesanueva",
      },
      {
        src: "/assets/corniche/library/mesanueva/1098-mesanueva.jpg",
        alt: "Salle de Mesanueva",
      },
    ],
  },
  {
    slug: "amoramor",
    hero: {
      src: "/assets/corniche/library/amoramor/1045-couv-amor-corniche.jpg",
      mobileSrc: base("amoramor", "hero.jpg"),
      alt: "Salle d’Amor & Amor aux velours rouges",
    },
    ambiance: clip("amoramor", "ambiance", "Mezzés et thé servis chez Amor & Amor"),
    gallery: [
      { src: base("amoramor", "01.jpg"), alt: "Banquettes d’Amor & Amor face à l’océan" },
      { src: base("amoramor", "02.jpg"), alt: "Table dressée chez Amor & Amor" },
      clip("amoramor", "01", "Cocktail et dessert signature d’Amor & Amor"),
      { src: base("amoramor", "03.jpg"), alt: "Salle fleurie d’Amor & Amor" },
      { src: base("amoramor", "04.jpg"), alt: "Mezzés d’Amor & Amor" },
      { src: base("amoramor", "05.jpg"), alt: "Croquettes signature" },
      { src: base("amoramor", "06.jpg"), alt: "Dessert d’Amor & Amor" },
      { src: base("amoramor", "07.jpg"), alt: "Cocktail signature d’Amor & Amor" },
      { src: base("amoramor", "08.jpg"), alt: "Cocktails partagés chez Amor & Amor" },
      { src: base("amoramor", "09.jpg"), alt: "Luminaire d’Amor & Amor" },
    ],
  },
  {
    slug: "louna",
    hero: {
      src: "/assets/corniche/library/louna/841-louna.jpg",
      mobileSrc: base("louna", "01.jpg"),
      mobilePosition: "50% 35%",
      alt: "L’univers du cabaret Louna Music Hall",
    },
    ambiance: clip("louna", "ambiance", "Le cabaret Louna en scène"),
    gallery: [
      { src: base("louna", "01.jpg"), alt: "Danseuse du spectacle Louna" },
      clip("louna", "01", "Numéro de feu sur la scène du Louna"),
      { src: base("louna", "02.jpg"), alt: "Soirée au Louna" },
      { src: base("louna", "03.jpg"), alt: "Artiste en costume de plumes" },
      clip("louna", "02", "Les artistes du Louna"),
      { src: base("louna", "04.jpg"), alt: "Chanteuse sur la scène du Louna" },
      { src: base("louna", "05.jpg"), alt: "Chanteur sur la scène du Louna" },
      clip("louna", "03", "Ballet du Louna"),
      { src: base("louna", "06.jpg"), alt: "Mezzés servis au Louna" },
      { src: base("louna", "07.jpg"), alt: "Dessert signature du Louna" },
      { src: base("louna", "08.jpg"), alt: "Chandelier du Louna" },
      { src: base("louna", "09.jpg"), alt: "Rideau de scène du Louna" },
    ],
  },
];

export const getRestaurantPage = (slug: string) =>
  restaurantPages.find((page) => page.slug === slug);
