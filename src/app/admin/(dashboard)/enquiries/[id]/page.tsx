import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Select, TextArea, SubmitButton } from "@/components/admin/FormField";
import { formatDate } from "@/lib/format";
import { updateEnquiryStatus, addEnquiryNote } from "../actions";

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "follow_up", label: "Follow Up" },
  { value: "closed", label: "Closed" },
];

const FIELD_LABELS: Record<string, string> = {
  phone: "Phone",
  subject: "Subject",
  mare_name: "Mare Name",
  mare_age: "Mare Age",
  mare_sire: "Mare Sire",
  mare_dam: "Mare Dam",
  mare_damsire: "Mare Damsire",
  breeder_owner: "Breeder / Owner",
  semen_requirement: "Semen Requirement",
  expected_cycle_date: "Expected Cycle Date",
  state: "State",
  country: "Country",
  horse_name: "Horse Name",
  horse_age: "Horse Age",
  horse_sex: "Horse Sex",
  current_location: "Current Location",
  service_required: "Service Required",
};

export default async function EnquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: enquiry }, { data: notes }] = await Promise.all([
    supabase.from("enquiries").select("*").eq("id", id).maybeSingle(),
    supabase.from("enquiry_notes").select("*").eq("enquiry_id", id).order("created_at", { ascending: false }),
  ]);

  if (!enquiry) notFound();

  const extraFields = Object.entries(FIELD_LABELS)
    .map(([key, label]) => ({ label, value: (enquiry as unknown as Record<string, string | null>)[key] }))
    .filter((f) => f.value);

  return (
    <div>
      <AdminPageHeader title={`Enquiry — ${enquiry.name}`} />

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="border border-line bg-warm-white p-6">
          <p className="text-xs text-grey">{formatDate(enquiry.created_at)}</p>
          <h2 className="mt-1 font-serif text-xl text-brown">{enquiry.name}</h2>
          <p className="mt-1 text-sm text-grey">
            {enquiry.email} {enquiry.phone && `· ${enquiry.phone}`}
          </p>

          {enquiry.message && <p className="mt-4 whitespace-pre-line text-sm text-charcoal">{enquiry.message}</p>}

          {extraFields.length > 0 && (
            <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-4">
              {extraFields.map((f) => (
                <div key={f.label}>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-earth">{f.label}</dt>
                  <dd className="mt-0.5 text-sm text-charcoal">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <div className="space-y-6">
          <form action={updateEnquiryStatus.bind(null, id)} className="border border-line bg-warm-white p-4">
            <Select label="Status" name="status" defaultValue={enquiry.status} options={STATUS_OPTIONS} />
            <div className="mt-3">
              <SubmitButton label="Update Status" />
            </div>
          </form>

          <div className="border border-line bg-warm-white p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-grey">Internal Notes</p>
            <ul className="mb-4 space-y-3">
              {(notes ?? []).map((n) => (
                <li key={n.id} className="border-b border-line pb-3 text-sm text-charcoal">
                  <p>{n.note}</p>
                  <p className="mt-1 text-xs text-grey">{formatDate(n.created_at)}</p>
                </li>
              ))}
              {(notes ?? []).length === 0 && <p className="text-sm text-grey">No notes yet.</p>}
            </ul>
            <form action={addEnquiryNote.bind(null, id)}>
              <TextArea label="Add a note" name="note" rows={3} />
              <div className="mt-3">
                <SubmitButton label="Add Note" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
