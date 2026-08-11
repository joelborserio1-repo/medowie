import type { Core } from '@strapi/strapi';
import path from 'node:path';
import fs from 'node:fs';

/**
 * Seeds only independently verified content — see the project's
 * docs/CONTENT_MIGRATION.md for exactly where each value came from.
 * Nothing here is invented; everything else (fees, biographies,
 * statistics, pedigrees, photography) stays blank for staff to fill in
 * from the Strapi admin. Idempotent: each block checks before writing.
 */

const SEED_ASSETS_DIR = path.join(process.cwd(), 'seed-assets');
const SEED_ASSET_MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

/**
 * Uploads a real image committed under cms/seed-assets/ through Strapi's
 * own Upload plugin (local disk in dev, R2 in production — see
 * config/plugins.ts) and returns the created media file's id. Used only
 * for photography Medowie Lodge itself supplied; never for placeholder
 * or generated imagery. Safe to call repeatedly — callers only invoke
 * this the first time a record is created.
 */
async function uploadSeedAsset(strapi: Core.Strapi, filename: string, alternativeText: string): Promise<number | null> {
  const filepath = path.join(SEED_ASSETS_DIR, filename);
  if (!fs.existsSync(filepath)) {
    strapi.log.warn(`Seed asset not found, skipping upload: ${filename}`);
    return null;
  }

  const ext = path.extname(filename).toLowerCase();
  const mimetype = SEED_ASSET_MIME_TYPES[ext] ?? 'application/octet-stream';
  const size = fs.statSync(filepath).size;

  const [uploaded] = await strapi.plugin('upload').service('upload').upload({
    data: { fileInfo: { alternativeText, caption: alternativeText } },
    files: { filepath, originalFilename: filename, mimetype, size },
  });

  return uploaded?.id ?? null;
}

export async function seedVerifiedContent(strapi: Core.Strapi) {
  await seedSiteSettings(strapi);
  await seedHomepage(strapi);
  await seedAboutPage(strapi);
  await seedTrainingPage(strapi);
  await seedYearlingPreparationPage(strapi);
  await seedStallions(strapi);
  await seedSohoLanikai(strapi);
  await seedArchivedYearlingSales(strapi);
}

async function seedSiteSettings(strapi: Core.Strapi) {
  const existing = await strapi.query('api::site-setting.site-setting').findOne({});
  if (existing?.phone) return;

  const data = {
    businessName: 'Medowie Lodge',
    tagline: 'Standardbred Stud & Racing Stables',
    phone: '0429 817 199',
    email: 'medowielodge@bigpond.com',
    addressLine1: '951 Richardson Road',
    suburb: 'Medowie',
    state: 'NSW',
    postcode: '2318',
    facebookUrl: 'https://www.facebook.com/medowielodge',
    enquiryRecipientEmail: 'medowielodge@bigpond.com',
    seoDefaultTitle: 'Medowie Lodge — Standardbred Stud & Harness Racing Stables, NSW',
    seoDefaultDescription:
      'Medowie Lodge is a Standardbred stud and harness racing stable at Medowie, NSW, operated by Darren Reay and family. Stallion services, race training and yearling preparation in the Hunter Region.',
  };

  if (existing) {
    await strapi.query('api::site-setting.site-setting').update({ where: { id: existing.id }, data });
  } else {
    await strapi.query('api::site-setting.site-setting').create({ data });
  }
  strapi.log.info('Seeded site settings.');
}

async function seedHomepage(strapi: Core.Strapi) {
  const existing = await strapi.query('api::homepage.homepage').findOne({});
  if (existing?.introBody) return;

  const data = {
    introHeading: 'Medowie Lodge',
    introBody:
      'Welcome to Medowie Lodge, a Standardbred stud located at Medowie in the Port Stephens area of the Hunter Region, New South Wales.\n\n' +
      'Medowie Lodge is run by Darren Reay and family. Darren is a licensed Harness Racing trainer, studmaster, breeder and owner, and Vice President of Harness Breeders NSW.',
  };

  if (existing) {
    await strapi.query('api::homepage.homepage').update({ where: { id: existing.id }, data });
  } else {
    await strapi.query('api::homepage.homepage').create({ data });
  }
  strapi.log.info('Seeded homepage introduction.');
}

