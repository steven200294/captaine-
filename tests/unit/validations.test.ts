import { describe, it, expect } from 'vitest';
import {
  checkoutSchema,
  reservationLookupSchema,
  qrValidateSchema,
  promoCodeSchema,
  contactFormSchema,
  adminLoginSchema,
  qrImportSchema,
} from '@shared/validations';

describe('checkoutSchema', () => {
  const validInput = {
    email: 'test@example.com',
    firstName: 'Jean',
    lastName: 'Dupont',
    items: [
      { productSlug: 'croisiere', productTitle: 'Croisiere', adultCount: 2, childCount: 1, totalPrice: 4990 },
    ],
  };

  it('accepts valid checkout input', () => {
    const result = checkoutSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it('accepts with optional phone', () => {
    const result = checkoutSchema.safeParse({ ...validInput, phone: '+33612345678' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = checkoutSchema.safeParse({ ...validInput, email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('rejects empty firstName', () => {
    const result = checkoutSchema.safeParse({ ...validInput, firstName: '' });
    expect(result.success).toBe(false);
  });

  it('rejects empty items array', () => {
    const result = checkoutSchema.safeParse({ ...validInput, items: [] });
    expect(result.success).toBe(false);
  });

  it('rejects negative totalPrice', () => {
    const input = {
      ...validInput,
      items: [{ productSlug: 'x', productTitle: 'X', adultCount: 1, childCount: 0, totalPrice: -100 }],
    };
    const result = checkoutSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it('rejects totalPrice of 0', () => {
    const input = {
      ...validInput,
      items: [{ productSlug: 'x', productTitle: 'X', adultCount: 1, childCount: 0, totalPrice: 0 }],
    };
    const result = checkoutSchema.safeParse(input);
    expect(result.success).toBe(false);
  });
});

describe('reservationLookupSchema', () => {
  it('accepts email only', () => {
    const result = reservationLookupSchema.safeParse({ email: 'a@b.com' });
    expect(result.success).toBe(true);
  });

  it('accepts email + orderNumber', () => {
    const result = reservationLookupSchema.safeParse({ email: 'a@b.com', orderNumber: 'TCB-ABC123' });
    expect(result.success).toBe(true);
  });

  it('rejects missing email', () => {
    const result = reservationLookupSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe('qrValidateSchema', () => {
  it('accepts valid code with default action', () => {
    const result = qrValidateSchema.safeParse({ code: 'QR-ABC-123' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.action).toBe('check');
  });

  it('accepts validate action', () => {
    const result = qrValidateSchema.safeParse({ code: 'QR-TEST', action: 'validate' });
    expect(result.success).toBe(true);
  });

  it('rejects code too short', () => {
    const result = qrValidateSchema.safeParse({ code: 'AB' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid action', () => {
    const result = qrValidateSchema.safeParse({ code: 'QR-TEST', action: 'delete' });
    expect(result.success).toBe(false);
  });
});

describe('promoCodeSchema', () => {
  it('accepts and uppercases code', () => {
    const result = promoCodeSchema.safeParse({ code: 'summer2024' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.code).toBe('SUMMER2024');
  });

  it('rejects code too short', () => {
    const result = promoCodeSchema.safeParse({ code: 'AB' });
    expect(result.success).toBe(false);
  });
});

describe('contactFormSchema', () => {
  it('accepts valid contact form', () => {
    const result = contactFormSchema.safeParse({
      name: 'Jean Dupont',
      email: 'jean@test.com',
      subject: 'Question sur la croisiere',
      message: 'Bonjour, je souhaite avoir des informations...',
    });
    expect(result.success).toBe(true);
  });

  it('rejects message too short', () => {
    const result = contactFormSchema.safeParse({
      name: 'Jean', email: 'a@b.com', subject: 'Hello World', message: 'Hi',
    });
    expect(result.success).toBe(false);
  });
});

describe('adminLoginSchema', () => {
  it('accepts valid login', () => {
    const result = adminLoginSchema.safeParse({ email: 'admin@tcb.com', password: 'securepass123' });
    expect(result.success).toBe(true);
  });

  it('rejects short password', () => {
    const result = adminLoginSchema.safeParse({ email: 'admin@tcb.com', password: '1234567' });
    expect(result.success).toBe(false);
  });
});

describe('qrImportSchema', () => {
  it('accepts valid QR import', () => {
    const result = qrImportSchema.safeParse({
      codes: [
        { code: 'QR-ADULT-001', type: 'adult' },
        { code: 'QR-CHILD-001', type: 'child' },
      ],
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty codes array', () => {
    const result = qrImportSchema.safeParse({ codes: [] });
    expect(result.success).toBe(false);
  });

  it('rejects invalid type', () => {
    const result = qrImportSchema.safeParse({
      codes: [{ code: 'QR-001', type: 'vip' }],
    });
    expect(result.success).toBe(false);
  });
});
