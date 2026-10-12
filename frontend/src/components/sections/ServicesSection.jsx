import React, { useEffect, useState } from "react";
import { SERVICES, SERVICES_INTRO } from "../../data/services.js";
import { IconCheck } from "../icons.jsx";
import { fetchServices } from "../../services/api.js";
import { getIconComponent } from "../../utils/iconMap.jsx";

const toArabic = (n) => String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);

export default function ServicesSection() {
  const [services, setServices] = useState(SERVICES);

  useEffect(() => {
    fetchServices().then((data) => {
      if (Array.isArray(data)) setServices(data);
    });
  }, []);

  return (
    <div dir="rtl" lang="ar">
      <section id="services" className="bg-ink py-24 md:py-32 relative">
        <div className="absolute inset-0 lattice-soft opacity-40 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-right mb-16">
            <p className="text-gild-bright text-sm mb-3">ما نقدمه</p>
            <h2 className="font-serif font-bold text-4xl md:text-5xl text-parchment">خدماتنا وأقسامنا</h2>
            <div className="hairline w-24 my-7 mr-0 ml-auto" />
            <p className="text-stone max-w-xl mr-0 ml-auto leading-7">{SERVICES_INTRO}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {services.map((s, i) => {
              const ServiceIcon = typeof s.icon === "function" ? s.icon : getIconComponent(s.icon);
              const description = s.description || s.body;
              return (
              <article
                key={s._id || i}
                className="group relative bg-[#898989] border border-ink-line hover:border-gild-bright/70 transition-colors p-8 cut-corner"
              >
                <div className="flex items-start justify-between mb-6">
                  <ServiceIcon className="w-11 h-11 text-ink" />
                  <span className="font-serif text-4xl text-silver/10">{toArabic(i + 1)}</span>
                </div>
                <h3 className="font-serif font-bold text-2xl text-parchment mb-2">{s.title}</h3>
                <p className="text-stone text-sm leading-7 mb-5">{description}</p>
                <ul className="space-y-2.5 border-t border-ink-line pt-5">
                  {(s.items || []).map((it, k) => (
                    <li key={k} className="flex items-start gap-3 text-sm text-parchment/90 leading-7">
                      <IconCheck className="w-4 h-4 text-gild-bright mt-1.5 shrink-0" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
