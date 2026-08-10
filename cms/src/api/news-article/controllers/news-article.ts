import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::news-article.news-article', ({ strapi }) => ({
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

  async findOne(ctx) {
    const { data, meta } = await super.findOne(ctx);
    if (data && (data as { state?: string }).state !== 'published') {
      ctx.notFound();
      return;
    }
    return { data, meta };
  },
}));
