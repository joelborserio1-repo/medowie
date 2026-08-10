import type { Core } from '@strapi/strapi';
import { setPublicPermissions } from './bootstrap/set-public-permissions';
import { createFirstAdminFromEnv } from './bootstrap/create-first-admin';
import { seedVerifiedContent } from './bootstrap/seed-content';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await setPublicPermissions(strapi);
    await createFirstAdminFromEnv(strapi);
    await seedVerifiedContent(strapi);
  },
};
