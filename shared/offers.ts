import type { OfferTypeKey, BestOfferKey, DurationKey } from '@web/components/FilterContext';

export interface OfferItem {
  slug: string;
  title: string;
  image: string;
  adultOldPrice: number;
  adultNewPrice: number;
  childOldPrice?: number;
  childNewPrice?: number;
  childNote?: string;
  isPack?: boolean;
  rating: number;
  reviews: number;
  duration: string;
  location: string;
  description: string;
  tags: string[];
  badge: { text: string; color: 'green' | 'red' };
  isFavorite?: boolean;
  buttonText?: string;
  offerTypes: OfferTypeKey[];
  badgeType: BestOfferKey;
  durationKey: DurationKey;
}

export const OFFERS: OfferItem[] = [
  {
    slug: 'croisiere-classique',
    title: 'La Croisière Classique',
    image: '/images/cards/croisière.jpg',
    adultOldPrice: 20,
    adultNewPrice: 17,
    childOldPrice: 10,
    childNewPrice: 8,
    childNote: 'Moins de 4 ans : Gratuit',
    rating: 4.6,
    reviews: 1245,
    duration: '1 HEURE',
    location: 'PORT DE LA BOURDONNAIS',
    description: "Une immersion d'une heure sur la Seine pour admirer les plus beaux monuments de Paris. Commentaires audio inclus.",
    tags: ['AUDIO INCLUS', '12 LANGUES', 'SIÈGES INT/EXT'],
    badge: { text: 'MEILLEUR PRIX', color: 'green' },
    offerTypes: ['solo'],
    badgeType: 'meilleures',
    durationKey: '1h',
  },
  {
    slug: 'croisiere-macarons',
    title: 'Croisière & Macarons Artisanaux',
    image: '/images/cards/croisière-macaron.png',
    adultOldPrice: 26,
    adultNewPrice: 19,
    childOldPrice: 10,
    childNewPrice: 8,
    childNote: 'Enfant (moins de 13 ans) : 8€ (Croisière seule) | Moins de 4 ans : Gratuit',
    rating: 4.7,
    reviews: 987,
    duration: '1 HEURE',
    location: 'PORT DE LA BOURDONNAIS',
    description: "L'élégance de la navigation alliée à la finesse de la pâtisserie française. Macarons artisanaux inclus pour les adultes.",
    tags: ['MACARONS ARTISANAUX', '100% FAIT MAIN'],
    badge: { text: 'EXPÉRIENCE GOURMET', color: 'green' },
    isFavorite: true,
    offerTypes: ['macarons'],
    badgeType: 'meilleures',
    durationKey: '1h',
  },
  {
    slug: 'croisiere-esim',
    title: 'Croisière & eSIM Connect',
    image: '/images/cards/esim.png',
    adultOldPrice: 26,
    adultNewPrice: 19,
    childOldPrice: 10,
    childNewPrice: 8,
    childNote: 'Enfant (moins de 13 ans) : 8€ (Croisière seule) | Moins de 4 ans : Gratuit',
    rating: 4.5,
    reviews: 654,
    duration: '1 HEURE',
    location: 'PORT DE LA BOURDONNAIS',
    description: 'Naviguez et restez connecté avec une eSIM 3Go valable en UK & Europe pendant 30 jours. Option réservée aux adultes.',
    tags: ['ESIM 3GO INCLUSE', 'UK & EUROPE', '30 JOURS'],
    badge: { text: 'MEILLEURE OFFRE', color: 'red' },
    offerTypes: ['esim'],
    badgeType: 'meilleures',
    durationKey: '1h',
  },
  {
    slug: 'pack-capitaine',
    title: 'Le Pack Capitaine (Complet)',
    image: '/images/cards/macaron-croisière-esim.png',
    adultOldPrice: 32,
    adultNewPrice: 25,
    childOldPrice: 10,
    childNewPrice: 8,
    childNote: 'Enfant (moins de 13 ans) : 8€ (Croisière seule) | Moins de 4 ans : Gratuit',
    rating: 4.8,
    reviews: 1102,
    duration: '1 HEURE',
    location: 'PORT DE LA BOURDONNAIS',
    description: "L'offre ultime : Croisière + Macarons artisanaux + eSIM 3Go (UK & Europe, 30 jours). Macarons et eSIM pour adultes uniquement.",
    tags: ['TOUT INCLUS', 'MACARONS + ESIM 3GO'],
    badge: { text: 'VENTE FLASH', color: 'red' },
    buttonText: "CHOISIR L'OFFRE",
    offerTypes: ['esim', 'macarons'],
    badgeType: 'flash',
    durationKey: '1h',
  },
  {
    slug: 'pack-family',
    title: 'Pack Family (2 Adultes + 2 Enfants)',
    image: '/images/cards/macaron.png',
    adultOldPrice: 90,
    adultNewPrice: 65,
    isPack: true,
    childNote: '4 billets Croisière + 1 coffret 7 macarons + 2 eSIM 3Go | Économie de 25€ sur le tarif public',
    rating: 4.9,
    reviews: 412,
    duration: 'FLEXIBLE',
    location: 'PORT DE LA BOURDONNAIS',
    description: "L'offre idéale pour les familles. Comprend 4 billets Croisière + 1 coffret de 7 macarons + 2 eSIM 3Go (UK & Europe, 30 jours).",
    tags: ['4 BILLETS', 'COFFRET MACARONS', '2 ESIM 3GO', 'ÉCONOMIE 25€'],
    badge: { text: 'OFFRE FAMILLE', color: 'green' },
    buttonText: 'RÉSERVER POUR MA FAMILLE',
    offerTypes: ['esim', 'macarons'],
    badgeType: 'meilleures',
    durationKey: 'flexible',
  },
  {
    slug: 'pack-privilege',
    title: 'Pack Privilège "Expert Paris"',
    image: '/images/cards/pack-privilege.jpg',
    adultOldPrice: 34,
    adultNewPrice: 28,
    rating: 4.7,
    reviews: 298,
    duration: '1 HEURE',
    location: 'PORT DE LA BOURDONNAIS',
    description: 'Pour les voyageurs exigeants : Croisière promenade 1h sur la Seine + eSIM 10Go (UK & Europe, 30 jours). Une connectivité haute performance.',
    tags: ['ESIM 10GO', 'UK & EUROPE', '30 JOURS', 'PREMIUM'],
    badge: { text: 'PRIVILÈGE', color: 'red' },
    offerTypes: ['esim'],
    badgeType: 'meilleures',
    durationKey: '1h',
  },
];

export function applyFilters(
  offers: OfferItem[],
  filters: { bestOffer: string | null; offerTypes: string[]; priceRange: [number, number]; duration: string | null }
): OfferItem[] {
  return offers.filter(offer => {
    if (filters.bestOffer && offer.badgeType !== filters.bestOffer) return false;
    if (filters.offerTypes.length > 0 && !filters.offerTypes.some(t => offer.offerTypes.includes(t as OfferTypeKey))) return false;
    const [minP, maxP] = filters.priceRange;
    if (offer.adultNewPrice < minP || offer.adultNewPrice > maxP) return false;
    if (filters.duration && offer.durationKey !== filters.duration) return false;
    return true;
  });
}
