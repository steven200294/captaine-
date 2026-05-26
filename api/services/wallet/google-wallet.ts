import { SignJWT } from 'jose';
import fs from 'fs';
import path from 'path';
import type { WalletPassData } from './types';

const GOOGLE_ISSUER_ID = process.env.GOOGLE_WALLET_ISSUER_ID || '';
const GOOGLE_CREDENTIALS_PATH = path.join(process.cwd(), 'certs', 'google-wallet', 'service-account.json');

interface GoogleCredentials {
  client_email: string;
  private_key: string;
}

function loadCredentials(): GoogleCredentials | null {
  try {
    if (!fs.existsSync(GOOGLE_CREDENTIALS_PATH)) return null;
    const raw = fs.readFileSync(GOOGLE_CREDENTIALS_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    return { client_email: parsed.client_email, private_key: parsed.private_key };
  } catch {
    return null;
  }
}

export async function generateGoogleWalletUrl(data: WalletPassData): Promise<string | null> {
  const credentials = loadCredentials();

  if (!credentials || !GOOGLE_ISSUER_ID) {
    console.log('[GOOGLE_WALLET] Credentials or issuer ID not found — skipping (dev mode)');
    return null;
  }

  const classId = `${GOOGLE_ISSUER_ID}.captainboat_cruise`;
  const objectId = `${GOOGLE_ISSUER_ID}.${data.orderNumber.replace(/[^a-zA-Z0-9_.-]/g, '_')}`;

  const genericObject = {
    id: objectId,
    classId,
    genericType: 'GENERIC_TYPE_UNSPECIFIED',
    hexBackgroundColor: '#1c355e',
    logo: {
      sourceUri: {
        uri: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://thecaptainboat.com'}/images/logo.png`,
      },
      contentDescription: {
        defaultValue: { language: 'fr', value: 'The Captain Boat' },
      },
    },
    cardTitle: {
      defaultValue: { language: 'fr', value: 'The Captain Boat' },
    },
    subheader: {
      defaultValue: { language: 'fr', value: 'Croisiere sur la Seine' },
    },
    header: {
      defaultValue: { language: 'fr', value: `${data.firstName} ${data.lastName}` },
    },
    barcode: {
      type: 'QR_CODE',
      value: data.qrCodeValue,
    },
    heroImage: {
      sourceUri: {
        uri: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://thecaptainboat.com'}/images/cruise-hero.jpg`,
      },
      contentDescription: {
        defaultValue: { language: 'fr', value: 'Croisiere Paris Seine' },
      },
    },
    textModulesData: [
      {
        id: 'order',
        header: 'N° COMMANDE',
        body: data.orderNumber,
      },
      {
        id: 'passengers',
        header: 'PASSAGERS',
        body: `${data.adultCount} adulte${data.adultCount > 1 ? 's' : ''}${data.childCount > 0 ? ` + ${data.childCount} enfant${data.childCount > 1 ? 's' : ''}` : ''}`,
      },
      {
        id: 'date',
        header: 'DATE',
        body: data.cruiseDate || 'Billet ouvert',
      },
      {
        id: 'location',
        header: 'EMBARQUEMENT',
        body: 'Port de la Bourdonnais, 75007 Paris',
      },
    ],
  };

  const genericClass = {
    id: classId,
    genericType: 'GENERIC_TYPE_UNSPECIFIED',
    classTemplateInfo: {
      cardTemplateOverride: {
        cardRowTemplateInfos: [
          {
            twoItems: {
              startItem: { firstValue: { fields: [{ fieldPath: "object.textModulesData['order']" }] } },
              endItem: { firstValue: { fields: [{ fieldPath: "object.textModulesData['passengers']" }] } },
            },
          },
          {
            twoItems: {
              startItem: { firstValue: { fields: [{ fieldPath: "object.textModulesData['date']" }] } },
              endItem: { firstValue: { fields: [{ fieldPath: "object.textModulesData['location']" }] } },
            },
          },
        ],
      },
    },
  };

  const claims = {
    iss: credentials.client_email,
    aud: 'google',
    origins: [process.env.NEXT_PUBLIC_BASE_URL || 'https://thecaptainboat.com'],
    typ: 'savetowallet',
    payload: {
      genericClasses: [genericClass],
      genericObjects: [genericObject],
    },
  };

  const privateKey = await importPKCS8Key(credentials.private_key);
  const token = await new SignJWT(claims)
    .setProtectedHeader({ alg: 'RS256' })
    .setIssuedAt()
    .sign(privateKey);

  return `https://pay.google.com/gp/v/save/${token}`;
}

async function importPKCS8Key(pem: string) {
  const pemContents = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\n/g, '');

  const binaryDer = Buffer.from(pemContents, 'base64');

  return crypto.subtle.importKey(
    'pkcs8',
    binaryDer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    true,
    ['sign']
  );
}
