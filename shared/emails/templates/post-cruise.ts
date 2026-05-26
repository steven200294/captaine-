import { emailWrapper, emailButton, emailButtonOutline, emailDivider, emailProductCard, emailHeroImage, EMAIL_STYLES, EMAIL_IMAGES } from '../components/base';

export interface PostCruiseData {
  firstName: string;
  orderNumber: string;
  purchasedSlugs: string[];
  baseUrl: string;
  reviewUrl: string;
  referralCode?: string;
}

interface UpsellProduct {
  title: string;
  image: string;
  price: number;
  slug: string;
  description: string;
}

const ALL_PRODUCTS: UpsellProduct[] = [
  { slug: 'croisiere-classique', title: 'La Croisière Classique', image: '/images/cards/croisière.jpg', price: 17, description: '1h sur la Seine, audio en 12 langues' },
  { slug: 'croisiere-macarons', title: 'Croisière & Macarons', image: '/images/cards/croisière-macaron.png', price: 19, description: 'Croisière + coffret macarons artisanaux' },
  { slug: 'croisiere-esim', title: 'Croisière & eSIM 3Go', image: '/images/cards/esim.png', price: 19, description: 'Croisière + eSIM Europe 30 jours' },
  { slug: 'pack-capitaine', title: 'Pack Capitaine (Complet)', image: '/images/cards/macaron-croisière-esim.png', price: 25, description: 'Croisière + Macarons + eSIM 3Go' },
  { slug: 'pack-family', title: 'Pack Family', image: '/images/cards/macaron.png', price: 65, description: '4 billets + macarons + 2 eSIM' },
  { slug: 'pack-privilege', title: 'Pack Privilège "Expert Paris"', image: '/images/cards/pack-privilege.jpg', price: 28, description: 'Croisière + eSIM 10Go premium' },
];

function getUpsellProducts(purchasedSlugs: string[]): UpsellProduct[] {
  const purchased = new Set(purchasedSlugs);

  const isFullPack = purchased.has('pack-capitaine') || purchased.has('pack-family');
  if (isFullPack) {
    return ALL_PRODUCTS.filter((p) => p.slug === 'pack-privilege' && !purchased.has(p.slug));
  }

  const hasEsim = purchasedSlugs.some((s) => s.includes('esim') || s.includes('privilege'));
  const hasMacarons = purchasedSlugs.some((s) => s.includes('macaron'));

  return ALL_PRODUCTS
    .filter((p) => !purchased.has(p.slug))
    .filter((p) => {
      if (hasEsim && hasMacarons) return p.slug === 'pack-privilege';
      if (hasEsim) return p.slug.includes('macaron') || p.slug === 'pack-capitaine';
      if (hasMacarons) return p.slug.includes('esim') || p.slug === 'pack-capitaine';
      return p.slug !== 'croisiere-classique';
    })
    .slice(0, 2);
}

export function postCruiseEmail(data: PostCruiseData): { subject: string; html: string } {
  const subject = `${data.firstName}, comment s'est passée votre croisière ?`;
  const upsellProducts = getUpsellProducts(data.purchasedSlugs);

  const starsHtml = [1, 2, 3, 4, 5].map((n) =>
    `<a href="${data.reviewUrl}?rating=${n}" style="text-decoration:none;font-size:28px;color:${n <= 4 ? EMAIL_STYLES.colors.gold : EMAIL_STYLES.colors.border};margin:0 2px">&starf;</a>`
  ).join('');

  const upsellHtml = upsellProducts.length > 0
    ? `
      ${emailDivider()}
      <h2 style="margin:0 0 8px;font-size:16px;color:${EMAIL_STYLES.colors.navy}">Pour votre prochaine visite</h2>
      <p style="margin:0 0 16px;color:${EMAIL_STYLES.colors.muted};font-size:13px">
        Découvrez nos autres expériences sur la Seine.
      </p>
      ${upsellProducts.map((p) => emailProductCard(data.baseUrl, p)).join('')}
    `
    : '';

  const referralHtml = data.referralCode
    ? `
      ${emailDivider()}
      <div style="background:${EMAIL_STYLES.colors.bg};border-radius:8px;padding:20px 24px;text-align:center">
        <h3 style="margin:0 0 8px;font-size:14px;color:${EMAIL_STYLES.colors.navy}">Parrainez vos proches</h3>
        <p style="margin:0 0 12px;font-size:13px;color:${EMAIL_STYLES.colors.muted}">
          Offrez 10% de réduction à vos amis. Partagez votre code :
        </p>
        <div style="display:inline-block;background:${EMAIL_STYLES.colors.white};border:2px dashed ${EMAIL_STYLES.colors.gold};border-radius:8px;padding:12px 24px">
          <code style="font-size:18px;font-weight:800;color:${EMAIL_STYLES.colors.navy};letter-spacing:2px">${data.referralCode}</code>
        </div>
        <p style="margin:12px 0 0;font-size:11px;color:${EMAIL_STYLES.colors.muted}">
          Valable 6 mois — applicable sur toutes nos offres
        </p>
      </div>
    `
    : `
      ${emailDivider()}
      <div style="text-align:center">
        <h3 style="margin:0 0 8px;font-size:14px;color:${EMAIL_STYLES.colors.navy}">Partagez l'expérience</h3>
        <p style="margin:0 0 12px;font-size:13px;color:${EMAIL_STYLES.colors.muted}">
          Recommandez The Captain Boat à vos proches.
        </p>
        ${emailButtonOutline('Partager par email', `mailto:?subject=Croisière sur la Seine&body=J'ai testé The Captain Boat, je recommande ! ${data.baseUrl}`)}
      </div>
    `;

  const content = `
    ${emailHeroImage(data.baseUrl, EMAIL_IMAGES.experience, 'Expérience croisière')}

    <h1 style="margin:0 0 8px;font-size:22px;color:${EMAIL_STYLES.colors.navy}">Merci pour votre croisière</h1>
    <p style="margin:0 0 24px;color:${EMAIL_STYLES.colors.muted};font-size:14px;line-height:1.6">
      Bonjour ${data.firstName}, nous espérons que votre expérience sur la Seine vous a plu.
      Votre avis nous aide à nous améliorer et guide les futurs voyageurs.
    </p>

    <!-- Rating -->
    <div style="text-align:center;margin-bottom:24px;padding:24px;background:${EMAIL_STYLES.colors.bg};border-radius:8px">
      <p style="margin:0 0 12px;font-size:14px;font-weight:600;color:${EMAIL_STYLES.colors.navy}">Comment évaluez-vous votre expérience ?</p>
      <div style="margin-bottom:16px">
        ${starsHtml}
      </div>
      ${emailButton('Laisser un avis', data.reviewUrl)}
    </div>

    ${upsellHtml}
    ${referralHtml}

    <p style="margin:24px 0 0;font-size:12px;color:${EMAIL_STYLES.colors.muted};text-align:center">
      À très bientôt sur la Seine !
    </p>
  `;

  return { subject, html: emailWrapper(content, data.baseUrl, `Votre avis compte — et découvrez nos autres offres`) };
}
