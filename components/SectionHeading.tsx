import React from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  alignment?: "left" | "center" | "split";
  dark?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  alignment = "left",
  dark = false,
}: SectionHeadingProps) {
  if (alignment === "split") {
    return (
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#ECE7DF]">
        <div className="space-y-3">
          {eyebrow && (
            <p
              className={`text-[11px] font-sans tracking-[0.25em] uppercase font-medium ${
                dark ? "text-[#8C877E]" : "text-[#8C877E]"
              }`}
            >
              {eyebrow}
            </p>
          )}
          <h2
            className={`font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight ${
              dark ? "text-[#FAF8F5]" : "text-[#171615]"
            }`}
          >
            {title}
          </h2>
        </div>
        {description && (
          <p
            className={`max-w-md text-sm sm:text-base font-light leading-relaxed ${
              dark ? "text-[#DFD9CF]" : "text-[#5A5752]"
            }`}
          >
            {description}
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      className={`space-y-3 ${
        alignment === "center" ? "text-center max-w-2xl mx-auto" : "max-w-2xl"
      }`}
    >
      {eyebrow && (
        <p
          className={`text-[11px] font-sans tracking-[0.25em] uppercase font-medium ${
            dark ? "text-[#8C877E]" : "text-[#8C877E]"
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight leading-[1.15] ${
          dark ? "text-[#FAF8F5]" : "text-[#171615]"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`text-sm sm:text-base font-light leading-relaxed pt-2 ${
            dark ? "text-[#DFD9CF]" : "text-[#5A5752]"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