async function seedAboutPage(strapi: Core.Strapi) {
  const existing = await strapi.query('api::about-page.about-page').findOne({});
  if (existing?.introBody) return;

  const heroImage = await uploadSeedAsset(
    strapi,
    'racing-colours.webp',
    'Medowie Lodge racing colours — white and orange with a maroon star'
  );

  const data = {
    introBody:
      'Medowie Lodge is a Standardbred stud and harness racing stable based at Medowie in the Port Stephens area of the Hunter Region, New South Wales, operated by Darren Reay and family.',
    darrenBody:
      'Darren Reay is a licensed Harness Racing trainer, studmaster, breeder and owner, and Vice President of Harness Breeders NSW.',
    ...(heroImage ? { heroImage } : {}),
  };

  if (existing) {
    await strapi.query('api::about-page.about-page').update({ where: { id: existing.id }, data });
  } else {
    await strapi.query('api::about-page.about-page').create({ data });
  }
  strapi.log.info('Seeded about page introduction.');
}

async function seedTrainingPage(strapi: Core.Strapi) {
  const existing = await strapi.query('api::training-page.training-page').findOne({});
  if (existing?.introBody) return;

  const data = {
    introBody:
      'Contact Darren Reay and team at Medowie Lodge for information regarding yearling preparation, breaking-in and race training.',
  };

  if (existing) {
    await strapi.query('api::training-page.training-page').update({ where: { id: existing.id }, data });
  } else {
    await strapi.query('api::training-page.training-page').create({ data });
  }
  strapi.log.info('Seeded training page introduction.');
}

async function seedYearlingPreparationPage(strapi: Core.Strapi) {
  const existing = await strapi.query('api::yearling-preparation-page.yearling-preparation-page').findOne({});
  if (existing?.introBody) return;

  const data = {
    introBody:
      'Medowie Lodge presents well-bred, hand-raised yearlings annually at both the Sydney APG Yearling Sale and the Bathurst Yearling Sale, held during February and March each year.\n\n' +
      'Give your yearling the best start to their future with expert preparation and proven results.',
    tagline: 'Experience. Dedication. Results.',
    yearsExperience: 30,
    features: [
      {
        heading: 'Expert Handling & Training',
        body: 'Building confidence, manners and foundation.',
      },
      {
        heading: 'Fitness & Development',
        body: 'Tailored programs to improve strength, balance & coordination.',
      },
      {
        heading: 'Prepared for Success',
        body: 'Setting your yearling up for the sales ring and beyond.',
      },
      {
        heading: 'Professional Photos & Videos',
        body: 'High quality content to showcase your yearling at their best.',
      },
    ],
  };

  // Uses the Document Service (not strapi.query) because `features` is a
  // repeatable component — the raw Query Engine's create/update treats
  // component fields as plain relations and throws "Invalid id, expected
  // a string or integer, got [object Object]" on the nested objects.
  if (existing) {
    await strapi.documents('api::yearling-preparation-page.yearling-preparation-page').update({
      documentId: existing.documentId,
      data,
    });
  } else {
    await strapi.documents('api::yearling-preparation-page.yearling-preparation-page').create({ data });
  }
  strapi.log.info('Seeded yearling preparation page introduction.');
}

/**
 * The four stallions below were listed by name on the Medowie Lodge
 * homepage as "standing" for a breeding season labelled 2023/2024 — the
 * live site had not been updated since, so current-season status
 * couldn't be confirmed and each is seeded as admin_review rather than
 * published. "TR" against a name on the source site denoted Trotter;
 * horses without the suffix are seeded as Pacer, per the site's own
 * notation. My Chaching Chaching (NZ) appeared in the stallion image
 * grid but wasn't in that season's name list, so its status is
 * unverified too.
 */
async function seedStallions(strapi: Core.Strapi) {
  const count = await strapi.query('api::stallion.stallion').count();
  if (count > 0) return;

  const stallions = [
    { name: 'Tiger Tara', slug: 'tiger-tara', countrySuffix: 'NZ', gait: 'Pacer', displayOrder: 1 },
    { name: 'Follow the Stars', slug: 'follow-the-stars', countrySuffix: 'AUS', gait: 'Pacer', displayOrder: 2 },
    { name: 'Timothy Red', slug: 'timothy-red', countrySuffix: 'AUS', gait: 'Trotter', displayOrder: 3 },
    {
      name: 'My High Expectations',
      slug: 'my-high-expectations',
      countrySuffix: 'USA',
      gait: 'Trotter',
      displayOrder: 4,
    },
    { name: 'My Chaching Chaching', slug: 'my-chaching-chaching', countrySuffix: 'NZ', displayOrder: 5 },
  ];

  for (const stallion of stallions) {
    await strapi.query('api::stallion.stallion').create({
      data: { ...stallion, state: 'admin_review', includesGst: true },
    });
  }
  strapi.log.info(`Seeded ${stallions.length} stallions (admin_review — season unverified).`);
}

