import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function getAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: adminRecord } = await supabase
    .from("admin_users")
    .select("id, full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (!adminRecord) return null;

  return { id: user.id, email: user.email, fullName: adminRecord.full_name as string | null };
}

export async function requireAdmin() {
  const admin = await getAdminUser();
  if (!admin) redirect("/admin/login");
  return admin;
}
