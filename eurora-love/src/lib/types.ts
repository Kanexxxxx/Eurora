export type Theme = "black-luxury" | "neon-romance" | "minimal-love" | "velvet-dark";
export type Plan = "basic" | "premium";

export interface Couple {
  id: string;
  slug: string;
  person1: string;
  person2: string;
  message: string;
  music_url: string | null;
  relationship_date: string;
  theme: Theme;
  plan: Plan;
  paid: boolean;
  payment_id: string | null;
  photo_urls: string[];
  qr_code_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface WizardData {
  person1: string;
  person2: string;
  photos: File[];
  photoPreviewUrls: string[];
  message: string;
  music_url: string;
  relationship_date: string;
  theme: Theme;
  plan: Plan;
}

export interface PaymentResponse {
  pix_qr_code: string;
  pix_copia_cola: string;
  payment_id: string;
  page_id: string;
}
