export const EMAIL_STYLES = {
  fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  colors: {
    navy: '#1c355e',
    gold: '#FFB800',
    text: '#1f2937',
    muted: '#6b7280',
    border: '#e5e7eb',
    bg: '#f9fafb',
    white: '#ffffff',
  },
  borderRadius: '12px',
} as const;

export const EMAIL_IMAGES = {
  logo: '/images/logo/captaine.png',
  hero: '/images/hero/hero_bg.png',
  cruiseHero: '/images/croisieres/hero.png',
  monuments: '/images/croisieres/monuments.png',
  night: '/images/croisieres/night.png',
  experience: '/images/croisieres/experience.png',
  macarons: '/images/croisieres/macarons.png',
  esim: '/images/produits/esim.png',
  cards: {
    classique: '/images/cards/croisière.jpg',
    macarons: '/images/cards/croisière-macaron.png',
    esim: '/images/cards/esim.png',
    packCapitaine: '/images/cards/macaron-croisière-esim.png',
    packFamily: '/images/cards/macaron.png',
    packPrivilege: '/images/cards/pack-privilege.jpg',
  },
} as const;

function assetUrl(baseUrl: string, path: string): string {
  return `${baseUrl}${path}`;
}

export function emailWrapper(content: string, baseUrl: string, preheader?: string): string {
  const logoUrl = assetUrl(baseUrl, EMAIL_IMAGES.logo);

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>The Captain Boat</title>
  ${preheader ? `<span style="display:none;max-height:0;overflow:hidden">${preheader}</span>` : ''}
</head>
<body style="margin:0;padding:0;background:${EMAIL_STYLES.colors.bg};font-family:${EMAIL_STYLES.fontFamily}">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${EMAIL_STYLES.colors.bg};padding:32px 16px">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">
          <!-- Header -->
          <tr>
            <td style="text-align:center;padding:24px 0">
              <a href="${baseUrl}" style="text-decoration:none;display:inline-flex;align-items:center">
                <img src="${logoUrl}" alt="The Captain Boat" width="48" height="48" style="border-radius:50%;width:48px;height:48px;object-fit:cover;vertical-align:middle">
                <span style="font-size:18px;font-weight:800;color:${EMAIL_STYLES.colors.navy};letter-spacing:-0.5px;margin-left:12px;vertical-align:middle">THE CAPTAIN BOAT</span>
              </a>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="background:${EMAIL_STYLES.colors.white};border-radius:${EMAIL_STYLES.borderRadius};padding:40px 32px;box-shadow:0 1px 3px rgba(0,0,0,0.05)">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="text-align:center;padding:24px 0;color:${EMAIL_STYLES.colors.muted};font-size:12px;line-height:1.6">
              <p style="margin:0;font-weight:600;color:${EMAIL_STYLES.colors.navy}">The Captain Boat — Paris City Expert</p>
              <p style="margin:4px 0 0">Port de la Conférence, Pont de l'Alma, 75008 Paris</p>
              <p style="margin:4px 0 0">pariscityexpert@gmail.com | +33 7 82 86 24 36</p>
              <p style="margin:12px 0 0">
                <a href="${baseUrl}" style="color:${EMAIL_STYLES.colors.navy};text-decoration:underline;font-size:11px">thecaptainboat.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function emailButton(text: string, url: string): string {
  return `<a href="${url}" style="display:inline-block;background:${EMAIL_STYLES.colors.gold};color:${EMAIL_STYLES.colors.navy};font-weight:700;font-size:14px;padding:14px 28px;border-radius:8px;text-decoration:none;margin:16px 0">${text}</a>`;
}

export function emailButtonOutline(text: string, url: string): string {
  return `<a href="${url}" style="display:inline-block;border:2px solid ${EMAIL_STYLES.colors.navy};color:${EMAIL_STYLES.colors.navy};font-weight:600;font-size:13px;padding:12px 24px;border-radius:8px;text-decoration:none;margin:8px 4px">${text}</a>`;
}

export function emailDivider(): string {
  return `<hr style="border:none;border-top:1px solid ${EMAIL_STYLES.colors.border};margin:24px 0">`;
}

export function emailInfoRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:8px 0;color:${EMAIL_STYLES.colors.muted};font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;width:140px">${label}</td>
    <td style="padding:8px 0;color:${EMAIL_STYLES.colors.text};font-size:14px;font-weight:500">${value}</td>
  </tr>`;
}

export function emailHeroImage(baseUrl: string, imagePath: string, alt: string): string {
  return `<img src="${assetUrl(baseUrl, imagePath)}" alt="${alt}" width="600" style="width:100%;max-width:600px;height:auto;border-radius:8px;display:block;margin:0 0 24px">`;
}

export function emailProductCard(baseUrl: string, product: { title: string; image: string; price: number; slug: string; description?: string }): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;border:1px solid ${EMAIL_STYLES.colors.border};border-radius:8px;overflow:hidden">
    <tr>
      <td width="120" style="vertical-align:top">
        <img src="${assetUrl(baseUrl, product.image)}" alt="${product.title}" width="120" style="width:120px;height:100px;object-fit:cover;display:block">
      </td>
      <td style="padding:12px 16px;vertical-align:top">
        <p style="margin:0 0 4px;font-weight:700;font-size:14px;color:${EMAIL_STYLES.colors.navy}">${product.title}</p>
        ${product.description ? `<p style="margin:0 0 8px;font-size:12px;color:${EMAIL_STYLES.colors.muted};line-height:1.4">${product.description}</p>` : ''}
        <p style="margin:0">
          <span style="font-weight:700;font-size:14px;color:${EMAIL_STYLES.colors.gold}">${product.price}\u20AC</span>
          <a href="${baseUrl}/offre/${product.slug}" style="margin-left:12px;font-size:12px;color:${EMAIL_STYLES.colors.navy};text-decoration:underline">Voir l'offre</a>
        </p>
      </td>
    </tr>
  </table>`;
}
