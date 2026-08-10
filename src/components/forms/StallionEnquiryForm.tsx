"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { stallionEnquirySchema, type EnquiryInput } from "@/lib/validation/enquiry";
import { TextField, TextAreaField } from "@/components/forms/fields";
import { useEnquirySubmit } from "@/components/forms/useEnquirySubmit";

type FormValues = Omit<Extract<EnquiryInput, { type: "stallion" }>, "type">;

export function StallionEnquiryForm({ stallionId, stallionName }: { stallionId: string; stallionName: string }) {
  const { status, error, submit } = useEnquirySubmit();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(stallionEnquirySchema.omit({ type: true })),
    defaultValues: { stallionId },
  });

  if (status === "success") {
    return (
      <div className="border border-line bg-warm-white p-8 text-center">
        <p className="font-serif text-xl text-brown">Enquiry sent</p>
        <p className="mt-2 text-sm text-grey">
          Thank you — Medowie Lodge has received your enquiry about {stallionName} and will be in touch.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit((values) => submit({ type: "stallion", ...values }))}
      className="border border-line bg-warm-white p-6 sm:p-8"
    >
      <p className="eyebrow mb-1">Stallion</p>
      <p className="mb-6 font-serif text-2xl text-brown">{stallionName}</p>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Name" required register={register("name")} error={errors.name} />
        <TextField label="Email" required type="email" register={register("email")} error={errors.email} />
        <TextField label="Phone" register={register("phone")} error={errors.phone} />
        <TextField label="State" register={register("state")} error={errors.state} />
        <TextField label="Mare Name" register={register("mareName")} error={errors.mareName} />
        <TextField label="Mare Sire" register={register("mareSire")} error={errors.mareSire} />
      </div>

      <TextAreaField label="Message" register={register("message")} error={errors.message} className="mt-5 block" />

      {error && <p className="mt-4 text-sm text-orange-dark">{error}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 rounded-[3px] bg-orange px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-warm-white hover:bg-orange-dark disabled:opacity-50"
      >
        {status === "submitting" ? "Sending…" : "Send Breeding Enquiry"}
      </button>
    </form>
  );
}
