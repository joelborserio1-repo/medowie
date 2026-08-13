export type ContentStatus = "draft" | "admin_review" | "published" | "archived";
export type Gait = "Pacer" | "Trotter";
export type PriceType = "fixed" | "poa" | "shares";
export type SaleType =
  | "Private Sale"
  | "Yearling Sale"
  | "Shares"
  | "Broodmare"
  | "Racehorse"
  | "Weanling"
  | "Other";
export type HorseSaleStatus = "available" | "under_offer" | "sold" | "upcoming" | "archive";
export type EnquiryType = "general" | "stallion" | "book_a_mare" | "training" | "horse_for_sale";
export type EnquiryStatus = "new" | "contacted" | "follow_up" | "closed";
export type NewsCategory =
  | "Stallions"
  | "Racing"
  | "Progeny"
  | "Breeding"
  | "Yearlings"
  | "Medowie Lodge";
export type DocumentCategory =
  | "Stallion Service Contracts"
  | "Semen Order Forms"
  | "Breeding Information"
  | "Other Documents";

export interface Stallion {
  id: string;
  name: string;
  slug: string;
  country_suffix: string | null;
  status: ContentStatus;
  featured: boolean;
  display_order: number;

  gait: Gait | null;
  colour: string | null;
  foaled_date: string | null;
  height: string | null;

  sire: string | null;
  dam: string | null;
  damsire: string | null;

  service_fee: number | null;
  /**
   * Optional New Zealand service fee (NZD). May be absent if the underlying
   * column has not been added to the database yet — code paths must treat it
   * as optional.
   */
  service_fee_nz?: number | null;
  fee_notes: string | null;
  includes_gst: boolean;

  mile_rate: string | null;
  career_earnings: number | null;
  starts: number | null;
  wins: number | null;
  seconds: number | null;
  thirds: number | null;

  headline: string | null;
  short_description: string | null;
  full_biography: string | null;

  semen_chilled_au: boolean;
  semen_frozen_au: boolean;
  semen_frozen_nz: boolean;
  semen_notes: string | null;

  mating_information: string | null;
  mating_pdf_url: string | null;
  pedigree_document_url: string | null;

  hero_image_url: string | null;
  profile_image_url: string | null;
  card_image_url: string | null;

  meta_title: string | null;
  meta_description: string | null;

  published_at: string | null;
  updated_at: string;
  created_at: string;
}

export interface StallionHighlight {
  id: string;
  stallion_id: string;
  year: string | null;
  race: string | null;
  grade: string | null;
  result: string | null;
  track: string | null;
  notes: string | null;
  display_order: number;
}

export interface StallionEligibility {
  id: string;
  stallion_id: string;
  label: string;
  display_order: number;
}

export interface StallionGalleryImage {
  id: string;
  stallion_id: string;
  image_url: string;
  alt_text: string | null;
  caption: string | null;
  display_order: number;
}

export interface StallionVideo {
  id: string;
  stallion_id: string;
  title: string | null;
  youtube_url: string;
  display_order: number;
}

export interface StallionDocument {
  id: string;
  stallion_id: string;
  title: string;
  file_url: string;
  display_order: number;
}

export interface StallionProgeny {
  id: string;
  stallion_id: string;
  name: string;
  sex: string | null;
  foaled_year: number | null;
  /** Full foaling date (from the progeny Excel import). Optional. */
  foaled_date: string | null;
  dam: string | null;
  /** Broodmare sire (dam's sire). Column kept as `damsire` for compatibility. */
  damsire: string | null;
  /** Country of birth, e.g. AUS / NZ / USA. */
  country_of_birth: string | null;
  earnings: number | null;
  mile_rate: string | null;
  /** Lifetime starts. */
  starts: number | null;
  wins: number | null;
  notes: string | null;
  /** Optional extra description / link context for a notable progeny. */
  description: string | null;
  image_url: string | null;
  profile_url: string | null;
  featured: boolean;
  display_order: number;
}

