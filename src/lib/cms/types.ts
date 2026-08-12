import type { StrapiMedia } from "./media";

export type Gait = "Pacer" | "Trotter";
export type StallionState = "draft" | "admin_review" | "published" | "archived";
export type PriceType = "fixed" | "poa" | "shares";
export type SaleType =
  | "Private Sale"
  | "Yearling Sale"
  | "Shares"
  | "Broodmare"
  | "Racehorse"
  | "Weanling"
  | "Other";
export type HorseState = "available" | "under_offer" | "sold" | "upcoming" | "archive";
export type EnquiryType = "general" | "stallion" | "book_a_mare" | "training" | "horse_for_sale";
export type NewsCategory = "Stallions" | "Racing" | "Progeny" | "Breeding" | "Yearlings" | "Medowie Lodge";
export type DocumentCategory =
  | "Stallion Service Contracts"
  | "Semen Order Forms"
  | "Breeding Information"
  | "Other Documents";

export interface StallionHighlight {
  id: number;
  year: string | null;
  race: string | null;
  grade: string | null;
  result: string | null;
  track: string | null;
  notes: string | null;
}

export interface StallionEligibility {
  id: number;
  label: string;
}

export interface StallionProgeny {
  id: number;
  name: string;
  sex: string | null;
  foaledYear: number | null;
  dam: string | null;
  damsire: string | null;
  earnings: number | null;
  mileRate: string | null;
  wins: number | null;
  notes: string | null;
  image: StrapiMedia | null;
  profileUrl: string | null;
  featured: boolean;
}

export interface StallionPedigree {
  id: number;
  siresSire: string | null;
  siresDam: string | null;
  damsSire: string | null;
  damsDam: string | null;
}

export interface StallionVideo {
  id: number;
  title: string | null;
  youtubeUrl: string;
}

export interface Stallion {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  countrySuffix: string | null;
  state: StallionState;
  featured: boolean;
  displayOrder: number;

  gait: Gait | null;
  colour: string | null;
  foaledDate: string | null;
  height: string | null;

  sire: string | null;
  dam: string | null;
  damsire: string | null;

  serviceFee: number | null;
  feeNotes: string | null;
  includesGst: boolean;

  mileRate: string | null;
  careerEarnings: number | null;
  starts: number | null;
  wins: number | null;
  seconds: number | null;
  thirds: number | null;

  headline: string | null;
  shortDescription: string | null;
  fullBiography: string | null;

  semenChilledAu: boolean;
  semenFrozenAu: boolean;
  semenFrozenNz: boolean;
  semenNotes: string | null;

  matingInformation: string | null;
  matingPdf: StrapiMedia | null;
  pedigreeDocument: StrapiMedia | null;

  heroImage: StrapiMedia | null;
  profileImage: StrapiMedia | null;
  cardImage: StrapiMedia | null;
  gallery: StrapiMedia[];
  documents: StrapiMedia[];

  metaTitle: string | null;
  metaDescription: string | null;

  highlights: StallionHighlight[];
  eligibility: StallionEligibility[];
  progeny: StallionProgeny[];
  pedigree: StallionPedigree | null;
  videos: StallionVideo[];
}

export interface HorseForSale {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  state: HorseState;
  featured: boolean;
  saleType: SaleType;

  yearFoaled: number | null;
  sex: string | null;
  colour: string | null;
  gait: Gait | null;

  sire: string | null;
  dam: string | null;
  damsire: string | null;

  price: number | null;
  priceType: PriceType;

  description: string | null;
  location: string | null;

  heroImage: StrapiMedia | null;
  gallery: StrapiMedia[];
  pedigreeDocument: StrapiMedia | null;
  videoUrl: string | null;
  externalCatalogueUrl: string | null;

  saleName: string | null;
  saleDate: string | null;
  lotNumber: string | null;
  soldPrice: number | null;
  showSoldPrice: boolean;

  displayOrder: number;
}

export interface Result {
  id: number;
  date: string;
  horse: string;
  race: string | null;
  track: string | null;
  placing: string | null;
  trainer: string | null;
  driver: string | null;
  time: string | null;
  description: string | null;
  image: StrapiMedia | null;
  externalUrl: string | null;
  state: "draft" | "published";
}

export interface NewsArticle {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  heroImage: StrapiMedia | null;
  category: NewsCategory | null;
  publishedDate: string | null;
  author: string | null;
  relatedStallion: { slug: string; name: string } | null;
  relatedHorse: { slug: string; name: string } | null;
  state: "draft" | "published" | "archived";
  metaTitle: string | null;
  metaDescription: string | null;
}

export interface FormDocument {
  id: number;
  title: string;
  category: DocumentCategory;
  season: string | null;
  stallion: { name: string } | null;
  file: StrapiMedia;
  description: string | null;
  active: boolean;
  displayOrder: number;
  updatedAt: string;
}

export interface SiteSettings {
  businessName: string;
  tagline: string | null;
  phone: string | null;
  email: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  suburb: string | null;
  state: string | null;
  postcode: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  enquiryRecipientEmail: string | null;
  collectionDays: string | null;
  collectionCutoffTime: string | null;
  collectionInstructions: string | null;
  seoDefaultTitle: string | null;
  seoDefaultDescription: string | null;
  ogImage: StrapiMedia | null;
}

export interface Homepage {
  introHeading: string | null;
  introBody: string | null;
  heroVideo: StrapiMedia | null;
  heroVideoStartSeconds: number | null;
  heroVideoEndSeconds: number | null;
}

export interface AboutPage {
  introBody: string | null;
  tagline: string | null;
  heroImage: StrapiMedia | null;
  darrenHeading: string | null;
  darrenBody: string | null;
  sections: PageFeature[] | null;
  breedingHeading: string | null;
  breedingBody: string | null;
  trainingHeading: string | null;
  trainingBody: string | null;
  regionHeading: string | null;
  regionBody: string | null;
}

export interface TrainingPage {
  introBody: string | null;
  raceTrainingHeading: string | null;
  raceTrainingBody: string | null;
  breakingInHeading: string | null;
  breakingInBody: string | null;
  educationHeading: string | null;
  educationBody: string | null;
  facilitiesHeading: string | null;
  facilitiesBody: string | null;
}

export interface PageFeature {
  heading: string;
  body: string | null;
}

export interface YearlingPreparationPage {
  introBody: string | null;
  tagline: string | null;
  yearsExperience: number | null;
  features: PageFeature[] | null;
  salePreparationHeading: string | null;
  salePreparationBody: string | null;
  handlingEducationHeading: string | null;
  handlingEducationBody: string | null;
  presentationHeading: string | null;
  presentationBody: string | null;
}
