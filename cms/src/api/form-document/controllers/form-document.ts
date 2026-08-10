import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::form-document.form-document', ({ strapi }) => ({
  async find(ctx) {
    const incomingFilters = ctx.query.filters as Record<string, unknown> | undefined;
    ctx.query = {
      ...ctx.query,
      filters: {
        $and: [incomingFilters ?? {}, { active: { $eq: true } }],
      },
    };
    return await super.find(ctx);
  },
}));
