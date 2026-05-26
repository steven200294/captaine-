export interface Database {
  public: {
    Tables: {
      reservations: {
        Row: {
          id: string;
          order_number: string;
          email: string;
          first_name: string;
          last_name: string;
          phone: string | null;
          status: string;
          cruise_date: string | null;
          cruise_time: string | null;
          total_amount: number;
          stripe_payment_intent_id: string | null;
          stripe_session_id: string | null;
          pdf_url: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          email: string;
          first_name: string;
          last_name: string;
          phone?: string | null;
          status?: string;
          cruise_date?: string | null;
          cruise_time?: string | null;
          total_amount: number;
          stripe_payment_intent_id?: string | null;
          stripe_session_id?: string | null;
          pdf_url?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['reservations']['Insert']>;
      };
      reservation_items: {
        Row: {
          id: string;
          reservation_id: string;
          product_slug: string;
          product_title: string;
          quantity: number;
          adult_count: number;
          child_count: number;
          unit_price: number;
          total_price: number;
          premium_options: unknown;
          created_at: string;
        };
        Insert: {
          id?: string;
          reservation_id: string;
          product_slug: string;
          product_title: string;
          quantity?: number;
          adult_count?: number;
          child_count?: number;
          unit_price: number;
          total_price: number;
          premium_options?: unknown;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['reservation_items']['Insert']>;
      };
      qr_codes: {
        Row: {
          id: string;
          code: string;
          type: string;
          status: string;
          batch_id: string | null;
          reservation_id: string | null;
          assigned_at: string | null;
          used_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          type: string;
          status?: string;
          batch_id?: string | null;
          reservation_id?: string | null;
          assigned_at?: string | null;
          used_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['qr_codes']['Insert']>;
      };
      qr_batches: {
        Row: {
          id: string;
          imported_by: string;
          adult_count: number;
          child_count: number;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          imported_by: string;
          adult_count?: number;
          child_count?: number;
          notes?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['qr_batches']['Insert']>;
      };
      esim_orders: {
        Row: {
          id: string;
          reservation_id: string;
          provider_order_id: string | null;
          license_cli: string | null;
          iccid: string | null;
          qr_code_url: string | null;
          activation_code: string | null;
          smdp_address: string | null;
          ios_link: string | null;
          package_type: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          reservation_id: string;
          provider_order_id?: string | null;
          license_cli?: string | null;
          iccid?: string | null;
          qr_code_url?: string | null;
          activation_code?: string | null;
          smdp_address?: string | null;
          ios_link?: string | null;
          package_type: string;
          status?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['esim_orders']['Insert']>;
      };
      products: {
        Row: {
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
          esim_package: string | null;
          has_macarons: boolean;
          duration: string | null;
          location: string | null;
          main_image: string | null;
          thumbnails: unknown;
          tags: unknown;
          features: unknown;
          premium_options: unknown;
          active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description?: string | null;
          badge_text?: string | null;
          badge_color?: string | null;
          adult_price: number;
          adult_old_price?: number | null;
          child_price?: number | null;
          child_old_price?: number | null;
          child_note?: string | null;
          is_pack?: boolean;
          has_esim?: boolean;
          esim_package?: string | null;
          has_macarons?: boolean;
          duration?: string | null;
          location?: string | null;
          main_image?: string | null;
          thumbnails?: unknown;
          tags?: unknown;
          features?: unknown;
          premium_options?: unknown;
          active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      admin_users: {
        Row: {
          id: string;
          role: string;
          display_name: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          role?: string;
          display_name?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['admin_users']['Insert']>;
      };
      promo_codes: {
        Row: {
          id: string;
          code: string;
          discount_type: string;
          discount_value: number;
          max_uses: number | null;
          current_uses: number;
          valid_from: string | null;
          valid_until: string | null;
          active: boolean;
          stripe_coupon_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          discount_type: string;
          discount_value: number;
          max_uses?: number | null;
          current_uses?: number;
          valid_from?: string | null;
          valid_until?: string | null;
          active?: boolean;
          stripe_coupon_id?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['promo_codes']['Insert']>;
      };
      chat_sessions: {
        Row: {
          id: string;
          session_token: string;
          messages: unknown;
          actions_taken: unknown;
          converted: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          session_token: string;
          messages?: unknown;
          actions_taken?: unknown;
          converted?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['chat_sessions']['Insert']>;
      };
    };
  };
}
