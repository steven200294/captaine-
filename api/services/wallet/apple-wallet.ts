import path from 'path';
import fs from 'fs';
import { PKPass } from 'passkit-generator';
import type { WalletPassData } from './types';

const CERTS_DIR = path.join(process.cwd(), 'certs', 'apple-wallet');
const MODEL_DIR = path.join(process.cwd(), 'api', 'services', 'wallet', 'apple-pass-model');

function certsAvailable(): boolean {
  try {
    return (
      fs.existsSync(path.join(CERTS_DIR, 'signerCert.pem')) &&
      fs.existsSync(path.join(CERTS_DIR, 'signerKey.pem')) &&
      fs.existsSync(path.join(CERTS_DIR, 'wwdr.pem'))
    );
  } catch {
    return false;
  }
}

export async function generateApplePass(data: WalletPassData): Promise<Buffer | null> {
  if (!certsAvailable()) {
    console.log('[APPLE_WALLET] Certificates not found — skipping pass generation (dev mode)');
    return null;
  }

  const signerCert = fs.readFileSync(path.join(CERTS_DIR, 'signerCert.pem'));
  const signerKey = fs.readFileSync(path.join(CERTS_DIR, 'signerKey.pem'));
  const wwdr = fs.readFileSync(path.join(CERTS_DIR, 'wwdr.pem'));

  const passphrase = process.env.APPLE_PASS_KEY_PASSPHRASE || '';

  const pass = new PKPass(
    {},
    {
      wwdr,
      signerCert,
      signerKey,
      signerKeyPassphrase: passphrase,
    },
    {
      serialNumber: data.orderNumber,
      description: `Billet Croisiere - ${data.orderNumber}`,
      organizationName: 'The Captain Boat',
      passTypeIdentifier: process.env.APPLE_PASS_TYPE_ID || 'pass.com.thecaptainboat.ticket',
      teamIdentifier: process.env.APPLE_TEAM_ID || 'TEAM_ID',
      foregroundColor: 'rgb(255, 255, 255)',
      backgroundColor: 'rgb(28, 53, 94)',
      labelColor: 'rgb(255, 184, 0)',
      logoText: 'The Captain Boat',
    }
  );

  pass.type = 'generic';

  pass.primaryFields.push({
    key: 'orderNumber',
    label: 'N° COMMANDE',
    value: data.orderNumber,
  });

  pass.secondaryFields.push(
    {
      key: 'passengers',
      label: 'PASSAGERS',
      value: `${data.adultCount} adulte${data.adultCount > 1 ? 's' : ''}${data.childCount > 0 ? ` + ${data.childCount} enfant${data.childCount > 1 ? 's' : ''}` : ''}`,
    },
    {
      key: 'date',
      label: 'DATE',
      value: data.cruiseDate || 'Billet ouvert',
    }
  );

  pass.auxiliaryFields.push({
    key: 'location',
    label: 'EMBARQUEMENT',
    value: 'Port de la Bourdonnais, Paris',
  });

  pass.backFields.push(
    {
      key: 'name',
      label: 'Passager',
      value: `${data.firstName} ${data.lastName}`,
    },
    {
      key: 'email',
      label: 'Email',
      value: data.email,
    },
    {
      key: 'amount',
      label: 'Montant',
      value: `${(data.totalAmount / 100).toFixed(2)} EUR`,
    },
    {
      key: 'info',
      label: 'Informations pratiques',
      value: 'Presentez ce pass a l\'embarquement.\n\nPort de la Bourdonnais, 75007 Paris\nMetro : Trocadero (L6/L9) ou Bir-Hakeim (L6)\nRER C : Champ de Mars\n\ncontact@thecaptainboat.com',
    }
  );

  pass.setBarcodes({
    message: data.qrCodeValue,
    format: 'PKBarcodeFormatQR',
    messageEncoding: 'iso-8859-1',
  });

  const logoPath = path.join(process.cwd(), 'public', 'images', 'logo.png');
  if (fs.existsSync(logoPath)) {
    pass.addBuffer('logo.png', fs.readFileSync(logoPath));
    pass.addBuffer('logo@2x.png', fs.readFileSync(logoPath));
  }

  const iconPath = path.join(process.cwd(), 'public', 'images', 'logo.png');
  if (fs.existsSync(iconPath)) {
    pass.addBuffer('icon.png', fs.readFileSync(iconPath));
    pass.addBuffer('icon@2x.png', fs.readFileSync(iconPath));
  }

  const buffer = pass.getAsBuffer();
  return buffer;
}
