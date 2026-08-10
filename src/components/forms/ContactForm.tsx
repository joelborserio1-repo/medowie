"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { generalEnquirySchema, type EnquiryInput } from "@/lib/validation/enquiry";
import { TextField, TextAreaField } from "@/components/forms/fields";
import { useEnquirySubmit } from "@/components/forms/useEnquirySubmit";

type FormValues = Omit<Extract<EnquiryInput, { type: "general" }>, "type">;

export function ContactForm() {
  const { status, error, submit } = useEnquirySubmit();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(generalEnquirySchema.omit({ type: true })) });

  if (status === "success") {
    return (
      <div className="border border-line bg-warm-white p-8 text-center">
        <p className="font-serif text-xl text-brown">Message sent</p>
        <p className="mt-2 text-sm text-grey">Thank you — Medowie Lodge will be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit((values) => submit({ type: "general", ...values }))}
      className="border border-line bg-warm-white p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Name" required register={register("name")} error={errors.name} />
        <TextField label="Email" required type="email" register={register("email")} error={errors.email} />
        <TextField label="Phone" register={register("phone")} error={errors.phone} />
        <TextField label="Subject" register={register("subject")} error={errors.subject} />
      </div>
      <TextAreaField label="Message" required register={register("message")} error={errors.message} className="mt-5 block" />

      {error && <p className="mt-4 text-sm text-orange-dark">{error}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 rounded-[3px] bg-orange px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-warm-white hover:bg-orange-dark disabled:opacity-50"
      >
        {status === "submitting" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
