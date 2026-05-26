import { emailWrapper, emailButton, emailDivider, emailInfoRow, emailHeroImage, EMAIL_STYLES, EMAIL_IMAGES } from '../components/base';

export interface ReservationConfirmationData {
  orderNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  totalAmount: number;
  items: Array<{
    title: string;
    adultCount: number;
    childCount: number;
    price: number;
  }>;
  qrCodes: Array<{
    code: string;
    type: 'adult' | 'child';
  }>;
  baseUrl: string;
  googleWalletUrl?: string;
}

export function reservationConfirmationEmail(data: ReservationConfirmationData): { subject: string; html: string } {
  const subject = `Confirmation ${data.orderNumber} — Vos billets The Captain Boat`;

  const itemsHtml = data.items.map((item) => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid ${EMAIL_STYLES.colors.border}">
        <strong style="color:${EMAIL_STYLES.colors.navy};font-size:14px">${item.title}</strong>
        <br><span style="color:${EMAIL_STYLES.colors.muted};font-size:12px">${item.adultCount} adulte${item.adultCount > 1 ? 's' : ''}${item.childCount > 0 ? ` + ${item.childCount} enfant${item.childCount > 1 ? 's' : ''}` : ''}</span>
      </td>
      <td style="padding:12px 0;border-bottom:1px solid ${EMAIL_STYLES.colors.border};text-align:right;font-weight:600;color:${EMAIL_STYLES.colors.text}">${(item.price / 100).toFixed(2)}\u20AC</td>
    </tr>
  `).join('');

  const qrHtml = data.qrCodes.map((qr) => `
    <div style="display:inline-block;background:${EMAIL_STYLES.colors.bg};border:1px solid ${EMAIL_STYLES.colors.border};border-radius:8px;padding:12px 16px;margin:4px;text-align:center;min-width:120px">
      <span style="font-size:11px;font-weight:600;color:${EMAIL_STYLES.colors.muted};text-transform:uppercase;letter-spacing:0.5px">${qr.type === 'adult' ? 'Adulte' : 'Enfant'}</span>
      <br><code style="font-size:12px;color:${EMAIL_STYLES.colors.navy};font-weight:700">${qr.code}</code>
    </div>
  `).join('');

  const content = `
    ${emailHeroImage(data.baseUrl, EMAIL_IMAGES.cruiseHero, 'Croisière sur la Seine')}

    <h1 style="margin:0 0 8px;font-size:22px;color:${EMAIL_STYLES.colors.navy}">Réservation confirmée</h1>
    <p style="margin:0 0 24px;color:${EMAIL_STYLES.colors.muted};font-size:14px;line-height:1.6">
      Bonjour ${data.firstName}, votre commande a bien été enregistrée. Vos billets sont prêts.
    </p>

    <!-- Order info -->
    <div style="background:${EMAIL_STYLES.colors.bg};border-radius:8px;padding:16px 20px;margin-bottom:24px">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${emailInfoRow('Commande', data.orderNumber)}
        ${emailInfoRow('Total', `${(data.totalAmount / 100).toFixed(2)}\u20AC`)}
      </table>
    </div>

    <!-- Items -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px">
      ${itemsHtml}
    </table>

    ${emailDivider()}

    <!-- QR Codes -->
    <h2 style="margin:0 0 12px;font-size:16px;color:${EMAIL_STYLES.colors.navy}">Vos QR Codes</h2>
    <p style="margin:0 0 16px;color:${EMAIL_STYLES.colors.muted};font-size:13px">
      Présentez ces codes à l'embarquement. Un PDF est joint à cet email.
    </p>
    <div style="text-align:center;margin-bottom:24px">
      ${qrHtml}
    </div>

    ${emailDivider()}

    <!-- Wallet Passes -->
    <h2 style="margin:0 0 12px;font-size:16px;color:${EMAIL_STYLES.colors.navy}">Ajouter au Wallet</h2>
    <p style="margin:0 0 16px;color:${EMAIL_STYLES.colors.muted};font-size:13px">
      Gardez votre billet accessible en un geste — ajoutez-le a votre portefeuille mobile.
    </p>
    <div style="text-align:center;margin-bottom:8px">
      <a href="cid:pkpass" style="display:inline-block;margin:0 8px 12px 0">
        <img src="${data.baseUrl}/images/wallet/add-to-apple-wallet.svg" alt="Ajouter a Apple Wallet" width="156" height="48" style="border:0;display:inline-block" />
      </a>
      ${data.googleWalletUrl ? `<a href="${data.googleWalletUrl}" style="display:inline-block;margin:0 0 12px 0" target="_blank">
        <img src="${data.baseUrl}/images/wallet/add-to-google-wallet.svg" alt="Ajouter a Google Wallet" width="180" height="48" style="border:0;display:inline-block" />
      </a>` : ''}
    </div>
    <p style="margin:0 0 24px;color:${EMAIL_STYLES.colors.muted};font-size:11px;text-align:center">
      Apple Wallet : ouvrez la piece jointe .pkpass depuis votre iPhone.
    </p>

    ${emailDivider()}

    <!-- CTA -->
    <div style="text-align:center">
      ${emailButton('Voir ma réservation', `${data.baseUrl}/ma-reservation`)}
    </div>

    ${emailDivider()}

    <!-- Practical info -->
    <h3 style="margin:0 0 8px;font-size:14px;color:${EMAIL_STYLES.colors.navy}">Infos pratiques</h3>
    <ul style="margin:0;padding:0 0 0 16px;color:${EMAIL_STYLES.colors.text};font-size:13px;line-height:2">
      <li>Embarquement : Port de la Conférence, Pont de l'Alma (Métro Alma-Marceau L9)</li>
      <li>Présentez-vous 20 min avant avec votre QR code</li>
      <li>Billet valable 2 ans — pas de réservation horaire nécessaire</li>
      <li>Parking gratuit sur le quai pendant la croisière</li>
    </ul>
  `;

  return { subject, html: emailWrapper(content, data.baseUrl, `Vos billets pour la Seine — ${data.orderNumber}`) };
}
