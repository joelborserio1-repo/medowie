import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export function useEnquirySubmit() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(payload: Record<string, unknown>) {
    setStatus("submitting");
    setError(null);

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error ?? "Something went wrong. Please try again or call Medowie Lodge directly.");
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setError("Something went wrong. Please try again or call Medowie Lodge directly.");
      setStatus("error");
    }
  }

  return { status, error, submit };
}
