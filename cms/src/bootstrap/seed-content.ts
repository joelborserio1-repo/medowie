import type { Core } from '@strapi/strapi';

/**
 * Seeds only independently verified content — see the project's
 * docs/CONTENT_MIGRATION.md for exactly where each value came from.
 * Nothing here is invented; everything else (fees, biographies,
 * statistics, pedigrees, photography) stays blank for staff to fill in
 * from the Strapi admin. Idempotent: each block checks before writing.
 */
export async function seedVerifiedContent(strapi: Core.Strapi) {
  await seedSiteSettings(strapi);
  await seedHomepage(strapi);
  await seedAboutPage(strapi);
  await seedTrainingPage(strapi);
  await seedYearlingPreparationPage(strapi);
  await seedStallions(strapi);
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

  const data = {
    introBody:
      'Medowie Lodge is a Standardbred stud and harness racing stable based at Medowie in the Port Stephens area of the Hunter Region, New South Wales, operated by Darren Reay and family.',
    darrenBody:
      'Darren Reay is a licensed Harness Racing trainer, studmaster, breeder and owner, and Vice President of Harness Breeders NSW.',
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
      'Medowie Lodge presents well-bred, hand-raised yearlings annually at both the Sydney APG Yearling Sale and the Bathurst Yearling Sale, held during February and March each year.',
  };

  if (existing) {
    await strapi
      .query('api::yearling-preparation-page.yearling-preparation-page')
      .update({ where: { id: existing.id }, data });
  } else {
    await strapi.query('api::yearling-preparation-page.yearling-preparation-page').create({ data });
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
 * These three lots were shown on the Medowie Lodge "Horses for Sale"
 * page as horses "presented and sold at the 2018 Sydney APG Yearling
 * Sale". Seeded as sold/archive records for historical accuracy, not as
 * current listings. No sale price was published, so none is recorded.
 */
async function seedArchivedYearlingSales(strapi: Core.Strapi) {
  const count = await strapi.query('api::horse-for-sale.horse-for-sale').count();
  if (count > 0) return;

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
    await strapi.query('api::horse-for-sale.horse-for-sale').create({
      data: {
        ...lot,
        state: 'sold',
        saleType: 'Yearling Sale',
        sex: 'Colt',
        saleName: 'Sydney APG Yearling Sale',
        saleDate: '2018-02-25',
        priceType: 'poa',
      },
    });
  }
  strapi.log.info(`Seeded ${lots.length} archived yearling sale records.`);
}
