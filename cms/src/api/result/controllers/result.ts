import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::result.result', ({ strapi }) => ({
  async find(ctx) {
    const incomingFilters = ctx.query.filters as Record<string, unknown> | undefined;
    ctx.query = {
      ...ctx.query,
      filters: {
        $and: [incomingFilters ?? {}, { state: { $eq: 'published' } }],
      },
    };
    return await super.find(ctx);
  },
}));
