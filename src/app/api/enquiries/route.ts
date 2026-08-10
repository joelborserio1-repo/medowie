import { NextResponse } from "next/server";
import { enquirySchema } from "@/lib/validation/enquiry";
import { sendEnquiryEmails } from "@/lib/email/send";
import { strapiFindOne } from "@/lib/cms/client";
import type { SiteSettings } from "@/lib/cms/types";

const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1337";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = enquirySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.issues[0]?.message ?? "Invalid enquiry" }, { status: 400 });
  }

  const input = parsed.data;

  const data: Record<string, unknown> = {
    type: input.type,
    name: input.name,
    email: input.email,
    phone: input.phone || null,
    message: input.message || null,
  };

  if (input.type === "general") {
    data.subject = input.subject || null;
  }

  if (input.type === "stallion") {
    if (input.stallionId) data.stallion = Number(input.stallionId);
    data.mareName = input.mareName || null;
    data.mareSire = input.mareSire || null;
    data.state = input.state || null;
  }

  if (input.type === "book_a_mare") {
    data.stallion = Number(input.stallionId);
    data.mareName = input.mareName;
    data.mareAge = input.mareAge || null;
    data.mareSire = input.mareSire || null;
    data.mareDam = input.mareDam || null;
    data.mareDamsire = input.mareDamsire || null;
    data.breederOwner = input.breederOwner;
    data.state = input.state;
    data.country = input.country || null;
    data.semenRequirement = input.semenRequirement || null;
    data.expectedCycleDate = input.expectedCycleDate || null;
  }

  if (input.type === "training") {
    data.horseName = input.horseName || null;
    data.horseAge = input.horseAge || null;
    data.horseSex = input.horseSex || null;
    data.currentLocation = input.currentLocation || null;
    data.serviceRequired = input.serviceRequired || null;
  }

  if (input.type === "horse_for_sale") {
    if (input.horseId) data.horse = Number(input.horseId);
  }

  const apiToken = process.env.STRAPI_API_TOKEN;
  const createRes = await fetch(`${STRAPI_URL}/api/enquiries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(apiToken ? { Authorization: `Bearer ${apiToken}` } : {}),
    },
    body: JSON.stringify({ data }),
  });

  if (!createRes.ok) {
    return NextResponse.json({ success: false, error: "Could not save enquiry. Please try again." }, { status: 500 });
  }

  const settings = await strapiFindOne<SiteSettings>("/site-setting", undefined, 0).catch(() => null);

  try {
    await sendEnquiryEmails(input, settings?.enquiryRecipientEmail ?? null);
  } catch {
    // Enquiry is already saved; email delivery is best-effort.
  }

  return NextResponse.json({ success: true });
}
