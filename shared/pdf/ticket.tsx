import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';
import type { TicketData } from './types';

const NAVY = '#1c355e';
const GOLD = '#FFB800';
const SLATE_700 = '#475569';
const SLATE_500 = '#64748b';
const BG = '#f8f9fa';
const WHITE = '#ffffff';
const GREEN = '#28a745';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: WHITE,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: NAVY,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: GOLD,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  brandName: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: NAVY,
    letterSpacing: -0.5,
  },
  orderBadge: {
    backgroundColor: BG,
    borderRadius: 6,
    padding: '6 12',
    alignItems: 'center',
  },
  orderLabel: {
    fontSize: 8,
    color: SLATE_500,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  orderNumber: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: NAVY,
    marginTop: 2,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: NAVY,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
    color: SLATE_700,
    marginBottom: 20,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  infoCard: {
    flex: 1,
    backgroundColor: BG,
    borderRadius: 8,
    padding: 12,
  },
  infoLabel: {
    fontSize: 8,
    color: SLATE_500,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: NAVY,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: NAVY,
    marginBottom: 12,
    marginTop: 8,
  },
  qrGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  qrCard: {
    alignItems: 'center',
    backgroundColor: BG,
    borderRadius: 8,
    padding: 12,
    width: 140,
  },
  qrImage: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  qrLabel: {
    fontSize: 8,
    color: SLATE_500,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  qrCode: {
    fontSize: 9,
    fontFamily: 'Courier',
    color: NAVY,
    marginTop: 2,
  },
  qrStatus: {
    fontSize: 7,
    color: GREEN,
    fontFamily: 'Helvetica-Bold',
    marginTop: 4,
    textTransform: 'uppercase',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginVertical: 16,
  },
  practicalSection: {
    backgroundColor: BG,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  practicalRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  practicalBullet: {
    width: 14,
    fontSize: 9,
    color: GOLD,
    fontFamily: 'Helvetica-Bold',
  },
  practicalText: {
    fontSize: 9,
    color: SLATE_700,
    flex: 1,
    lineHeight: 1.4,
  },
  esimSection: {
    backgroundColor: '#f0f4ff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  esimTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: NAVY,
    marginBottom: 8,
  },
  esimQr: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginVertical: 8,
  },
  esimInfo: {
    fontSize: 8,
    color: SLATE_700,
    marginTop: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
  },
  footerText: {
    fontSize: 8,
    color: SLATE_500,
  },
  footerBrand: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: NAVY,
  },
  validBadge: {
    position: 'absolute',
    top: 40,
    right: 40,
    backgroundColor: '#ecfdf5',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  validText: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: GREEN,
    textTransform: 'uppercase',
  },
});

const PRACTICAL_INFO = [
  'Port de la Conference, Pont de l\'Alma (Metro Alma-Marceau L9)',
  'Presentez-vous 20 min avant un depart avec ce document',
  'Billet valable 2 ans — pas de reservation horaire necessaire',
  'Parking gratuit sur le quai pendant la croisiere',
  'Commentaires audio en 12 langues disponibles a bord',
];

export function TicketPDF({ data }: { data: TicketData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Valid badge */}
        <View style={styles.validBadge}>
          <Text style={styles.validText}>Billet valide</Text>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            {data.logoUrl && (
              <Image src={data.logoUrl} style={styles.logo} />
            )}
            <Text style={styles.brandName}>THE CAPTAIN BOAT</Text>
          </View>
          <View style={styles.orderBadge}>
            <Text style={styles.orderLabel}>Commande</Text>
            <Text style={styles.orderNumber}>{data.orderNumber}</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Vos billets de croisiere</Text>
        <Text style={styles.subtitle}>
          {data.firstName} {data.lastName} — {data.items.length} offre{data.items.length > 1 ? 's' : ''}
        </Text>

        {/* Info grid */}
        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Passagers</Text>
            <Text style={styles.infoValue}>
              {data.totalAdults} adulte{data.totalAdults > 1 ? 's' : ''}
              {data.totalChildren > 0 ? ` + ${data.totalChildren} enfant${data.totalChildren > 1 ? 's' : ''}` : ''}
            </Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Total paye</Text>
            <Text style={styles.infoValue}>{(data.totalAmount / 100).toFixed(2)} EUR</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{data.email}</Text>
          </View>
        </View>

        {/* QR Codes */}
        <Text style={styles.sectionTitle}>QR Codes — Presentez a l'embarquement</Text>
        <View style={styles.qrGrid}>
          {data.qrCodes.map((qr, i) => (
            <View key={i} style={styles.qrCard}>
              <Image src={qr.imageDataUrl} style={styles.qrImage} />
              <Text style={styles.qrLabel}>{qr.type === 'adult' ? 'Adulte' : 'Enfant'}</Text>
              <Text style={styles.qrCode}>{qr.code}</Text>
              <Text style={styles.qrStatus}>Valide</Text>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        {/* Practical info */}
        <Text style={styles.sectionTitle}>Infos pratiques</Text>
        <View style={styles.practicalSection}>
          {PRACTICAL_INFO.map((info, i) => (
            <View key={i} style={styles.practicalRow}>
              <Text style={styles.practicalBullet}>{'>'}</Text>
              <Text style={styles.practicalText}>{info}</Text>
            </View>
          ))}
        </View>

        {/* eSIM section (if applicable) */}
        {data.esim && (
          <>
            <Text style={styles.sectionTitle}>Votre eSIM {data.esim.packageType === '3gb' ? '3 Go' : '10 Go'}</Text>
            <View style={styles.esimSection}>
              <Text style={styles.esimTitle}>
                eSIM Europe & UK — 30 jours
              </Text>
              {data.esim.qrImageDataUrl && (
                <Image src={data.esim.qrImageDataUrl} style={styles.esimQr} />
              )}
              <Text style={styles.esimInfo}>ICCID: {data.esim.iccid}</Text>
              <Text style={styles.esimInfo}>SM-DP+: {data.esim.smdpAddress}</Text>
              <Text style={{ ...styles.esimInfo, marginTop: 8 }}>
                iPhone: Reglages &gt; Donnees cellulaires &gt; Ajouter un forfait &gt; Scanner QR
              </Text>
              <Text style={styles.esimInfo}>
                Android: Parametres &gt; Reseau &gt; SIM &gt; Ajouter eSIM &gt; Scanner QR
              </Text>
            </View>
          </>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            The Captain Boat — Port de la Conference, 75008 Paris
          </Text>
          <Text style={styles.footerBrand}>thecaptainboat.com</Text>
        </View>
      </Page>
    </Document>
  );
}
