import Image from "next/image";

const BANNERS = [
  {
    key: "stud",
    src: "/home/stud.webp",
    width: 1625,
    height: 968,
    alt: "Medowie Lodge Stud — quality stallions, chilled and frozen semen available, on-property natural cover, proven results",
  },
  {
    key: "training",
    src: "/home/training.webp",
    width: 1625,
    height: 968,
    alt: "Medowie Lodge Training — race day preparation, fitness and conditioning, individual programs, dedication and experience",
  },
  {
    key: "yearling",
    src: "/home/yearling-preparation.webp",
    width: 1672,
    height: 941,
    alt: "Medowie Lodge Yearling Preparation — hand-raised care, sales ring preparation, professional presentation, Sydney APG and Bathurst sales",
  },
];

export function OperationIntro() {
  return (
    <section className="border-t border-line py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
        <p className="eyebrow mb-3">The Medowie Lodge Operation</p>
        <h2 className="max-w-xl font-serif text-3xl text-brown sm:text-4xl">
          Stud, training and preparation under one property.
        </h2>

        <div className="mt-10 flex flex-col gap-8">
          {BANNERS.map((banner) => (
            <Image
              key={banner.key}
              src={banner.src}
              alt={banner.alt}
              width={banner.width}
              height={banner.height}
              className="h-auto w-full"
              sizes="(min-width: 1400px) 1400px, 100vw"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
