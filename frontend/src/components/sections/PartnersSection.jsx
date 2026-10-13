import { useState } from "react";

/* Every file must exist in  public/partners/  with EXACTLY this name (case-sensitive).
   Tip: use simple English names (p1.jpg, p2.png …) — Arabic/space/@ names break easily. */
const PARTNERS = [
  "p1.svg",
  "p2.jpg",
  "p3.jpg",
  "p4.jpg",
  "p5.jpeg",
  "p6.jpg",
  "p7.jpg",
  "p8.jpeg",
  "p9.jpeg",
  "p10.jpeg",
  "p11.png",
  "p12.jpg",
  "p13.jpg",
  "p14.jpg",
  "p15.jpg",
  "p16.jpg",
  "p17.webp",
  "pf-logo.jpg",
  "p18.jpg",
  "p19.jpg",
  "تنزيل.png",
  "شعار copy.jpg",
  "شعار المدرسه-01.jpg",
 "p20.jpg",
  "شعار مدارس اجيال التبوك copy.jpg",
  "ظهر الغلاف copy.jpg",
  "عطاء@4x-8 copy.jpg",
  "كنز العافية لوجو 1 copy.jpg",
  "لوجو واثق المجد 1 copy.jpg",
  "مئاق-اللقيمات---اليوم-الوطني-95-1-copy copy.jpg",
  "p21.jpg",
];

export default function PartnersSection() {
  // files that failed to load are removed instead of leaving empty white cards
  const [broken, setBroken] = useState([]);
  const partners = PARTNERS.filter((p) => !broken.includes(p));
  const logos = [...partners, ...partners];

  const onError = (partner) => {
    console.warn(`[Partners] image not found: /partners/${partner}`);
    setBroken((b) => (b.includes(partner) ? b : [...b, partner]));
  };

  return (
    <section id="partners" dir="rtl" lang="ar" className="bg-parchment text-ink py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="text-center mb-12">
          <p className="text-oxblood text-sm mb-3">ثقة نعتز بها</p>
          <h2 className="font-serif text-4xl md:text-5xl">شركاء النجاح</h2>
          <div className="hairline w-24 my-6 mx-auto opacity-70" />
          <p className="text-ink/60 max-w-xl mx-auto leading-7">نفخر بالعمل مع جهات وعلامات تجارية تثق بخبرتنا في تنفيذ مشاريعها.</p>
        </div>

        <div className="partners-marquee" aria-label="شعارات شركاء النجاح">
          <div className="partners-marquee-track">
            {logos.map((partner, index) => (
              <div
                key={`${partner}-${index}`}
                className="flex h-36 w-56 md:h-40 md:w-64 shrink-0 items-center justify-center rounded-xl border border-ink/10 bg-white p-5 shadow-sm"
                aria-hidden={index >= partners.length}
              >
                <img
                  src={encodeURI(`/partners/${partner}`)}
                  alt={index < partners.length ? `شريك نجاح ${index + 1}` : ""}
                  className="max-h-full max-w-full object-contain"
                  draggable="false"
                  onError={() => onError(partner)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}