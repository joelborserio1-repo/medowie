"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trainingEnquirySchema, type EnquiryInput } from "@/lib/validation/enquiry";
import { TextField, TextAreaField } from "@/components/forms/fields";
import { useEnquirySubmit } from "@/components/forms/useEnquirySubmit";

type FormValues = Omit<Extract<EnquiryInput, { type: "training" }>, "type">;

export function TrainingEnquiryForm() {
  const { status, error, submit } = useEnquirySubmit();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(trainingEnquirySchema.omit({ type: true })) });

  if (status === "success") {
    return (
      <div className="border border-line bg-warm-white p-8 text-center">
        <p className="font-serif text-xl text-brown">Enquiry sent</p>
        <p className="mt-2 text-sm text-grey">Thank you — Medowie Lodge will be in touch about training.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit((values) => submit({ type: "training", ...values }))}
      className="border border-line bg-warm-white p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Horse Name" register={register("horseName")} error={errors.horseName} />
        <TextField label="Age" register={register("horseAge")} error={errors.horseAge} />
        <TextField label="Sex" register={register("horseSex")} error={errors.horseSex} />
        <TextField label="Current Location" register={register("currentLocation")} error={errors.currentLocation} />
        <TextField
          label="Service Required"
          register={register("serviceRequired")}
          error={errors.serviceRequired}
          className="sm:col-span-2"
        />
        <TextField label="Owner Name" required register={register("name")} error={errors.name} />
        <TextField label="Phone" register={register("phone")} error={errors.phone} />
        <TextField label="Email" required type="email" register={register("email")} error={errors.email} />
      </div>

      <TextAreaField label="Details" register={register("message")} error={errors.message} className="mt-5 block" />

      {error && <p className="mt-4 text-sm text-orange-dark">{error}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 rounded-[3px] bg-orange px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-warm-white hover:bg-orange-dark disabled:opacity-50"
      >
        {status === "submitting" ? "Sending…" : "Training Enquiry"}
      </button>
    </form>
  );
}
