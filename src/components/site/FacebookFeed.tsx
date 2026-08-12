/**
 * Embeds the Facebook Page Plugin (the standard public iframe embed —
 * no app ID or access token needed, just the page's own URL). Renders
 * nothing if no Facebook URL is set in Site Settings.
 */
export function FacebookFeed({ facebookUrl }: { facebookUrl: string | null | undefined }) {
  if (!facebookUrl) return null;

  const src = `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(
    facebookUrl
  )}&tabs=timeline&width=500&height=700&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true`;

  return (
    <section className="border-t border-line py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
        <p className="eyebrow mb-3">Follow Along</p>
        <h2 className="font-serif text-3xl text-brown sm:text-4xl">Latest from Facebook</h2>

        <div className="mt-8 flex justify-center overflow-x-auto">
          <iframe
            src={src}
            title="Medowie Lodge on Facebook"
            width="500"
            height="700"
            style={{ border: "none", overflow: "hidden", maxWidth: "100%" }}
            scrolling="no"
            loading="lazy"
            allow="encrypted-media"
          />
        </div>
      </div>
    </section>
  );
}
