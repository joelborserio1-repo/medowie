import { BrandImage } from "@/components/ui/BrandImage";

const PARTS = [
  {
    key: "stud",
    label: "Stud",
    copy: "Medowie Lodge stands Standardbred stallions for the breeding season, offering chilled and frozen semen services alongside on-property natural cover where available.",
  },
  {
    key: "training",
    label: "Training",
    copy: "Darren Reay is a licensed Harness Racing trainer preparing horses for race day from the Medowie property, in the Hunter Region of New South Wales.",
  },
  {
    key: "yearling",
    label: "Yearling Preparation",
    copy: "Yearlings are hand-raised and prepared at Medowie Lodge for presentation at the Sydney APG and Bathurst yearling sales each year.",
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

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {PARTS.map((part) => (
            <div key={part.key}>
              <div className="relative aspect-[5/4]">
                <BrandImage src={null} alt={part.label} label={part.label} />
              </div>
              <h3 className="mt-4 font-serif text-xl text-brown">{part.label}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-grey">{part.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
