import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { fetchProjects } from "../../services/api.js";
import { IconChevron } from "../icons.jsx";

const AUTOPLAY_MS = 6000;
const toArabic = (n) => String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);

export default function ProjectsSection() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef(null);

  useEffect(() => {
    (async () => {
      const data = await fetchProjects(true);
      setProjects(Array.isArray(data) ? data : []);
      setLoading(false);
    })();
  }, []);

  const count = projects.length;
  const go = (n) => setIndex(((n % count) + count) % count);
  const next = () => go(index + 1);
  const prev = () => go(index - 1);

  // autoplay (off for reduced-motion users, when hovered/focused, or with a single project)
  useEffect(() => {
    if (count < 2 || paused) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [index, count, paused]);

  // swipe: in RTL the next slide sits to the left, so dragging right reveals it
  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; setPaused(true); };
  const onTouchEnd = (e) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 50) (dx > 0 ? next : prev)();
    setPaused(false);
  };

  if (loading) return <div className="text-center text-parchment py-24">جاري التحميل...</div>;

  return (
    <section id="projects" dir="rtl" lang="ar" className="bg-ink py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="text-center md:text-right mb-12">
          <p className="text-gild-bright text-sm mb-3">أعمالنا</p>
          <h2 className="font-serif font-bold text-4xl md:text-5xl text-parchment">مشاريع مختارة</h2>
          <div className="hairline w-24 my-6 mx-auto md:mr-0 md:ml-auto" />
        </div>

        {count === 0 ? (
          <div className="text-center py-20 bg-ink-soft border border-ink-line rounded-xl">
            <h3 className="font-serif text-2xl text-parchment mb-2">لا توجد مشاريع مضافة حالياً</h3>
            <p className="text-stone">قريباً سيتم إضافة أعمالنا هنا...</p>
          </div>
        ) : (
          <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            role="region"
            aria-roledescription="carousel"
            aria-label="مشاريع مختارة"
          >
            {/* viewport */}
            <div className="overflow-hidden border border-ink-line bg-ink-soft cut-corner">
              <div
                className="flex transition-transform duration-700 ease-[cubic-bezier(.65,0,.2,1)]"
                style={{ transform: `translateX(${index * 100}%)` }}
              >
                {projects.map((p, i) => {
                  const img = p.images?.[0] || p.image || p.cover;
                  return (
                    <article
                      key={p._id || i}
                      className="w-full shrink-0 grid md:grid-cols-2"
                      aria-hidden={i !== index}
                      aria-label={`${i + 1} من ${count}`}
                    >
                      {/* text */}
                      <div className="p-7 md:p-12 flex flex-col order-2 md:order-1">
                        <div className="flex items-center gap-3 mb-6 text-sm">
                          <span className="font-serif text-3xl text-gild/60">{p.year}</span>
                          {p.category && (
                            <span className="rounded-full border border-white/20 bg-white/[.06] px-3 py-1 text-xs text-stone">
                              {p.category}
                            </span>
                          )}
                        </div>
                        <h3 className="font-serif font-bold text-3xl md:text-4xl text-parchment mb-4 leading-snug">{p.title}</h3>
                        <p className="text-stone text-sm md:text-base leading-8 mb-8 flex-1">
                          {p.description || p.body}
                        </p>
                        <Link
                          to={`/projects/${p.slug || p._id}`}
                          tabIndex={i === index ? 0 : -1}
                          className="group self-start inline-flex items-center gap-3 bg-parchment text-oxblood px-7 py-3 text-sm font-bold rounded-[20px] hover:bg-silver-light transition-colors"
                        >
                          استكشف المشروع
                          <IconChevron className="w-4 h-4 rotate-180 transition-transform group-hover:-translate-x-1" />
                        </Link>
                      </div>

                      {/* project photo (falls back to the brand logo if the project has no images) */}
                      <div className="relative min-h-[240px] md:min-h-[400px] order-1 md:order-2 bg-gradient-to-br from-oxblood-soft via-oxblood to-oxblood-deep">
                        {img ? (
                          <img src={img} alt={p.title} loading="lazy" draggable="false" className="absolute inset-0 w-full h-full object-cover" />
                        ) : (
                          <img src="/logo-new.png" alt="" aria-hidden="true" className="absolute inset-0 m-auto w-1/3 max-w-[180px] opacity-40" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent pointer-events-none" />
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* controls */}
            {count > 1 && (
              <div className="flex items-center justify-between mt-6">
                <span className="font-serif text-parchment/70 text-lg tabular-nums">
                  {toArabic(String(index + 1).padStart(2, "0"))} <span className="text-parchment/30">/</span> {toArabic(String(count).padStart(2, "0"))}
                </span>

                <div className="flex items-center gap-2" role="tablist" aria-label="اختيار المشروع">
                  {projects.map((p, i) => (
                    <button
                      key={p._id || i}
                      role="tab"
                      aria-selected={i === index}
                      aria-label={`المشروع ${i + 1}`}
                      onClick={() => go(i)}
                      className={"h-2 rounded-full transition-all duration-300 " + (i === index ? "w-8 bg-gild-bright" : "w-2 bg-white/25 hover:bg-white/50")}
                    />
                  ))}
                </div>

                <div className="flex gap-2">
                  <button onClick={prev} aria-label="السابق" className="w-11 h-11 rounded-full border border-white/25 text-parchment hover:bg-white/10 hover:border-gild-bright flex items-center justify-center transition-colors">
                    <IconChevron className="w-4 h-4" />
                  </button>
                  <button onClick={next} aria-label="التالي" className="w-11 h-11 rounded-full border border-white/25 text-parchment hover:bg-white/10 hover:border-gild-bright flex items-center justify-center transition-colors">
                    <IconChevron className="w-4 h-4 rotate-180" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}