import { factories } from '@strapi/strapi';

/**
 * Public role only has `create` enabled for this content type (see
 * bootstrap permissions) — find/findOne/update/delete require an
 * authenticated admin. This override just makes sure a submitter can't
 * set their own stage/notes on the way in.
 */
export default factories.createCoreController('api::enquiry.enquiry', ({ strapi }) => ({
  async create(ctx) {
    const body = ctx.request.body as { data?: Record<string, unknown> };
    if (body?.data) {
      delete body.data.stage;
      delete body.data.notes;
      body.data.stage = 'new';
    }
    return await super.create(ctx);
  },
}));
