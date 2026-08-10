import { factories } from '@strapi/strapi';

/**
 * The public REST API always shows only published/archived stallions,
 * regardless of what filters a client sends — mirroring the RLS policy
 * this replaced. Draft and admin_review stallions are only ever visible
 * through the authenticated Strapi admin (Content Manager), which does
 * not go through this controller.
 *
 * Note: our lifecycle field is named "state", not "status" — Strapi
 * reserves "status" for its own computed draft/publish indicator and
 * silently shadows any custom attribute with that name in API output.
 *
 * The floor filter is combined with $and rather than spread onto the same
 * "state" key, so it narrows (not replaces) whatever the caller already
 * asked for — e.g. getPublishedStallions()'s state = published must stay
 * exactly that, not silently widen to "published or archived".
 */
export default factories.createCoreController('api::stallion.stallion', ({ strapi }) => ({
  async find(ctx) {
    const incomingFilters = ctx.query.filters as Record<string, unknown> | undefined;
    ctx.query = {
      ...ctx.query,
      filters: {
        $and: [incomingFilters ?? {}, { state: { $in: ['published', 'archived'] } }],
      },
    };
    return await super.find(ctx);
  },

  async findOne(ctx) {
    const { data, meta } = await super.findOne(ctx);
    if (data && !['published', 'archived'].includes((data as { state?: string }).state ?? '')) {
      ctx.notFound();
      return;
    }
    return { data, meta };
  },
}));
