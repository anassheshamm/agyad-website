import React from "react";
import { SERVICES, SERVICES_INTRO } from "../../data/services.js";
import { IconCheck } from "../icons.jsx";

const toArabic = (n) => String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);

export default function ServicesSection() {
  return (
    <div dir="rtl" lang="ar">
      <section id="services" className="bg-ink py-20 md:py-28 relative">
        <div className="absolute inset-0 lattice-soft opacity-40 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-center md:text-right mb-12">
            <p className="text-gild-bright text-sm mb-3">ما نقدمه</p>
            <h2 className="font-serif font-bold text-4xl md:text-5xl text-parchment">خدماتنا وأقسامنا</h2>
            <div className="hairline w-24 my-6 mx-auto md:mr-0 md:ml-auto" />
            <p className="text-stone max-w-xl mx-auto md:mr-0 md:ml-auto leading-7">{SERVICES_INTRO}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-5">
            {SERVICES.map((s, i) => {
              const description = s.body;
              return (
                <article
                  key={s._id || i}
                  className="group relative overflow-hidden isolate bg-ink-soft border border-ink-line hover:border-gild-bright/70 transition-colors p-5 md:p-6 cut-corner-sm"
                >
                  {/* blurred photo background */}
                  <img
                    src={s.image}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    draggable="false"
                    className="absolute inset-0 -z-20 w-full h-full object-cover scale-110 blur-[3px] transition duration-700 group-hover:blur-[1.5px] group-hover:scale-125"
                  />
                  {/* dark wash so the text stays readable */}
                  <div className="absolute inset-0 -z-10 bg-black/60" />

                  <span className="absolute top-3 left-4 font-serif text-3xl text-parchment/20">{toArabic(i + 1)}</span>

                  <h3 className="font-serif font-bold text-xl md:text-2xl text-parchment mb-2 pt-1">{s.title}</h3>
                  <p className="text-stone text-md leading-6 mb-4">{description}</p>

                  {(s.items || []).length > 0 && (
                    <ul className="space-y-1.5 border-t border-white/15 pt-4">
                      {s.items.map((it, k) => (
                        <li key={k} className="flex items-start gap-2.5 text-[13px] text-parchment/90 leading-6">
                          <IconCheck className="w-3.5 h-3.5 text-gild-bright mt-1.5 shrink-0" />
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
