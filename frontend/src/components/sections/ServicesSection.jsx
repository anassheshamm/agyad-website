import React from "react";
import { SERVICES, SERVICES_INTRO } from "../../data/services.js";
import { IconCheck } from "../icons.jsx";

const toArabic = (n) =>
  String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);

export default function ServicesSection() {
  return (
    <div dir="rtl" lang="ar">
      <section
        id="services"
        className="relative bg-ink py-20 md:py-28"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 lattice-soft opacity-40 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 md:px-10">
          {/* Section heading */}
          <div className="text-center md:text-right mb-12 md:mb-16">
            <p className="text-gild-bright text-sm mb-3">
              ما نقدمه
            </p>

            <h2 className="font-serif font-bold text-4xl md:text-5xl text-parchment">
              خدماتنا وأقسامنا
            </h2>

            <div className="hairline w-24 my-6 mx-auto md:mr-0 md:ml-auto" />

            <p className="text-stone max-w-xl mx-auto md:mr-0 md:ml-auto leading-7">
              {SERVICES_INTRO}
            </p>
          </div>

          {/* Services cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {SERVICES.map((s, i) => (
              <article
                key={s._id || s.title || i}
                className="group overflow-hidden rounded-3xl bg-ink-soft border border-ink-line hover:border-gild-bright/60 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Service image */}
                <div className="relative h-56 md:h-64 overflow-hidden bg-ink-line">
                  <img
                    src={s.image}
                    alt={s.title}
                    loading="lazy"
                    draggable="false"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Image overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                  {/* Service number */}
                  <span className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 rounded-xl bg-oxblood text-parchment font-serif text-lg shadow-lg">
                    {toArabic(i + 1)}
                  </span>
                </div>

                {/* Service content */}
                <div className="p-6 md:p-7">
                  <h3 className="font-serif font-bold text-xl md:text-2xl text-parchment mb-3 leading-relaxed">
                    {s.title}
                  </h3>

                  <p className="text-stone text-sm leading-7 mb-5">
                    {s.body}
                  </p>

                  {(s.items || []).length > 0 && (
                    <ul className="space-y-3 border-t border-white/10 pt-5">
                      {s.items.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2.5 text-sm text-parchment/85 leading-6"
                        >
                          <IconCheck className="w-4 h-4 text-gild-bright mt-1 shrink-0" />

                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
