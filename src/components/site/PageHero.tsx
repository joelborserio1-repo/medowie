export function PageHero({ eyebrow, heading, intro }: { eyebrow?: string; heading: string; intro?: string }) {
  return (
    <section className="border-b border-line py-14 sm:py-20">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="font-serif text-4xl text-brown sm:text-5xl">{heading}</h1>
        {intro && <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-grey">{intro}</p>}
      </div>
    </section>
  );
}
