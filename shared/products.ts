export interface ProductFeature {
  icon: 'headphones' | 'cookie' | 'signal' | 'globe' | 'users' | 'zap' | 'star' | 'armchair';
  title: string;
  description: string;
  label: string;
  highlighted?: boolean;
}

export interface PremiumOption {
  name: string;
  price: number;
}

export interface Product {
  slug: string;
  title: string;
  badge: { text: string; color: 'green' | 'red' };
  description: string;
  rating: number;
  reviews: number;
  duration: string;
  location: string;
  tags: string[];
  adultNewPrice: number;
  adultOldPrice: number;
  childNewPrice?: number;
  childOldPrice?: number;
  childNote?: string;
  isPack?: boolean;
  mainImage: string;
  thumbnails: string[];
  features: ProductFeature[];
  premiumOptions: PremiumOption[];
  buttonText?: string;
}

export const PRODUCTS: Product[] = [
  {
    slug: 'croisiere-classique',
    title: 'La Croisière Classique',
    badge: { text: 'MEILLEUR PRIX', color: 'green' },
    description: "Une immersion d'une heure sur la Seine pour admirer les plus beaux monuments de Paris. Commentaires audio inclus.",
    rating: 4.6,
    reviews: 1245,
    duration: '1 HEURE',
    location: 'PORT DE LA BOURDONNAIS',
    tags: ['AUDIO INCLUS', '12 LANGUES', 'SIÈGES INT/EXT'],
    adultNewPrice: 17,
    adultOldPrice: 20,
    childNewPrice: 8,
    childOldPrice: 10,
    childNote: 'Moins de 4 ans : Gratuit',
    mainImage: '/images/cards/croisière.jpg',
    thumbnails: [
      '/images/croisieres/hero.png',
      '/images/croisieres/monuments.png',
      '/images/croisieres/experience.png',
    ],
    features: [
      {
        icon: 'headphones',
        title: 'Commentaires Audio',
        description: "12 langues disponibles pour une immersion totale dans l'histoire de Paris et ses monuments.",
        label: 'Disponible à bord',
      },
      {
        icon: 'armchair',
        title: 'Confort Optimal',
        description: 'Sièges intérieurs et extérieurs pour profiter du spectacle selon la météo.',
        label: 'Int/Ext disponibles',
        highlighted: true,
      },
    ],
    premiumOptions: [
      { name: 'Coupe de Champagne', price: 12 },
      { name: 'Boîte Premium (12 macarons)', price: 18 },
    ],
  },
  {
    slug: 'croisiere-macarons',
    title: 'Croisière & Macarons Artisanaux',
    badge: { text: 'EXPÉRIENCE GOURMET', color: 'green' },
    description: "L'élégance de la navigation alliée à la finesse de la pâtisserie française. Macarons artisanaux inclus pour les adultes.",
    rating: 4.7,
    reviews: 987,
    duration: '1 HEURE',
    location: 'PORT DE LA BOURDONNAIS',
    tags: ['MACARONS ARTISANAUX', '100% FAIT MAIN'],
    adultNewPrice: 19,
    adultOldPrice: 26,
    childNewPrice: 8,
    childOldPrice: 10,
    childNote: 'Enfant (moins de 13 ans) : 8€ (Croisière seule) | Moins de 4 ans : Gratuit',
    mainImage: '/images/cards/croisière-macaron.png',
    thumbnails: [
      '/images/cards/croisière-macaron.png',
      '/images/cards/croisiere-macaron-var1.png',
      '/images/cards/croisiere-macaron-var2.png',
    ],
    features: [
      {
        icon: 'cookie',
        title: 'Douceur Parisienne',
        description: "Un coffret de 2 macarons artisanaux makdamia vous attend. Retrait via QR code en boutique partenaire face à l'embarcadère.",
        label: 'Boutique partenaire',
      },
      {
        icon: 'headphones',
        title: 'Commentaires Audio',
        description: '12 langues disponibles pour découvrir Paris autrement.',
        label: 'Disponible à bord',
        highlighted: true,
      },
    ],
    premiumOptions: [
      { name: 'Coffret macarons supplémentaire', price: 12 },
      { name: 'Coupe de Champagne', price: 12 },
    ],
  },
  {
    slug: 'croisiere-esim',
    title: 'Croisière & eSIM Connect',
    badge: { text: 'MEILLEURE OFFRE', color: 'red' },
    description: "Naviguez et restez connecté avec une eSIM 3Go valable en UK & Europe pendant 30 jours. Option réservée aux adultes.",
    rating: 4.5,
    reviews: 654,
    duration: '1 HEURE',
    location: 'PORT DE LA BOURDONNAIS',
    tags: ['ESIM 3GO INCLUSE', 'UK & EUROPE', '30 JOURS'],
    adultNewPrice: 19,
    adultOldPrice: 26,
    childNewPrice: 8,
    childOldPrice: 10,
    childNote: 'Enfant (moins de 13 ans) : 8€ (Croisière seule) | Moins de 4 ans : Gratuit',
    mainImage: '/images/cards/esim.png',
    thumbnails: [
      '/images/cards/esim.png',
      '/images/cards/esim-real-var1.png',
      '/images/cards/esim-real-var2.png',
    ],
    features: [
      {
        icon: 'signal',
        title: 'Connectivité Instantanée',
        description: "Restez connecté dès votre arrivée. Recevez votre eSIM 3Go par email immédiatement après l'achat. Un simple scan de QR code suffit.",
        label: 'Activation immédiate',
      },
      {
        icon: 'globe',
        title: 'UK & Europe 30 Jours',
        description: "Naviguez librement dans toute l'Europe et au Royaume-Uni sans frais d'itinérance.",
        label: '3Go inclus',
        highlighted: true,
      },
    ],
    premiumOptions: [
      { name: 'Upgrade eSIM 10Go', price: 9 },
      { name: 'Coupe de Champagne', price: 12 },
    ],
  },
  {
    slug: 'pack-capitaine',
    title: 'Le Pack Capitaine (Complet)',
    badge: { text: 'VENTE FLASH', color: 'red' },
    description: "L'offre ultime : Croisière + Macarons artisanaux + eSIM 3Go (UK & Europe, 30 jours). Macarons et eSIM pour adultes uniquement.",
    rating: 4.8,
    reviews: 1102,
    duration: '1 HEURE',
    location: 'PORT DE LA BOURDONNAIS',
    tags: ['TOUT INCLUS', 'MACARONS + ESIM 3GO'],
    adultNewPrice: 25,
    adultOldPrice: 32,
    childNewPrice: 8,
    childOldPrice: 10,
    childNote: 'Enfant (moins de 13 ans) : 8€ (Croisière seule) | Moins de 4 ans : Gratuit',
    mainImage: '/images/cards/macaron-croisière-esim.png',
    thumbnails: [
      '/images/croisieres/night.png',
      '/images/croisieres/macarons.png',
      '/images/produits/esim.png',
    ],
    features: [
      {
        icon: 'signal',
        title: 'Connectivité 3Go',
        description: 'eSIM 3Go UK & Europe 30 jours incluse pour les adultes. Activation immédiate par QR code.',
        label: 'Activation immédiate',
      },
      {
        icon: 'cookie',
        title: 'Macarons Artisanaux',
        description: "Coffret 2 macarons makdamia Paris inclus. Retrait en boutique partenaire face à l'embarcadère.",
        label: 'Boutique partenaire',
        highlighted: true,
      },
    ],
    premiumOptions: [
      { name: 'Upgrade eSIM 10Go', price: 9 },
      { name: 'Coffret macarons supplémentaire', price: 12 },
    ],
    buttonText: "CHOISIR L'OFFRE",
  },
  {
    slug: 'pack-family',
    title: 'Pack Family (2 Adultes + 2 Enfants)',
    badge: { text: 'OFFRE FAMILLE', color: 'green' },
    description: "L'offre idéale pour les familles. Comprend 4 billets Croisière + 1 coffret de 7 macarons + 2 eSIM 3Go (UK & Europe, 30 jours).",
    rating: 4.9,
    reviews: 412,
    duration: '1 HEURE',
    location: 'PORT DE LA BOURDONNAIS',
    tags: ['4 BILLETS', 'COFFRET MACARONS', '2 ESIM 3GO', 'ÉCONOMIE 25€'],
    adultNewPrice: 65,
    adultOldPrice: 90,
    isPack: true,
    childNote: '4 billets Croisière + 1 coffret 7 macarons + 2 eSIM 3Go | Économie de 25€ sur le tarif public',
    mainImage: '/images/cards/macaron.png',
    thumbnails: [
      '/images/croisieres/hero.png',
      '/images/croisieres/macarons.png',
      '/images/croisieres/experience.png',
    ],
    features: [
      {
        icon: 'users',
        title: '4 Billets Inclus',
        description: '2 adultes + 2 enfants (moins de 13 ans). L\'expérience parfaite en famille sur la Seine.',
        label: '2 adultes + 2 enfants',
      },
      {
        icon: 'cookie',
        title: 'Coffret 7 Macarons',
        description: 'Un assortiment de 7 macarons artisanaux makdamia pour régaler toute la tribu.',
        label: 'Boutique partenaire',
        highlighted: true,
      },
    ],
    premiumOptions: [
      { name: 'Coffret macarons supplémentaire', price: 12 },
      { name: 'Coupes de Champagne (×2)', price: 22 },
    ],
    buttonText: 'RÉSERVER POUR MA FAMILLE',
  },
  {
    slug: 'pack-privilege',
    title: 'Pack Privilège "Expert Paris"',
    badge: { text: 'PRIVILÈGE', color: 'red' },
    description: "Pour les voyageurs exigeants : Croisière promenade 1h sur la Seine + eSIM 10Go (UK & Europe, 30 jours). Une connectivité haute performance.",
    rating: 4.7,
    reviews: 298,
    duration: '1 HEURE',
    location: 'PORT DE LA BOURDONNAIS',
    tags: ['ESIM 10GO', 'UK & EUROPE', '30 JOURS', 'PREMIUM'],
    adultNewPrice: 28,
    adultOldPrice: 34,
    mainImage: '/images/cards/pack-privilege.jpg',
    thumbnails: [
      '/images/croisieres/night.png',
      '/images/cards/croisière.jpg',
      '/images/croisieres/hero.png',
    ],
    features: [
      {
        icon: 'zap',
        title: 'Connectivité Premium 10Go',
        description: 'eSIM 10Go UK & Europe 30 jours. La connectivité haute performance pour une expérience parisienne augmentée.',
        label: 'Activation immédiate',
      },
      {
        icon: 'star',
        title: 'Service Privilège',
        description: 'Une expérience taillée pour les voyageurs les plus exigeants. La Seine vue différemment.',
        label: 'Expérience exclusive',
        highlighted: true,
      },
    ],
    premiumOptions: [
      { name: 'Coupe de Champagne', price: 12 },
      { name: 'Boîte Premium (12 macarons)', price: 18 },
    ],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
