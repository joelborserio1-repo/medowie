/**
 * Embeds the Facebook Page Plugin (the standard public iframe embed —
 * no app ID or access token needed, just the page's own URL).
 *
 * Two layouts:
 *  - "section" (default): a full-width band with its own heading, used as a
 *    standalone block on a page.
 *  - "panel": a compact, framed card designed to sit inside a column (e.g.
 *    next to the homepage welcome copy) so the social feed feels integrated
 *    rather than bolted on.
 */
export function FacebookFeed({
  facebookUrl,
  variant = "section",
}: {
  facebookUrl: string | null | undefined;
  variant?: "section" | "panel";
}) {
  const embed = facebookUrl ? (
    <iframe
      src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(
        facebookUrl
      )}&tabs=timeline&width=420&height=560&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=true`}
      title="Medowie Lodge on Facebook"
      width="420"
      height="560"
      style={{ border: "none", overflow: "hidden", maxWidth: "100%" }}
      scrolling="no"
      loading="lazy"
      allow="encrypted-media"
    />
  ) : null;

  if (variant === "panel") {
    return (
      <div className="rounded-brand border border-line bg-parchment shadow-[0_1px_2px_rgba(74,38,10,0.06)]">
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-earth">Latest Updates</p>
          {facebookUrl && (
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-semibold uppercase tracking-[0.1em] text-orange hover:underline"
            >
              Follow →
            </a>
          )}
        </div>
        <div className="flex justify-center overflow-hidden p-3">
          {embed ?? (
            <p className="px-4 py-10 text-center text-sm text-grey">
              Follow Medowie Lodge on social media for the latest news, results and yearling updates.
            </p>
          )}
        </div>
      </div>
    );
  }

  if (!facebookUrl) return null;

  return (
    <section className="border-t border-line py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
        <p className="eyebrow mb-3">Follow Along</p>
        <h2 className="font-serif text-3xl text-brown sm:text-4xl">Latest from Facebook</h2>
        <div className="mt-8 flex justify-center overflow-x-auto">{embed}</div>
      </div>
    </section>
  );
}
