import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { enquirySchema } from "@/lib/validation/enquiry";
import { sendEnquiryEmails } from "@/lib/email/send";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = enquirySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.issues[0]?.message ?? "Invalid enquiry" }, { status: 400 });
  }

  const input = parsed.data;
  const supabase = await createClient();

  const row: Record<string, unknown> = {
    type: input.type,
    name: input.name,
    email: input.email,
    phone: input.phone ?? null,
    message: input.message ?? null,
  };

  if (input.type === "general") {
    row.subject = input.subject ?? null;
  }

  if (input.type === "stallion") {
    row.stallion_id = input.stallionId ?? null;
    row.mare_name = input.mareName ?? null;
    row.mare_sire = input.mareSire ?? null;
    row.state = input.state ?? null;
  }

  if (input.type === "book_a_mare") {
    row.stallion_id = input.stallionId;
    row.mare_name = input.mareName;
    row.mare_age = input.mareAge ?? null;
    row.mare_sire = input.mareSire ?? null;
    row.mare_dam = input.mareDam ?? null;
    row.mare_damsire = input.mareDamsire ?? null;
    row.breeder_owner = input.breederOwner;
    row.state = input.state;
    row.country = input.country ?? null;
    row.semen_requirement = input.semenRequirement ?? null;
    row.expected_cycle_date = input.expectedCycleDate || null;
  }

  if (input.type === "training") {
    row.horse_name = input.horseName ?? null;
    row.horse_age = input.horseAge ?? null;
    row.horse_sex = input.horseSex ?? null;
    row.current_location = input.currentLocation ?? null;
    row.service_required = input.serviceRequired ?? null;
  }

  if (input.type === "horse_for_sale") {
    row.horse_id = input.horseId ?? null;
  }

  const { error } = await supabase.from("enquiries").insert(row);

  if (error) {
    return NextResponse.json({ success: false, error: "Could not save enquiry. Please try again." }, { status: 500 });
  }

  const { data: settings } = await supabase.from("site_settings").select("enquiry_recipient_email").single();

  try {
    await sendEnquiryEmails(input, settings?.enquiry_recipient_email ?? null);
  } catch {
    // Enquiry is already saved; email delivery is best-effort.
  }

  return NextResponse.json({ success: true });
}
