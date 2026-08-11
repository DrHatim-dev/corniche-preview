// Copy Corniche centralisée à partir du deck fourni et des textes source.
// Les paragraphes descriptifs sont repris mot pour mot, sans reformulation.

export const site = {
  name: "Corniche",
  phone: "0520 800 200",
  phoneHref: "tel:+212520800200",
  phoneIntl: "+212 520 800 200",
  address: "Casablanca — Bd de la Corniche",
  baseline: "Sortons à nouveau !",
} as const;

export const links = {
  reservation: "#contact",
  experiences: "#experiences",
  events: "#events",
  membership: "#membership",
  recrutement: "#recrutement",
  legal: "#",
  home: "#experiences",
} as const;

export const social = {
  instagram: "https://www.instagram.com/corniche_casablanca/",
  facebook: "https://www.facebook.com/cornichecasablanca/",
  tripadvisor:
    "https://www.tripadvisor.com/Restaurant_Review-g293732-d20259083-Reviews-Corniche_by_Palmeraie-Casablanca_Casablanca_Settat.html?m=69573",
  whatsapp: "https://wa.me/212520800200",
} as const;

export const nav = {
  links: [
    { label: "Le complexe", href: "#complexe" },
    { label: "Dress code", href: "#dresscode" },
    { label: "Expériences", href: "#experiences" },
    { label: "Events", href: "#events" },
    { label: "Membership", href: "#membership" },
    { label: "Contact", href: "#contact" },
  ],
  reserve: "Réserver",
} as const;

export const hero = {
  title: "Corniche",
  eyebrow: "Casablanca, face à l’océan",
  promise: "Six restaurants, un seul lieu",
  accent: "Du déjeuner au bout de la nuit",
  intro:
    "Un complexe d’exception au cœur de Casablanca, qui conjugue élégance, diversité et art de vivre, les yeux tournés vers l’océan.",
  ctaPrimary: "Réserver une table",
  ctaSecondary: "Voir les restaurants",
  ctaSecondaryHref: "#experiences",
  heroNotice: "Dress code élégant · Réservation recommandée",
} as const;

export const intro = {
  eyebrow: "Le complexe",
  paragraphs: [
    "Bienvenue à Corniche, un complexe d’exception au cœur de Casablanca, qui conjugue élégance, diversité et art de vivre. Idéalement situé en bord de mer, notre établissement vous offre une vue panoramique unique sur l’océan Atlantique, créant une atmosphère à la fois apaisante et inspirante.",
    "Corniche rassemble différents concepts de restauration pour répondre à toutes les envies : une gastronomie raffinée qui célèbre les produits locaux et internationaux, des cuisines venues d’ailleurs qui invitent au voyage, ainsi que des espaces conviviaux où partager un moment entre amis ou en famille. Chaque restaurant du complexe a été pensé avec une identité propre, un cadre soigné et une ambiance singulière, afin de transformer chaque visite en une nouvelle expérience.",
    "Que ce soit pour un déjeuner face à la mer, un dîner élégant au coucher du soleil, ou une soirée animée entre saveurs et ambiance festive, Corniche est la destination idéale pour découvrir Casablanca autrement. Plus qu’un lieu, Corniche est une véritable invitation à savourer la vie, les yeux tournés vers l’horizon.",
  ],
} as const;

export type DresscodeRule = {
  icon: "Gem" | "Ban" | "CalendarCheck" | "Moon";
  title: string;
  text: string;
};

export const dresscode = {
  eyebrow: "L’art de recevoir",
  title: "Une maison, un code",
  intro:
    "Chez Corniche, l’élégance fait partie de l’expérience autant que la vue sur l’océan. La même attention est portée à chacun : un cadre soigné, une allure choisie et le même accueil pour tous nos hôtes.",
  rules: [
    {
      icon: "Gem",
      title: "Tenue élégante",
      text: "Smart chic exigé en soirée : l’allure fait partie du décor.",
    },
    {
      icon: "Ban",
      title: "Sportswear & tenues de plage",
      text: "Non admis après 19h00.",
    },
    {
      icon: "CalendarCheck",
      title: "Sur réservation",
      text: "L’accès est garanti aux tables réservées ; la maison reste seule juge de l’admission.",
    },
    {
      icon: "Moon",
      title: "Adultes en soirée",
      text: "Espaces nocturnes réservés aux plus de 18 ans.",
    },
  ] satisfies DresscodeRule[],
  gesture:
    "Un écart de tenue ne donne jamais lieu à un refus sec : notre équipe vous accueille avec discrétion et vous propose, en toute élégance, la solution la plus adaptée.",
  confirm: "En réservant, je confirme avoir pris connaissance du dress code.",
} as const;

