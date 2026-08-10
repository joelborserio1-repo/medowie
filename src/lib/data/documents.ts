import { strapiFind } from "@/lib/cms/client";
import type { DocumentCategory, FormDocument } from "@/lib/cms/types";

export async function getActiveDocuments(): Promise<FormDocument[]> {
  return strapiFind<FormDocument>("/form-documents", {
    filters: { active: { $eq: true } },
    sort: ["displayOrder:asc"],
    populate: "*",
  });
}

export async function getDocumentsByCategory(): Promise<Record<DocumentCategory, FormDocument[]>> {
  const documents = await getActiveDocuments();
  const grouped: Record<DocumentCategory, FormDocument[]> = {
    "Stallion Service Contracts": [],
    "Semen Order Forms": [],
    "Breeding Information": [],
    "Other Documents": [],
  };
  for (const doc of documents) {
    grouped[doc.category].push(doc);
  }
  return grouped;
}
