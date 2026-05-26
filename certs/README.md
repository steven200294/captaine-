# Apple Wallet & Google Wallet Certificates

Ce dossier contient les certificats necessaires pour la generation des passes.

## Apple Wallet

Placez ces fichiers dans `apple-wallet/` :
- `signerCert.pem` — Certificat Apple Pass Type ID (format PEM)
- `signerKey.pem` — Cle privee du certificat (format PEM)
- `wwdr.pem` — Apple Worldwide Developer Relations (WWDR) certificate

### Comment obtenir les certificats :
1. Creer un Pass Type ID sur https://developer.apple.com/account/resources/identifiers
2. Generer un certificat pour ce Pass Type ID
3. Exporter le certificat au format `.p12` depuis Keychain Access
4. Convertir en PEM :
   ```bash
   openssl pkcs12 -in pass.p12 -clcerts -nokeys -out signerCert.pem
   openssl pkcs12 -in pass.p12 -nocerts -out signerKey.pem
   ```
5. Telecharger WWDR depuis https://www.apple.com/certificateauthority/

## Google Wallet

Placez ce fichier dans `google-wallet/` :
- `service-account.json` — Google Cloud service account credentials

### Comment obtenir les credentials :
1. Creer un projet sur Google Cloud Console
2. Activer l'API Google Wallet
3. S'inscrire sur https://pay.google.com/business/console (Google Pay & Wallet Console)
4. Creer un service account avec le role "Google Wallet API"
5. Telecharger les credentials JSON

## Variables d'environnement

```env
# Apple Wallet
APPLE_PASS_TYPE_ID=pass.com.thecaptainboat.ticket
APPLE_TEAM_ID=XXXXXXXXXX
APPLE_PASS_KEY_PASSPHRASE=your-passphrase

# Google Wallet
GOOGLE_WALLET_ISSUER_ID=3388000000XXXXXXXX
```
