export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'refunded';
export type QRCodeStatus = 'available' | 'assigned' | 'used' | 'expired';
export type QRCodeType = 'adult' | 'child';
export type AdminRole = 'admin' | 'validator' | 'super_admin';
export type DiscountType = 'percentage' | 'fixed';
export type ESIMStatus = 'pending' | 'provisioned' | 'activated' | 'failed';
export type ESIMPackage = '3gb' | '10gb';

export interface Reservation {
  id: string;
  order_number: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  status: ReservationStatus;
  cruise_date: string | null;
  cruise_time: string | null;
  total_amount: number;
  stripe_payment_intent_id: string | null;
  stripe_session_id: string | null;
  pdf_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReservationItem {
  id: string;
  reservation_id: string;
  product_slug: string;
  product_title: string;
  quantity: number;
  adult_count: number;
  child_count: number;
  unit_price: number;
  total_price: number;
  premium_options: PremiumOptionSelection[];
  created_at: string;
}

export interface PremiumOptionSelection {
  name: string;
  price: number;
  quantity: number;
}

export interface QRCode {
  id: string;
  code: string;
  type: QRCodeType;
  status: QRCodeStatus;
  batch_id: string | null;
  reservation_id: string | null;
  assigned_at: string | null;
  used_at: string | null;
  created_at: string;
}

export interface QRBatch {
  id: string;
  imported_by: string;
  adult_count: number;
  child_count: number;
  notes: string | null;
  created_at: string;
}

export interface ESIMOrder {
  id: string;
  reservation_id: string;
  provider_order_id: string | null;
  license_cli: string | null;
  iccid: string | null;
  qr_code_url: string | null;
  activation_code: string | null;
  smdp_address: string | null;
  ios_link: string | null;
  package_type: ESIMPackage;
  status: ESIMStatus;
  created_at: string;
}

export interface PromoCode {
  id: string;
  code: string;
  discount_type: DiscountType;
  discount_value: number;
  max_uses: number | null;
  current_uses: number;
  valid_from: string | null;
  valid_until: string | null;
  active: boolean;
  stripe_coupon_id: string | null;
  created_at: string;
}

export interface AdminUser {
  id: string;
  role: AdminRole;
  display_name: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  badge_text: string | null;
  badge_color: string | null;
  adult_price: number;
  adult_old_price: number | null;
  child_price: number | null;
  child_old_price: number | null;
  child_note: string | null;
  is_pack: boolean;
  has_esim: boolean;
  esim_package: ESIMPackage | null;
  has_macarons: boolean;
  duration: string | null;
  location: string | null;
  main_image: string | null;
  thumbnails: string[];
  tags: string[];
  features: ProductFeature[];
  premium_options: ProductPremiumOption[];
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProductFeature {
  icon: string;
  title: string;
  description: string;
  label: string;
  highlighted?: boolean;
}

export interface ProductPremiumOption {
  name: string;
  price: number;
}
