const PARTNERS = [
  "1750739214_2Htj copy.jpg",
  "1762756851606.jpeg",
  "7th_(Prince_Sultan)_Armoured_Brigade.svg",
  "8cb5c5bd-adec-47e2-8cb7-84b02e9d9442.jpg",
  "9ac8ebfd-ad17-4cad-9c30-b37f54d5e9e2.jpg",
  "Logo-png.jpg",
  "Lu7onb17275992281576-Tabuk International Schools.webp",
  "agd-logo-1 copy.jpg",
  "image_6.jpg",
  "images (1).jpeg",
  "images (2).jpeg",
  "images.jpeg",
  "images.png",
  "labid -logo.jpg",
  "logo copy.jpg",
  "logo1 copy.jpg",
  "logo2 copy.jpg",
  "pf-logo.jpg",
  "استكر شفاف اكريلك copy.jpg",
  "باسقات2 copy.jpg",
  "تنزيل.png",
  "شعار copy.jpg",
  "شعار المدرسه-01.jpg",
  "شعار إضافي ملون copy.jpg",
  "شعار مدارس اجيال التبوك copy.jpg",
  "ظهر الغلاف copy.jpg",
  "عطاء@4x-8 copy.jpg",
  "كنز العافية لوجو 1 copy.jpg",
  "لوجو واثق المجد 1 copy.jpg",
  "مئاق-اللقيمات---اليوم-الوطني-95-1-copy copy.jpg",
  "وزارة البيئة والمياه والزراعة copy.jpg",
];

export default function PartnersSection() {
  const logos = [...PARTNERS, ...PARTNERS];

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
                aria-hidden={index >= PARTNERS.length}
              >
                <img
                  src={encodeURI(`/partners/${partner}`)}
                  alt={index < PARTNERS.length ? `شريك نجاح ${index + 1}` : ""}
                  className="max-h-full max-w-full object-contain"
                  loading="lazy"
                  draggable="false"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
