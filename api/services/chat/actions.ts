import { getProductBySlug } from '@shared/products';

export interface ProductAction {
  type: 'product';
  slug: string;
  title: string;
  price: number;
  oldPrice: number;
  image: string;
  badge?: string;
  description: string;
}

export interface PromoAction {
  type: 'promo';
  slug: string;
  title: string;
  discount: number;
  originalPrice: number;
  currentPrice: number;
  badge: string;
}

export interface CartAddAction {
  type: 'cart_add';
  slug: string;
  title: string;
  adultCount: number;
  childCount: number;
  adultPrice: number;
  childPrice: number;
}

export interface CartShowAction {
  type: 'cart_show';
}

export interface CheckoutAction {
  type: 'checkout';
}

export interface WhatsAppAction {
  type: 'whatsapp';
}

export interface TicketAction {
  type: 'ticket';
  paymentIntentId: string;
}

export type ChatAction = ProductAction | PromoAction | CartAddAction | CartShowAction | CheckoutAction | WhatsAppAction | TicketAction;

const PRODUCT_MARKER_RE = /\[PRODUCT:([a-z-]+)\]/g;
const PROMO_MARKER_RE = /\[PROMO:([a-z-]+)\]/g;
const CART_ADD_MARKER_RE = /\[CART_ADD:([a-z-]+):(\d+):(\d+)\]/g;
const CART_SHOW_MARKER_RE = /\[CART_SHOW\]/g;
const CHECKOUT_MARKER_RE = /\[CHECKOUT\]/g;
const WHATSAPP_MARKER_RE = /\[WHATSAPP\]/g;
const TICKET_MARKER_RE = /\[TICKET:(pi_[a-zA-Z0-9_]+)\]/g;

export function extractActions(text: string): ChatAction[] {
  const actions: ChatAction[] = [];
  const seen = new Set<string>();

  for (const match of text.matchAll(CART_ADD_MARKER_RE)) {
    const slug = match[1];
    const adultCount = parseInt(match[2], 10);
    const childCount = parseInt(match[3], 10);

    const product = getProductBySlug(slug);
    if (product) {
      actions.push({
        type: 'cart_add',
        slug: product.slug,
        title: product.title,
        adultCount,
        childCount,
        adultPrice: product.adultNewPrice,
        childPrice: product.childNewPrice || 0,
      });
    }
  }

  if (CART_SHOW_MARKER_RE.test(text)) {
    actions.push({ type: 'cart_show' });
    CART_SHOW_MARKER_RE.lastIndex = 0;
  }

  if (CHECKOUT_MARKER_RE.test(text)) {
    actions.push({ type: 'checkout' });
    CHECKOUT_MARKER_RE.lastIndex = 0;
  }

  if (WHATSAPP_MARKER_RE.test(text)) {
    actions.push({ type: 'whatsapp' });
    WHATSAPP_MARKER_RE.lastIndex = 0;
  }

  for (const match of text.matchAll(TICKET_MARKER_RE)) {
    actions.push({ type: 'ticket', paymentIntentId: match[1] });
  }

  for (const match of text.matchAll(PROMO_MARKER_RE)) {
    const slug = match[1];
    if (seen.has(`promo-${slug}`)) continue;
    seen.add(`promo-${slug}`);

    const product = getProductBySlug(slug);
    if (product) {
      actions.push({
        type: 'promo',
        slug: product.slug,
        title: product.title,
        discount: product.adultOldPrice - product.adultNewPrice,
        originalPrice: product.adultOldPrice,
        currentPrice: product.adultNewPrice,
        badge: product.badge.text,
      });
    }
  }

  for (const match of text.matchAll(PRODUCT_MARKER_RE)) {
    const slug = match[1];
    if (seen.has(`product-${slug}`) || seen.has(`promo-${slug}`)) continue;
    seen.add(`product-${slug}`);

    const product = getProductBySlug(slug);
    if (product) {
      actions.push({
        type: 'product',
        slug: product.slug,
        title: product.title,
        price: product.adultNewPrice,
        oldPrice: product.adultOldPrice,
        image: product.mainImage,
        badge: product.badge.text,
        description: product.description.slice(0, 120),
      });
    }
  }

  return actions;
}

export function stripMarkers(text: string): string {
  return text
    .replace(PRODUCT_MARKER_RE, '')
    .replace(PROMO_MARKER_RE, '')
    .replace(CART_ADD_MARKER_RE, '')
    .replace(CART_SHOW_MARKER_RE, '')
    .replace(CHECKOUT_MARKER_RE, '')
    .replace(WHATSAPP_MARKER_RE, '')
    .replace(TICKET_MARKER_RE, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