export interface StallionPedigree {
  id: string;
  stallion_id: string;
  sires_sire: string | null;
  sires_dam: string | null;
  dams_sire: string | null;
  dams_dam: string | null;
  extended: Record<string, unknown> | null;
}

export interface HorseForSale {
  id: string;
  name: string;
  slug: string;
  status: HorseSaleStatus;
  featured: boolean;
  sale_type: SaleType;

  year_foaled: number | null;
  sex: string | null;
  colour: string | null;
  gait: Gait | null;

  sire: string | null;
  dam: string | null;
  damsire: string | null;

  price: number | null;
  price_type: PriceType;

  description: string | null;
  location: string | null;

  hero_image_url: string | null;
  pedigree_document_url: string | null;
  video_url: string | null;
  external_catalogue_url: string | null;

  sale_name: string | null;
  sale_date: string | null;
  lot_number: string | null;
  sold_price: number | null;
  show_sold_price: boolean;

  display_order: number;
  published_at: string | null;
  updated_at: string;
  created_at: string;
}

export interface HorseGalleryImage {
  id: string;
  horse_id: string;
  image_url: string;
  alt_text: string | null;
  display_order: number;
}

export interface Result {
  id: string;
  date: string;
  horse: string;
  race: string | null;
  track: string | null;
  placing: string | null;
  trainer: string | null;
  driver: string | null;
  time: string | null;
  description: string | null;
  image_url: string | null;
  external_url: string | null;
  status: ContentStatus;
  display_order: number;
  created_at: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  hero_image_url: string | null;
  category: NewsCategory | null;
  published_date: string | null;
  author: string | null;
  related_stallion_id: string | null;
  related_horse_id: string | null;
  status: ContentStatus;
  meta_title: string | null;
  meta_description: string | null;
  updated_at: string;
  created_at: string;
}

export interface DocumentRecord {
  id: string;
  title: string;
  category: DocumentCategory;
  season: string | null;
  stallion_id: string | null;
  file_url: string;
  description: string | null;
  active: boolean;
  display_order: number;
  updated_at: string;
  created_at: string;
}

export interface Enquiry {
  id: string;
  type: EnquiryType;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string | null;
  stallion_id: string | null;
  horse_id: string | null;
  mare_name: string | null;
  mare_age: string | null;
  mare_sire: string | null;
  mare_dam: string | null;
  mare_damsire: string | null;
  breeder_owner: string | null;
  semen_requirement: string | null;
  expected_cycle_date: string | null;
  state: string | null;
  country: string | null;
  horse_name: string | null;
  horse_age: string | null;
  horse_sex: string | null;
  current_location: string | null;
  service_required: string | null;
  status: EnquiryStatus;
  created_at: string;
}

export interface SiteSettings {
  id: true;
  business_name: string;
  tagline: string | null;
  phone: string | null;
  email: string | null;
  address_line1: string | null;
  address_line2: string | null;
  suburb: string | null;
  state: string | null;
  postcode: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  enquiry_recipient_email: string | null;
  collection_days: string | null;
  collection_cutoff_time: string | null;
  collection_instructions: string | null;
  seo_default_title: string | null;
  seo_default_description: string | null;
  og_image_url: string | null;
  hero_video_url: string | null;
  hero_video_start_seconds: number | null;
  hero_video_end_seconds: number | null;
  updated_at: string;
}

export interface PageFeature {
  heading: string;
  body: string | null;
}

export interface SiteContentBlockMeta {
  tagline?: string;
  years_experience?: number;
  features?: PageFeature[];
}

export interface SiteContentBlock {
  id: string;
  key: string;
  label: string;
  heading: string | null;
  body: string | null;
  image_url: string | null;
  status: ContentStatus;
  meta: SiteContentBlockMeta;
  updated_at: string;
}

export interface MediaAsset {
  id: string;
  bucket: string;
  path: string;
  url: string;
  alt_text: string | null;
  folder: string | null;
  created_at: string;
}
