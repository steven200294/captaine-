import { emailWrapper, emailButton, emailDivider, EMAIL_STYLES, EMAIL_IMAGES, emailHeroImage } from '../components/base';

export interface ESIMActivationData {
  firstName: string;
  orderNumber: string;
  packageType: '3gb' | '10gb';
  qrCodeUrl: string;
  smdpAddress: string;
  iosLink: string;
  iccid: string;
  baseUrl: string;
}

export function esimActivationEmail(data: ESIMActivationData): { subject: string; html: string } {
  const subject = `Votre eSIM ${data.packageType.toUpperCase()} est prête — ${data.orderNumber}`;
  const dataLabel = data.packageType === '3gb' ? '3 Go' : '10 Go';

  const content = `
    ${emailHeroImage(data.baseUrl, EMAIL_IMAGES.esim, 'eSIM Europe & UK')}

    <h1 style="margin:0 0 8px;font-size:22px;color:${EMAIL_STYLES.colors.navy}">Votre eSIM est prête</h1>
    <p style="margin:0 0 24px;color:${EMAIL_STYLES.colors.muted};font-size:14px;line-height:1.6">
      Bonjour ${data.firstName}, votre eSIM ${dataLabel} Europe & UK (30 jours) est activée.
    </p>

    <!-- QR Code eSIM -->
    <div style="text-align:center;margin-bottom:24px">
      <div style="background:${EMAIL_STYLES.colors.bg};border:1px solid ${EMAIL_STYLES.colors.border};border-radius:12px;padding:24px;display:inline-block">
        <img src="${data.qrCodeUrl}" alt="QR Code eSIM" width="200" height="200" style="display:block;margin:0 auto">
        <p style="margin:12px 0 0;font-size:11px;color:${EMAIL_STYLES.colors.muted}">Scannez ce QR code dans vos réglages</p>
      </div>
    </div>

    ${emailDivider()}

    <!-- Steps -->
    <h2 style="margin:0 0 16px;font-size:16px;color:${EMAIL_STYLES.colors.navy}">Comment activer</h2>
    
    <div style="margin-bottom:24px">
      <h3 style="margin:0 0 8px;font-size:13px;color:${EMAIL_STYLES.colors.navy}">iPhone (iOS 12.1+)</h3>
      <ol style="margin:0;padding:0 0 0 16px;color:${EMAIL_STYLES.colors.text};font-size:13px;line-height:2">
        <li>Réglages — Données cellulaires — Ajouter un forfait</li>
        <li>Scanner le QR code ci-dessus</li>
        <li>Accepter le forfait</li>
      </ol>
      ${data.iosLink ? `<p style="margin:8px 0 0;font-size:12px"><a href="${data.iosLink}" style="color:${EMAIL_STYLES.colors.navy}">Installation directe (iOS)</a></p>` : ''}
    </div>

    <div style="margin-bottom:24px">
      <h3 style="margin:0 0 8px;font-size:13px;color:${EMAIL_STYLES.colors.navy}">Android (Pixel, Samsung, etc.)</h3>
      <ol style="margin:0;padding:0 0 0 16px;color:${EMAIL_STYLES.colors.text};font-size:13px;line-height:2">
        <li>Paramètres — Réseau — SIM — Ajouter eSIM</li>
        <li>Scanner le QR code ci-dessus</li>
        <li>Confirmer l'activation</li>
      </ol>
    </div>

    ${emailDivider()}

    <!-- Technical details -->
    <div style="background:${EMAIL_STYLES.colors.bg};border-radius:8px;padding:16px 20px;margin-bottom:24px">
      <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:${EMAIL_STYLES.colors.muted};text-transform:uppercase;letter-spacing:0.5px">Détails techniques</p>
      <table cellpadding="0" cellspacing="0" style="font-size:12px;color:${EMAIL_STYLES.colors.text}">
        <tr><td style="padding:4px 16px 4px 0;color:${EMAIL_STYLES.colors.muted}">ICCID</td><td><code>${data.iccid}</code></td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:${EMAIL_STYLES.colors.muted}">SM-DP+</td><td><code>${data.smdpAddress}</code></td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:${EMAIL_STYLES.colors.muted}">Forfait</td><td>${dataLabel} — Europe & UK — 30 jours</td></tr>
      </table>
    </div>

    <div style="text-align:center">
      ${emailButton('Ma réservation', `${data.baseUrl}/ma-reservation`)}
    </div>

    <p style="margin:16px 0 0;font-size:12px;color:${EMAIL_STYLES.colors.muted};text-align:center">
      Support eSIM : contactez BNESIM directement pour l'assistance technique.
    </p>
  `;

  return { subject, html: emailWrapper(content, data.baseUrl, `Votre eSIM ${dataLabel} est prête à être activée`) };
}