export const experiencesCopy = {
  eyebrow: "Expériences",
  title: "Six concepts, une même signature",
  intro:
    "Chaque adresse du complexe a son identité, son cadre et son ambiance, pour transformer chaque visite en une nouvelle expérience face à l’océan.",
} as const;

export type MediaFrame = {
  src: string;
  alt: string;
  fit?: "cover" | "contain";
  position?: string;
};

export type Experience = {
  slug: string;
  name: string;
  tagline: string;
  description: readonly string[];
  hours: string;
  image: string;
  imageAlt: string;
  gallery: readonly MediaFrame[];
  href: string;
  instagram?: string;
  primary: string;
  secondary: string;
  labelScale: number;
};

export const experiences: readonly Experience[] = [
  {
    slug: "marion",
    instagram: "marion_casablanca",
    name: "Marion",
    tagline: "Célébrons la cuisine française",
    description: [
      "Niché au sein du complexe Corniche, Marion incarne l’élégance de la gastronomie française dans un cadre raffiné face à la mer.",
      "Entre luxe et sophistication, chaque plat est une véritable création culinaire, alliant produits d’exception et savoir-faire authentique. Dans une ambiance chic et intimiste, Marion vous invite à vivre une expérience unique où le plaisir des yeux rivalise avec celui des papilles. Une adresse incontournable pour savourer l’art de vivre à la française avec une vue imprenable sur l’océan",
    ],
    hours: "Tous les jours de 12h00 à 01h00",
    image: "/assets/corniche/library/marion/919-img_4853.jpg",
    imageAlt: "Service élégant au Marion",
    gallery: [
      {
        src: "/assets/corniche/library/marion/919-img_4853.jpg",
        alt: "Service élégant au Marion",
        position: "52% 40%",
      },
      {
        src: "/assets/corniche/library/marion/913-med_2180.jpg",
        alt: "Salon intimiste du Marion",
        position: "50% center",
      },
      {
        src: "/assets/corniche/library/marion/907-med_2091.jpg",
        alt: "Service face à la mer au Marion",
        position: "50% 45%",
      },
      {
        src: "/assets/corniche/library/marion/909-med_2099.jpg",
        alt: "Salle raffinée du Marion",
        position: "50% center",
      },
      {
        src: "/assets/corniche/library/marion/908-med_2093.jpg",
        alt: "Tables dressées au Marion",
        position: "50% center",
      },
      {
        src: "/assets/corniche/library/marion/906-med_2089.jpg",
        alt: "Ambiance chaleureuse du Marion",
        position: "50% center",
      },
      {
        src: "/assets/corniche/library/marion/905-med_2087.jpg",
        alt: "Salle du Marion à la lumière du soir",
        position: "50% center",
      },
      {
        src: "/assets/corniche/library/marion/904-med_2162.jpg",
        alt: "Arrivée nocturne au Marion",
        position: "50% center",
      },
      {
        src: "/assets/corniche/library/marion/911-med_2106.jpg",
        alt: "Table du Marion face à l’océan",
        position: "50% center",
      },
      {
        src: "/assets/corniche/library/marion/912-med_2110.jpg",
        alt: "Panorama du Marion sur l’Atlantique",
        position: "50% center",
      },
      {
        src: "/assets/corniche/library/marion/941-caviar-slider.jpg",
        alt: "Détail gastronomique du Marion",
        position: "50% center",
      },
    ],
    href: "/marion",
    primary: "#5a2418",
    secondary: "#160d0a",
    labelScale: 1,
  },
  {
    slug: "sunset",
    instagram: "sunsetbarbymarion",
    name: "Sunset",
    tagline: "Une adresse d’exception face à l’océan",
    description: [
      "Sunset by Marion s’inscrit comme une adresse d’exception au cœur du complexe de la Corniche, face à l’océan. Véritable écrin en bord de mer, le lieu offre une vue panoramique imprenable où ciel et horizon se rencontrent dans une atmosphère raffinée. Pensé comme une expérience à part entière, Sunset by Marion allie élégance, art de vivre et moments suspendus, du déjeuner ensoleillé aux soirées au rythme du coucher de soleil. Une destination incontournable à Casablanca, où chaque détail célèbre le cadre, la vue et l’instant",
    ],
    hours: "Tous les jours de 15h00 à 00h00",
    image: "/assets/corniche/library/sunset/1062-med_3988.jpg",
    imageAlt: "Cocktail et menu au Sunset",
    gallery: [
      {
        src: "/assets/corniche/library/sunset/1062-med_3988.jpg",
        alt: "Cocktail et menu au Sunset",
        position: "55% 55%",
      },
      {
        src: "/assets/corniche/library/sunset/1063-med_4076.jpg",
        alt: "Reflet doré d’un cocktail au Sunset",
        position: "50% center",
      },
      {
        src: "/assets/corniche/library/sunset/1064-med_4081.jpg",
        alt: "Verre au coucher du soleil",
        position: "50% center",
      },
      {
        src: "/assets/corniche/library/sunset/1065-sunset-bg-slider.jpg",
        alt: "Table ensoleillée au Sunset",
        position: "50% center",
      },
    ],
    href: "/sunset",
    primary: "#a4512d",
    secondary: "#21120d",
    labelScale: 0.88,
  },
  {
    slug: "aiku",
    instagram: "aiku.casablanca",
    name: "Aï-Ku",
    tagline: "L’élégance de la gastronomie japonaise",
    description: [
      "AI-KU vous plonge dans l’univers raffiné de la gastronomie japonaise. Dans un cadre moderne et apaisant, chaque visite devient une expérience unique où élégance et sérénité se rencontrent. L’harmonie des saveurs inspirées de l’Asie se mêle à la beauté du panorama marin, offrant un moment de plaisir à la fois pour les yeux et pour les sens. AI-KU est l’adresse idéale pour savourer l’art culinaire japonais tout en profitant d’une vue imprenable sur l’océan.",
    ],
    hours:
      "Lun. – Ven. 12h00-15h00 / 19h00-01h00 · Sam. & Dim. 12h00-01h00",
    image: "/assets/corniche/library/aiku/1023-med_5048.jpg",
    imageAlt: "Table dressée à Aï-Ku",
    gallery: [
      {
        src: "/assets/corniche/library/aiku/1023-med_5048.jpg",
        alt: "Table dressée à Aï-Ku",
        position: "50% center",
      },
      {
        src: "/assets/corniche/library/aiku/1021-med_5008.jpg",
        alt: "Salon japonais d’Aï-Ku",
        position: "50% center",
      },
      {
        src: "/assets/corniche/library/aiku/1018-corn-slider.jpg",
        alt: "Escalier architectural d’Aï-Ku",
        position: "50% center",
      },
    ],
    href: "/aiku",
    primary: "#5d3b20",
    secondary: "#11100d",
    labelScale: 0.96,
  },
  {
    slug: "mesanueva",
    instagram: "mesanueva_casablanca",
    name: "Mesanueva",
    tagline: "L’âme de l’Espagne à votre table",
    description: [
      "Niché au sein du complexe Corniche, Mesanueva vous transporte au cœur de l’Espagne à travers une cuisine généreuse, authentique et pleine de caractère.",
      "Entre convivialité et élégance méditerranéenne, chaque assiette célèbre les saveurs espagnoles avec des produits soigneusement sélectionnés et un savoir-faire traditionnel. Dans une ambiance chaleureuse et raffinée, Mesanueva vous invite à partager des instants uniques autour de tapas, paellas et spécialités ibériques, le tout sublimé par une vue exceptionnelle sur l’océan. Une adresse incontournable pour vivre l’art de vivre espagnol à Casablanca.",
    ],
    hours: "Tous les jours de 12h00 à 01h00",
    image: "/assets/corniche/library/mesanueva/1106-med_2070.jpg",
    imageAlt: "Le chef de Mesa Nueva",
    gallery: [
      {
        src: "/assets/corniche/library/mesanueva/1106-med_2070.jpg",
        alt: "Le chef de Mesa Nueva",
        position: "50% 42%",
      },
      {
        src: "/assets/corniche/library/mesanueva/1098-mesanueva.jpg",
        alt: "Salle de Mesa Nueva",
        position: "50% center",
      },
    ],
    href: "/mesanueva",
    primary: "#8b4826",
    secondary: "#1b100b",
    labelScale: 0.67,
  },
  {
    slug: "amoramor",
    instagram: "amoramor_casablanca",
    name: "Amor & Amor",
    tagline: "L’élégance des saveurs orientales face à l’océan",
    description: [
      "AMOR AMOR vous invite à découvrir une cuisine orientale et internationale dans un univers à la fois raffiné et chaleureux. Dans un cadre élégant ouvert sur la mer, chaque visite se transforme en une véritable parenthèse sensorielle où les parfums d’ailleurs rencontrent la beauté du panorama marin. L’alliance des saveurs authentiques et d’une atmosphère sophistiquée fait d’AMOR AMOR l’adresse idéale pour vivre une expérience culinaire unique, entre tradition et modernité, avec une vue imprenable sur l’océan.",
    ],
    hours: "Tous les jours de 12h00 à 02h00",
    image: "/assets/corniche/library/amoramor/1046-amor-table.jpg",
    imageAlt: "Table intime d’Amor & Amor",
    gallery: [
      {
        src: "/assets/corniche/library/amoramor/1046-amor-table.jpg",
        alt: "Table intime d’Amor & Amor",
        position: "50% center",
      },
      {
        src: "/assets/corniche/library/amoramor/1045-couv-amor-corniche.jpg",
        alt: "Salle d’Amor & Amor",
        position: "50% center",
      },
      {
        src: "/assets/corniche/library/amoramor/1040-amoramor-1.jpg",
        alt: "Tables face à la nuit chez Amor & Amor",
        position: "50% center",
      },
      {
        src: "/assets/corniche/library/amoramor/1036-amoramor-1080.jpg",
        alt: "Dîner aux lumières tamisées chez Amor & Amor",
        position: "50% center",
      },
    ],
    href: "/amoramor",
    primary: "#762b32",
    secondary: "#190b0d",
    labelScale: 0.64,
  },
  {
    slug: "louna",
    instagram: "louna_casablanca",
    name: "Louna",
    tagline: "Que le spectacle commence !",
    description: [
      "Les lumières s’éteignent, le rideau se lève, une succession de spectacles glamour, de costumes somptueux aux couleurs chatoyantes et de musiques aux ambiances variées s’offrent à vous pour une soirée enchanteresse.",
      "Découvrez son menu aux saveurs subtiles et ses plats à partager qui éveilleront vos sens et vos papilles.",
      "Laissez-vous porter par la surprise que vous évoquera la décoration à la fois délicate et fastueuse de la salle et son ambiance festive, presque enivrante.",
      "Laissez-vous porter par LOUNA !",
    ],
    hours: "Tous les jours de 20h30 à 05h00",
    image: "/assets/corniche/library/unassigned/960-em6a2028-111.jpg",
    imageAlt: "Spectacle de Louna",
    gallery: [
      {
        src: "/assets/corniche/library/unassigned/960-em6a2028-111.jpg",
        alt: "Spectacle de Louna",
        position: "50% 32%",
      },
      {
        src: "/assets/corniche/library/louna/841-louna.jpg",
        alt: "Salle de Louna avant le spectacle",
        position: "50% center",
      },
    ],
    href: "/louna",
    primary: "#6c284d",
    secondary: "#170b12",
    labelScale: 1,
  },
] as const;

