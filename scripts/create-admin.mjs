import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "node:crypto";

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.ADMIN_EMAIL || "admin@medowielodge.com.au";
const fullName = process.env.ADMIN_NAME || "Medowie Lodge Admin";

// Strong temporary password: letters+digits+symbol, easy to replace after login.
function genPassword() {
  const base = randomBytes(12).toString("base64").replace(/[^a-zA-Z0-9]/g, "").slice(0, 12);
  return `Ml-${base}!7`;
}

async function main() {
  const s = createClient(url, serviceKey, { auth: { persistSession: false } });

  // Find existing auth user with this email (paginate).
  let existing = null;
  for (let page = 1; page <= 10 && !existing; page++) {
    const { data, error } = await s.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    existing = data.users.find((u) => (u.email || "").toLowerCase() === email.toLowerCase()) || null;
    if (data.users.length < 200) break;
  }

  const password = genPassword();
  let userId;

  if (existing) {
    userId = existing.id;
    const { error } = await s.auth.admin.updateUserById(userId, { password, email_confirm: true });
    if (error) throw error;
    console.log("Reset password for existing auth user:", email);
  } else {
    const { data, error } = await s.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error) throw error;
    userId = data.user.id;
    console.log("Created auth user:", email);
  }

  // Ensure admin_users row.
  const { error: aErr } = await s.from("admin_users").upsert({ id: userId, full_name: fullName }, { onConflict: "id" });
  if (aErr) throw aErr;

  // Verify.
  const { data: check } = await s.from("admin_users").select("id, full_name").eq("id", userId).maybeSingle();

  console.log("\n==================== ADMIN LOGIN ====================");
  console.log("URL      : /admin/login");
  console.log("Email    :", email);
  console.log("Password :", password);
  console.log("admin_users row:", JSON.stringify(check));
  console.log("=====================================================");
  console.log("Change this password after first login.");
}

main().catch((e) => {
  console.error("CREATE ADMIN FAILED:", e.message);
  process.exit(1);
});
