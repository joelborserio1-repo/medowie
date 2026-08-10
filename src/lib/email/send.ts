import "server-only";
import { Resend } from "resend";
import type { EnquiryInput } from "@/lib/validation/enquiry";

const TYPE_LABELS: Record<EnquiryInput["type"], string> = {
  general: "General Enquiry",
  stallion: "Stallion Enquiry",
  book_a_mare: "Book a Mare Enquiry",
  training: "Training Enquiry",
  horse_for_sale: "Horse for Sale Enquiry",
};

function renderRows(input: EnquiryInput): string {
  const entries = Object.entries(input).filter(([key]) => key !== "type");
  return entries
    .filter(([, value]) => value !== undefined && value !== "")
    .map(([key, value]) => `<tr><td style="padding:4px 12px 4px 0;color:#817A70;text-transform:capitalize;">${key.replace(/([A-Z])/g, " $1")}</td><td style="padding:4px 0;color:#252525;">${value}</td></tr>`)
    .join("");
}

/**
 * Sends the admin notification + customer acknowledgement via Resend when
 * configured. If RESEND_API_KEY is absent, this is a no-op — the enquiry
 * has already been saved to Supabase by the caller regardless.
 */
export async function sendEnquiryEmails(input: EnquiryInput, recipientEmail: string | null) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !recipientEmail) return { sent: false as const };

  const resend = new Resend(apiKey);
  const fromAddress = process.env.RESEND_FROM_EMAIL ?? "Medowie Lodge <enquiries@medowielodge.com.au>";
  const label = TYPE_LABELS[input.type];

  await resend.emails.send({
    from: fromAddress,
    to: recipientEmail,
    replyTo: input.email,
    subject: `${label} — ${input.name}`,
    html: `<h2>${label}</h2><table>${renderRows(input)}</table>`,
  });

  await resend.emails.send({
    from: fromAddress,
    to: input.email,
    subject: "Thank you for your enquiry — Medowie Lodge",
    html: `<p>Thanks for your enquiry, ${input.name}. Medowie Lodge has received the following ${label.toLowerCase()} and will be in touch.</p><table>${renderRows(input)}</table>`,
  });

  return { sent: true as const };
}