export const events = {
  eyebrow: "Events",
  title: "L’art des grandes soirées",
  intro:
    "Tout au long de l’année, Corniche orchestre des rendez-vous où la table se fait spectacle et la nuit se prolonge face à l’océan.",
  program: [
    {
      title: "Les soirées du Marion",
      detail: "Dîners d’exception à la française, au rythme de la nuit.",
    },
    {
      title: "Signature de Noël",
      detail: "Une célébration raffinée pour un réveillon d’exception.",
    },
    {
      title: "Signature du 31 Décembre",
      detail: "Passez à la nouvelle année les yeux tournés vers l’horizon.",
    },
  ],
  cta: "Voir les événements",
  image: "/images/corniche/events.jpg",
} as const;

export const membership = {
  eyebrow: "Membership",
  title: "Corniche Membership",
  tagline: "Plus qu’un privilège, un style de vie signé Corniche",
  intro:
    "Entrez dans le cercle privé, Corniche Membership, un univers réservé à une élite pour qui chaque instant mérite d’être sublimé. Pensée comme une expérience sur mesure, cette adhésion incarne le raffinement, la discrétion et l’art de vivre selon Corniche.",
  privilegesTitle: "Vos privilèges membres",
  privileges: [
    "Priorité absolue sur toutes vos réservations",
    "Préparation sur mesure de vos demandes avant votre arrivée",
    "Possibilité d’anticiper vos commandes au restaurant, pour que tout soit prêt dès votre venue",
    "Voiturier privé et préparation de votre véhicule avant votre départ",
    "Accès réservé à tous les espaces VIP du complexe",
    "Invitation exclusive au futur espace Members Only de Corniche",
  ],
  closing: "Un art de vivre signé Corniche.",
  discretion:
    "Discrétion, élégance et confort : chaque avantage a été imaginé pour offrir à nos membres une expérience exceptionnelle, à la hauteur de la signature Corniche.",
  cta: "Devenir membre",
} as const;

export const recrutement = {
  title: "RECRUTEMENT",
  paragraphs: [
    "Si vous souhaitez rejoindre la famille Corniche , veuillez nous soumettre votre CV en candidature libre.",
    "Pour celà, il vous suffit de compléter le formulaire suivant :",
  ],
  fields: [
    "Votre nom (obligatoire)",
    "Votre adresse de messagerie (obligatoire)",
    "Votre CV (obligatoire)",
    "Objet",
    "Votre message",
  ],
} as const;

export const contact = {
  eyebrow: "Réservation",
  title: "Réservez votre table face à l’océan",
  text:
    "Une équipe dédiée vous accompagne pour composer le moment parfait, du déjeuner ensoleillé aux nuits d’exception.",
  cta: "Réserver",
  notice:
    "Dress code élégant · En réservant, je confirme avoir pris connaissance du dress code.",
  image: "/images/corniche/ocean.jpg",
} as const;
