"use client";

import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookAMareSchema, type EnquiryInput } from "@/lib/validation/enquiry";
import { TextField, TextAreaField, SelectField } from "@/components/forms/fields";
import { useEnquirySubmit } from "@/components/forms/useEnquirySubmit";
import type { Stallion } from "@/lib/supabase/types";

type FormValues = Omit<Extract<EnquiryInput, { type: "book_a_mare" }>, "type">;

export function BookAMareForm({ stallions }: { stallions: Pick<Stallion, "id" | "slug" | "name" | "country_suffix">[] }) {
  const searchParams = useSearchParams();
  const preselected = stallions.find((s) => s.slug === searchParams.get("stallion"));
  const { status, error, submit } = useEnquirySubmit();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(bookAMareSchema.omit({ type: true })),
    defaultValues: { stallionId: preselected?.id, country: "Australia" },
  });

  if (status === "success") {
    return (
      <div className="border border-line bg-warm-white p-10 text-center">
        <p className="font-serif text-2xl text-brown">Booking enquiry received</p>
        <p className="mt-3 text-sm text-grey">
          Thank you. Medowie Lodge has recorded your enquiry and Darren Reay will be in touch to confirm
          availability. This form does not constitute a confirmed booking.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit((values) => submit({ type: "book_a_mare", ...values }))}
      className="border border-line bg-warm-white p-6 sm:p-10"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField label="Stallion" required register={register("stallionId")} error={errors.stallionId} className="sm:col-span-2">
          <option value="">Select a stallion</option>
          {stallions.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
              {s.country_suffix ? ` ${s.country_suffix}` : ""}
            </option>
          ))}
        </SelectField>

        <TextField label="Mare Name" required register={register("mareName")} error={errors.mareName} />
        <TextField label="Mare Age" register={register("mareAge")} error={errors.mareAge} />
        <TextField label="Sire" register={register("mareSire")} error={errors.mareSire} />
        <TextField label="Dam" register={register("mareDam")} error={errors.mareDam} />
        <TextField label="Dam Sire" register={register("mareDamsire")} error={errors.mareDamsire} />
        <TextField label="Semen Requirement" register={register("semenRequirement")} error={errors.semenRequirement} />

        <TextField label="Breeder / Owner" required register={register("breederOwner")} error={errors.breederOwner} />
        <TextField label="Phone" required register={register("phone")} error={errors.phone} />
        <TextField label="Email" required type="email" register={register("email")} error={errors.email} />
        <TextField label="State" required register={register("state")} error={errors.state} />
        <TextField label="Country" register={register("country")} error={errors.country} />
        <TextField label="Expected Cycle Date" type="date" register={register("expectedCycleDate")} error={errors.expectedCycleDate} />
      </div>

      <TextAreaField label="Notes" register={register("message")} error={errors.message} className="mt-5 block" />

      <label className="mt-5 flex items-start gap-3 text-sm text-grey">
        <input type="checkbox" required {...register("acknowledged")} className="mt-1" />
        <span>I understand this form is an enquiry and does not constitute a confirmed booking.</span>
      </label>
      {errors.acknowledged && <p className="mt-1 text-xs text-orange-dark">{errors.acknowledged.message}</p>}

      {error && <p className="mt-4 text-sm text-orange-dark">{error}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 rounded-[3px] bg-orange px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-warm-white hover:bg-orange-dark disabled:opacity-50"
      >
        {status === "submitting" ? "Sending…" : "Submit Booking Enquiry"}
      </button>
    </form>
  );
}
