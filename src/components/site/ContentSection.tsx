import type { SiteContentBlock } from "@/lib/supabase/types";

export function ContentSection({ block, eyebrow }: { block: SiteContentBlock | undefined | null; eyebrow?: string }) {
  if (!block || !block.body) return null;

  return (
    <section className="border-b border-line py-14">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          <div>
            {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
            <h2 className="font-serif text-2xl text-brown">{block.heading}</h2>
          </div>
          <div className="max-w-2xl whitespace-pre-line text-[15px] leading-relaxed text-charcoal">
            {block.body}
          </div>
        </div>
      </div>
    </section>
  );
}
