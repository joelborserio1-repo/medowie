import type { Core } from '@strapi/strapi';

/**
 * Creates the first Strapi admin user from env vars if one doesn't exist
 * yet, so a fresh deploy (Railway, CI, local) doesn't require someone to
 * manually complete the registration form before the API is usable.
 * Only runs when both env vars are set; safe to leave unset locally and
 * register through http://localhost:1337/admin instead.
 */
export async function createFirstAdminFromEnv(strapi: Core.Strapi) {
  const email = process.env.STRAPI_ADMIN_EMAIL;
  const password = process.env.STRAPI_ADMIN_PASSWORD;

  if (!email || !password) return;

  try {
    await strapi.service('admin::user').createFirstAdmin({
      email,
      password,
      firstname: process.env.STRAPI_ADMIN_FIRSTNAME || 'Medowie',
      lastname: process.env.STRAPI_ADMIN_LASTNAME || 'Lodge',
    });
    strapi.log.info(`Created first Strapi admin (${email}) from environment variables.`);
  } catch (error) {
    // Already has an admin — expected on every restart after the first.
    if (error instanceof Error && /cannot register/i.test(error.message)) return;
    strapi.log.warn(`createFirstAdminFromEnv skipped: ${(error as Error).message}`);
  }
}
