import { factories } from '@strapi/strapi';

/**
 * Public API excludes state = 'archive' only — 'sold' listings stay
 * visible (used for the yearling sale history / previously-sold sections).
 *
 * The floor filter is combined with $and rather than spread onto the same
 * "state" key, so it narrows (not replaces) whatever the caller already
 * asked for — e.g. getAvailableHorses()'s state $in [...] must stay
 * exactly that, not silently widen to "everything but archived".
 */
export default factories.createCoreController('api::horse-for-sale.horse-for-sale', ({ strapi }) => ({
  async find(ctx) {
    const incomingFilters = ctx.query.filters as Record<string, unknown> | undefined;
    ctx.query = {
      ...ctx.query,
      filters: {
        $and: [incomingFilters ?? {}, { state: { $ne: 'archive' } }],
      },
    };
    return await super.find(ctx);
  },

  async findOne(ctx) {
    const { data, meta } = await super.findOne(ctx);
    if (data && (data as { state?: string }).state === 'archive') {
      ctx.notFound();
      return;
    }
    return { data, meta };
  },
}));
