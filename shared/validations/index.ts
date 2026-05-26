import { z } from 'zod';

export const checkoutSchema = z.object({
  email: z.string().email('Email invalide'),
  firstName: z.string().min(1, 'Prénom requis').max(50),
  lastName: z.string().min(1, 'Nom requis').max(50),
  phone: z.string().optional(),
  items: z.array(z.object({
    productSlug: z.string().min(1),
    productTitle: z.string().min(1),
    adultCount: z.number().int().min(0),
    childCount: z.number().int().min(0),
    totalPrice: z.number().int().positive('Prix invalide'),
  })).min(1, 'Panier vide'),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const reservationLookupSchema = z.object({
  email: z.string().email('Email invalide'),
  orderNumber: z.string().optional(),
});

export type ReservationLookupInput = z.infer<typeof reservationLookupSchema>;

export const qrValidateSchema = z.object({
  code: z.string().min(5, 'Code QR invalide').max(50),
  action: z.enum(['validate', 'check']).default('check'),
});

export type QRValidateInput = z.infer<typeof qrValidateSchema>;

export const promoCodeSchema = z.object({
  code: z.string().min(3).max(20).toUpperCase(),
});

export type PromoCodeInput = z.infer<typeof promoCodeSchema>;

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Nom trop court').max(100),
  email: z.string().email('Email invalide'),
  subject: z.string().min(5, 'Sujet trop court').max(200),
  message: z.string().min(10, 'Message trop court').max(2000),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

export const qrImportSchema = z.object({
  codes: z.array(z.object({
    code: z.string().min(5),
    type: z.enum(['adult', 'child']),
  })).min(1, 'Aucun QR code'),
});

export type QRImportInput = z.infer<typeof qrImportSchema>;