/**
 * Soho Lanikai was supplied as a dedicated Medowie Lodge promotional
 * flyer (service fee, race result and pedigree facts read directly from
 * it). The flyer carries no date, so — consistent with the other
 * stallions above — current-season standing status can't be confirmed
 * and this is seeded as admin_review rather than published. The dam's
 * name was not given on the flyer (only "a Group 1 winning mare"), so
 * the `dam` field is left blank rather than guessed.
 */
async function seedSohoLanikai(strapi: Core.Strapi) {
  const existing = await strapi.query('api::stallion.stallion').findOne({ where: { slug: 'soho-lanikai' } });
  if (existing) return;

  const flyerImage = await uploadSeedAsset(
    strapi,
    'soho-lanikai-flyer.jpg',
    'Soho Lanikai — Medowie Lodge promotional flyer'
  );

  // Document Service, not strapi.query — `highlights` is a component (see
  // the note in seedYearlingPreparationPage above for why that matters).
  await strapi.documents('api::stallion.stallion').create({
    data: {
      name: 'Soho Lanikai',
      ...(flyerImage ? { gallery: [flyerImage] } : {}),
      slug: 'soho-lanikai',
      state: 'admin_review',
      gait: 'Pacer',
      sire: 'Somebeachsomewhere',
      serviceFee: 2000,
      includesGst: true,
      mileRate: '1:54',
      headline: 'Son of Somebeachsomewhere',
      shortDescription:
        'Standing at Medowie Lodge. A son of Somebeachsomewhere, out of a Group 1-winning mare, with 70% winners to starters.',
      highlights: [
        {
          race: 'First start',
          result: 'Won by 65 metres in 1:54',
          notes: 'A devastating first-up performance, showing natural speed, brilliance and raw ability.',
        },
      ],
      displayOrder: 6,
    },
  });
  strapi.log.info('Seeded Soho Lanikai (admin_review — season unverified).');
}

/**
 * These three lots were shown on the Medowie Lodge "Horses for Sale"
 * page as horses "presented and sold at the 2018 Sydney APG Yearling
 * Sale". Seeded as sold/archive records for historical accuracy, not as
 * current listings. No sale price was published, so none is recorded.
 */
async function seedArchivedYearlingSales(strapi: Core.Strapi) {
  const count = await strapi.query('api::horse-for-sale.horse-for-sale').count();
  if (count > 0) return;

  const lot327Image = await uploadSeedAsset(
    strapi,
    'apg-2018-lot-327.png',
    'Lot 327 — Somebeachsomewhere x Go Right Babe, Sydney APG Yearling Sale 2018'
  );

  const lots = [
    {
      name: "Lot 327 — Somebeachsomewhere x Go Right Babe",
      slug: 'apg-2018-lot-327',
      sire: 'Somebeachsomewhere',
      dam: 'Go Right Babe',
      lotNumber: '327',
      displayOrder: 1,
    },
    {
      name: 'Lot 357 — Well Said x Lotus Lobell',
      slug: 'apg-2018-lot-357',
      sire: 'Well Said',
      dam: 'Lotus Lobell',
      lotNumber: '357',
      displayOrder: 2,
    },
    {
      name: "Lot 428 — Bettor's Delight x So Savvy",
      slug: 'apg-2018-lot-428',
      sire: "Bettor's Delight",
      dam: 'So Savvy',
      lotNumber: '428',
      displayOrder: 3,
    },
  ];

  for (const lot of lots) {
    const isLot327 = lot.slug === 'apg-2018-lot-327';
    await strapi.query('api::horse-for-sale.horse-for-sale').create({
      data: {
        ...lot,
        state: 'sold',
        saleType: 'Yearling Sale',
        sex: 'Colt',
        saleName: 'Sydney APG Yearling Sale',
        saleDate: '2018-02-25',
        priceType: 'poa',
        ...(isLot327 && lot327Image ? { heroImage: lot327Image } : {}),
      },
    });
  }
  strapi.log.info(`Seeded ${lots.length} archived yearling sale records.`);
}
