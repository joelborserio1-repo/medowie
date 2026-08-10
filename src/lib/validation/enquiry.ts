import { z } from "zod";

const base = {
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().optional(),
  message: z.string().optional(),
};

export const generalEnquirySchema = z.object({
  type: z.literal("general"),
  ...base,
  message: z.string().min(1, "Message is required"),
  subject: z.string().optional(),
});

export const stallionEnquirySchema = z.object({
  type: z.literal("stallion"),
  ...base,
  stallionId: z.string().optional(),
  mareName: z.string().optional(),
  mareSire: z.string().optional(),
  state: z.string().optional(),
});

export const bookAMareSchema = z.object({
  type: z.literal("book_a_mare"),
  ...base,
  stallionId: z.string().min(1, { message: "Select a stallion" }),
  mareName: z.string().min(1, "Mare name is required"),
  mareAge: z.string().optional(),
  mareSire: z.string().optional(),
  mareDam: z.string().optional(),
  mareDamsire: z.string().optional(),
  breederOwner: z.string().min(1, "Breeder / owner is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().optional(),
  semenRequirement: z.string().optional(),
  expectedCycleDate: z.string().optional(),
  acknowledged: z.literal(true, {
    message: "Please confirm you understand this is an enquiry",
  }),
});

export const trainingEnquirySchema = z.object({
  type: z.literal("training"),
  ...base,
  horseName: z.string().optional(),
  horseAge: z.string().optional(),
  horseSex: z.string().optional(),
  currentLocation: z.string().optional(),
  serviceRequired: z.string().optional(),
});

export const horseForSaleEnquirySchema = z.object({
  type: z.literal("horse_for_sale"),
  ...base,
  horseId: z.string().optional(),
});

export const enquirySchema = z.discriminatedUnion("type", [
  generalEnquirySchema,
  stallionEnquirySchema,
  bookAMareSchema,
  trainingEnquirySchema,
  horseForSaleEnquirySchema,
]);

export type EnquiryInput = z.infer<typeof enquirySchema>;
