import type { Core } from '@strapi/strapi';

/**
 * Grants the "Public" role exactly the API actions the marketing site
 * needs — read access to published content, create-only on enquiries —
 * so a fresh Strapi instance is usable without manually clicking through
 * Settings → Roles in the admin UI. Idempotent: skips content types that
 * already have permissions assigned.
 */
const READ_ONLY_COLLECTIONS = ['stallion', 'horse-for-sale', 'result', 'news-article', 'form-document'];
const READ_ONLY_SINGLE_TYPES = ['site-setting', 'homepage', 'about-page', 'training-page', 'yearling-preparation-page'];
const CREATE_ONLY_COLLECTIONS = ['enquiry'];

export async function setPublicPermissions(strapi: Core.Strapi) {
  const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
    where: { type: 'public' },
  });

  if (!publicRole) {
    strapi.log.warn('No public role found — skipping public permission bootstrap.');
    return;
  }

  // Strapi ships default Public-role permissions for its own auth routes
  // (register, login, etc.) — a bare count would always be > 0, so check
  // for one of *our* actions specifically to know whether this has run.
  const alreadyBootstrapped = await strapi.query('plugin::users-permissions.permission').count({
    where: { role: publicRole.id, action: 'api::stallion.stallion.find' },
  });

  if (alreadyBootstrapped > 0) {
    return;
  }

  const actionsToCreate: string[] = [];

  for (const uid of READ_ONLY_COLLECTIONS) {
    actionsToCreate.push(`api::${uid}.${uid}.find`, `api::${uid}.${uid}.findOne`);
  }
  for (const uid of READ_ONLY_SINGLE_TYPES) {
    actionsToCreate.push(`api::${uid}.${uid}.find`);
  }
  for (const uid of CREATE_ONLY_COLLECTIONS) {
    actionsToCreate.push(`api::${uid}.${uid}.create`);
  }

  await Promise.all(
    actionsToCreate.map((action) =>
      strapi.query('plugin::users-permissions.permission').create({
        data: { action, role: publicRole.id },
      })
    )
  );

  strapi.log.info(`Public role permissions bootstrapped (${actionsToCreate.length} actions).`);
}
