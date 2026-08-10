import type { Schema, Struct } from '@strapi/strapi';

export interface StallionEligibility extends Struct.ComponentSchema {
  collectionName: 'components_stallion_eligibilities';
  info: {
    displayName: 'Eligible Scheme';
    icon: 'check';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface StallionHighlight extends Struct.ComponentSchema {
  collectionName: 'components_stallion_highlights';
  info: {
    displayName: 'Career Highlight';
    icon: 'trophy';
  };
  attributes: {
    grade: Schema.Attribute.String;
    notes: Schema.Attribute.Text;
    race: Schema.Attribute.String;
    result: Schema.Attribute.String;
    track: Schema.Attribute.String;
    year: Schema.Attribute.String;
  };
}

export interface StallionPedigree extends Struct.ComponentSchema {
  collectionName: 'components_stallion_pedigrees';
  info: {
    displayName: 'Pedigree';
    icon: 'sitemap';
  };
  attributes: {
    damsDam: Schema.Attribute.String;
    damsSire: Schema.Attribute.String;
    siresDam: Schema.Attribute.String;
    siresSire: Schema.Attribute.String;
  };
}

export interface StallionProgeny extends Struct.ComponentSchema {
  collectionName: 'components_stallion_progenies';
  info: {
    displayName: 'Progeny';
    icon: 'paw';
  };
  attributes: {
    dam: Schema.Attribute.String;
    damsire: Schema.Attribute.String;
    earnings: Schema.Attribute.Decimal;
    featured: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    foaledYear: Schema.Attribute.Integer;
    image: Schema.Attribute.Media<'images'>;
    mileRate: Schema.Attribute.String;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    notes: Schema.Attribute.Text;
    profileUrl: Schema.Attribute.String;
    sex: Schema.Attribute.String;
    wins: Schema.Attribute.Integer;
  };
}

export interface StallionVideo extends Struct.ComponentSchema {
  collectionName: 'components_stallion_videos';
  info: {
    displayName: 'Video';
    icon: 'play';
  };
  attributes: {
    title: Schema.Attribute.String;
    youtubeUrl: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'stallion.eligibility': StallionEligibility;
      'stallion.highlight': StallionHighlight;
      'stallion.pedigree': StallionPedigree;
      'stallion.progeny': StallionProgeny;
      'stallion.video': StallionVideo;
    }
  }
}
