import type { Metadata } from "next";
import { cormorant, inter } from "@/lib/fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: { default: "Admin — Medowie Lodge", template: "%s — Medowie Lodge Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-parchment text-charcoal antialiased">{children}</body>
    </html>
  );
}
