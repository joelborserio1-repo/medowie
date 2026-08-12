"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError("Incorrect email or password.");
      setLoading(false);
      return;
    }

    router.push(searchParams.get("next") ?? "/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm border border-line bg-warm-white p-8">
      <p className="eyebrow mb-2">Medowie Lodge</p>
      <h1 className="mb-6 font-serif text-2xl text-brown">Admin sign in</h1>

      <label className="mb-4 block">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-grey">Email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-line bg-warm-white px-3 py-2.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange"
        />
      </label>

      <label className="mb-6 block">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-grey">Password</span>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-line bg-warm-white px-3 py-2.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange"
        />
      </label>

      {error && <p className="mb-4 text-sm text-orange-dark">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-[3px] bg-orange px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-warm-white hover:bg-orange-dark disabled:opacity-50"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>

      <p className="mt-6 text-xs text-grey">
        Admin accounts are created directly in Supabase — there is no public registration.
      </p>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
