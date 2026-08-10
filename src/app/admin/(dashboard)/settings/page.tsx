import { requireAdmin } from "@/lib/auth";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Field, TextArea, SubmitButton } from "@/components/admin/FormField";
import { getSiteSettings } from "@/lib/data/settings";
import { updateSettings } from "./actions";

export default async function AdminSettingsPage() {
  await requireAdmin();
  const settings = await getSiteSettings();

  return (
    <div>
      <AdminPageHeader title="Settings" />

      <form action={updateSettings} className="max-w-2xl space-y-8">
        <section>
          <h2 className="mb-4 border-b border-line pb-2 font-serif text-lg text-brown">Business</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Business Name" name="business_name" defaultValue={settings.business_name} required />
            <Field label="Tagline" name="tagline" defaultValue={settings.tagline} />
            <Field label="Phone" name="phone" defaultValue={settings.phone} />
            <Field label="Email" name="email" type="email" defaultValue={settings.email} />
          </div>
        </section>

        <section>
          <h2 className="mb-4 border-b border-line pb-2 font-serif text-lg text-brown">Address</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Address Line 1" name="address_line1" defaultValue={settings.address_line1} />
            <Field label="Address Line 2" name="address_line2" defaultValue={settings.address_line2} />
            <Field label="Suburb" name="suburb" defaultValue={settings.suburb} />
            <Field label="State" name="state" defaultValue={settings.state} />
            <Field label="Postcode" name="postcode" defaultValue={settings.postcode} />
          </div>
        </section>

        <section>
          <h2 className="mb-4 border-b border-line pb-2 font-serif text-lg text-brown">Social</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Facebook URL" name="facebook_url" defaultValue={settings.facebook_url} />
            <Field label="Instagram URL" name="instagram_url" defaultValue={settings.instagram_url} />
          </div>
        </section>

        <section>
          <h2 className="mb-4 border-b border-line pb-2 font-serif text-lg text-brown">Enquiries</h2>
          <Field label="Enquiry Notification Email" name="enquiry_recipient_email" defaultValue={settings.enquiry_recipient_email} />
        </section>

        <section>
          <h2 className="mb-4 border-b border-line pb-2 font-serif text-lg text-brown">Collection Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Collection Days" name="collection_days" defaultValue={settings.collection_days} />
            <Field label="Order Cut-Off Time" name="collection_cutoff_time" defaultValue={settings.collection_cutoff_time} />
          </div>
          <TextArea label="Collection Instructions" name="collection_instructions" defaultValue={settings.collection_instructions} className="mt-4" />
        </section>

        <section>
          <h2 className="mb-4 border-b border-line pb-2 font-serif text-lg text-brown">SEO Defaults</h2>
          <Field label="Default Meta Title" name="seo_default_title" defaultValue={settings.seo_default_title} />
          <TextArea label="Default Meta Description" name="seo_default_description" defaultValue={settings.seo_default_description} className="mt-4" rows={3} />
          <Field label="Default Social Share Image URL" name="og_image_url" defaultValue={settings.og_image_url} className="mt-4" />
        </section>

        <SubmitButton label="Save Settings" />
      </form>
    </div>
  );
}
