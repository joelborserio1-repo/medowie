import { createClient } from "@/lib/supabase/server";
import type { DocumentCategory, DocumentRecord } from "@/lib/supabase/types";

export async function getActiveDocuments(): Promise<DocumentRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("active", true)
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getDocumentsByCategory(): Promise<Record<DocumentCategory, DocumentRecord[]>> {
  const documents = await getActiveDocuments();
  const grouped: Record<DocumentCategory, DocumentRecord[]> = {
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
