import { emailWrapper, emailButton, emailDivider, emailHeroImage, EMAIL_STYLES, EMAIL_IMAGES } from '../components/base';

export interface ReminderData {
  firstName: string;
  orderNumber: string;
  baseUrl: string;
}

export function reminderEmail(data: ReminderData): { subject: string; html: string } {
  const subject = `Rappel : votre croisière The Captain Boat — ${data.orderNumber}`;

  const content = `
    ${emailHeroImage(data.baseUrl, EMAIL_IMAGES.monuments, 'Monuments de Paris depuis la Seine')}

    <h1 style="margin:0 0 8px;font-size:22px;color:${EMAIL_STYLES.colors.navy}">Prêt pour la Seine ?</h1>
    <p style="margin:0 0 24px;color:${EMAIL_STYLES.colors.muted};font-size:14px;line-height:1.6">
      Bonjour ${data.firstName}, un petit rappel pour votre croisière. Voici les infos essentielles.
    </p>

    <div style="background:${EMAIL_STYLES.colors.bg};border-radius:8px;padding:20px 24px;margin-bottom:24px">
      <h3 style="margin:0 0 12px;font-size:14px;color:${EMAIL_STYLES.colors.navy}">Checklist embarquement</h3>
      <ul style="margin:0;padding:0 0 0 16px;color:${EMAIL_STYLES.colors.text};font-size:13px;line-height:2.2">
        <li>Port de la Conférence, Pont de l'Alma (Métro Alma-Marceau L9)</li>
        <li>Présentez-vous 20 min avant un départ</li>
        <li>Ayez votre QR code prêt (email ou app)</li>
        <li>Parking gratuit sur le quai</li>
        <li>Commentaires audio en 12 langues à bord</li>
      </ul>
    </div>

    <div style="background:${EMAIL_STYLES.colors.bg};border-radius:8px;padding:20px 24px;margin-bottom:24px">
      <h3 style="margin:0 0 12px;font-size:14px;color:${EMAIL_STYLES.colors.navy}">Horaires de départ</h3>
      <p style="margin:0;color:${EMAIL_STYLES.colors.text};font-size:13px;line-height:1.8">
        <strong>Haute saison</strong> (avr-oct) : toutes les 30 min, 10h — 22h<br>
        <strong>Basse saison</strong> (nov-mars) : toutes les 45 min, 10h15 — 21h30
      </p>
    </div>

    ${emailDivider()}

    <div style="text-align:center">
      ${emailButton('Voir mes QR codes', `${data.baseUrl}/ma-reservation`)}
    </div>

    <p style="margin:16px 0 0;font-size:12px;color:${EMAIL_STYLES.colors.muted};text-align:center">
      Votre billet est valable 2 ans. Bonne croisière !
    </p>
  `;

  return { subject, html: emailWrapper(content, data.baseUrl, `Rappel pour votre croisière — préparez votre QR code`) };
}
