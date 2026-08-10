import { clsx } from "clsx";

export function SectionHeading({
  eyebrow,
  heading,
  intro,
  align = "left",
  className,
}: {
  eyebrow?: string;
  heading: string;
  intro?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={clsx("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className="text-3xl text-brown sm:text-4xl">{heading}</h2>
      {intro && <p className="mt-4 text-[15px] leading-relaxed text-grey">{intro}</p>}
    </div>
  );
}
