"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { horseForSaleEnquirySchema, type EnquiryInput } from "@/lib/validation/enquiry";
import { TextField, TextAreaField } from "@/components/forms/fields";
import { useEnquirySubmit } from "@/components/forms/useEnquirySubmit";

type FormValues = Omit<Extract<EnquiryInput, { type: "horse_for_sale" }>, "type">;

export function HorseEnquiryForm({ horseId, horseName }: { horseId: string; horseName: string }) {
  const { status, error, submit } = useEnquirySubmit();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(horseForSaleEnquirySchema.omit({ type: true })),
    defaultValues: { horseId },
  });

  if (status === "success") {
    return (
      <div className="border border-line bg-warm-white p-8 text-center">
        <p className="font-serif text-xl text-brown">Enquiry sent</p>
        <p className="mt-2 text-sm text-grey">Thank you — Medowie Lodge will be in touch about {horseName}.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit((values) => submit({ type: "horse_for_sale", ...values }))}
      className="border border-line bg-warm-white p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Name" required register={register("name")} error={errors.name} />
        <TextField label="Phone" register={register("phone")} error={errors.phone} />
        <TextField label="Email" required type="email" register={register("email")} error={errors.email} className="sm:col-span-2" />
      </div>
      <TextAreaField label="Message" register={register("message")} error={errors.message} className="mt-5 block" />

      {error && <p className="mt-4 text-sm text-orange-dark">{error}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 rounded-[3px] bg-orange px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-warm-white hover:bg-orange-dark disabled:opacity-50"
      >
        {status === "submitting" ? "Sending…" : "Send Enquiry"}
      </button>
    </form>
  );
}
