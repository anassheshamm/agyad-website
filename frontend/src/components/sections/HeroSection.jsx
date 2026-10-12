import { useRef } from "react";
import { BRAND, INTRO, VALUES } from "../../data/about.js";
import { IconChevron, IconCheck } from "../icons.jsx";

const MARQUEE = [
  "هويات بصرية",
  "تصميم إبداعي",
  "طباعة رقمية وأوفست",
  "حروف بارزة",
  "لوحات مضيئة ونيون",
  "مواقع وتطبيقات",
  "إدارة سوشيال ميديا",
  "تصميم عبوات",
];

/* Local keyframes so this file is fully self-contained */
const CSS = `
@keyframes hx-up{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}
@keyframes hx-float{0%,100%{transform:translateY(0) rotate(var(--r,0deg))}50%{transform:translateY(-12px) rotate(var(--r,0deg))}}
@keyframes hx-blob{0%{transform:translate3d(0,0,0) scale(1)}100%{transform:translate3d(60px,-40px,0) scale(1.18)}}
@keyframes hx-marquee{from{transform:translateX(0)}to{transform:translateX(50%)}}
@keyframes hx-draw{to{stroke-dashoffset:0}}
@keyframes hx-ping{0%{transform:scale(1);opacity:.7}100%{transform:scale(2.6);opacity:0}}
.hx-up{opacity:0;animation:hx-up .9s cubic-bezier(.2,.7,.2,1) forwards}
.hx-float{animation:hx-float 6s ease-in-out infinite}
.hx-blob{animation:hx-blob 16s ease-in-out infinite alternate}
.hx-marquee{animation:hx-marquee 38s linear infinite}
.hx-draw{stroke-dasharray:1;stroke-dashoffset:1;animation:hx-draw 1.4s .9s ease-out forwards}
.hx-ping{animation:hx-ping 2s ease-out infinite}
@media (prefers-reduced-motion:reduce){
  .hx-up{opacity:1;animation:none}
  .hx-float,.hx-blob,.hx-marquee,.hx-ping{animation:none}
  .hx-draw{animation:none;stroke-dashoffset:0}
}
`;

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/* Floating "sticker" chip used around the logo card */
function Chip({ pos, rotate, delay, tone, children }) {
  const tones = {
    light: "bg-parchment text-oxblood shadow-[0_12px_30px_-8px_rgba(0,0,0,.5)]",
    glass: "bg-white/10 text-parchment border border-white/25 backdrop-blur-md",
    red: "bg-gradient-to-l from-gild to-gild-bright text-white shadow-[0_12px_34px_-8px_rgba(232,85,111,.7)]",
  };
  return (
    <div
      className={`absolute ${pos} transition-transform duration-300 ease-out`}
      style={{ transform: "translate3d(calc(var(--px) * 1.8), calc(var(--py) * 1.8), 0)" }}
    >
      <div
        className={`hx-float rounded-full px-3 py-1.5 text-[11px] font-bold whitespace-nowrap sm:px-4 sm:py-2 sm:text-xs lg:px-5 lg:py-2.5 lg:text-sm ${tones[tone]}`}
        style={{ "--r": rotate, animationDelay: delay }}
      >
        {children}
      </div>
    </div>
  );
}

export default function HeroSection() {
  const ref = useRef(null);

  const scrollTo = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  /* cursor spotlight + soft parallax (no re-renders) */
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
    el.style.setProperty("--px", `${(0.5 - x) * 26}px`);
    el.style.setProperty("--py", `${(0.5 - y) * 26}px`);
  };

  const up = (ms) => ({ animationDelay: `${ms}ms` });

  return (
    <section
      id="home"
      ref={ref}
      onMouseMove={onMove}
      dir="rtl"
      lang="ar"
      style={{ "--mx": "30%", "--my": "35%", "--px": "0px", "--py": "0px" }}
      className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden bg-ink"
    >
      <style>{CSS}</style>

      {/* ---------- background ---------- */}
      <div className="absolute inset-0 bg-gradient-to-br from-ink via-oxblood-deep to-ink" />
      <div className="hx-blob absolute -top-40 -right-32 w-[38rem] h-[38rem] rounded-full bg-gild/40 blur-[110px]" />
      <div className="hx-blob absolute top-1/3 -left-48 w-[34rem] h-[34rem] rounded-full bg-silver/25 blur-[120px]" style={{ animationDelay: "-6s" }} />
      <div className="hx-blob absolute -bottom-52 right-1/3 w-[30rem] h-[30rem] rounded-full bg-gild-bright/20 blur-[120px]" style={{ animationDelay: "-11s" }} />

      {/* lattice pattern + dark fade + burgundy orb (from the original hero) */}
      <div className="absolute inset-0 lattice opacity-75 lg:opacity-100 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20 pointer-events-none" />
      <div className="absolute -left-24 top-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-oxblood/30 blur-[110px] pointer-events-none" />

      {/* cursor spotlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(520px circle at var(--mx) var(--my), rgba(232,85,111,.16), transparent 62%)" }}
      />
      {/* grain */}
      <div className="absolute inset-0 pointer-events-none opacity-[.13] mix-blend-overlay" style={{ backgroundImage: NOISE }} />

      {/* faint logo behind the text on small screens */}
      <img
        src="/logo-mark-grey.svg"
        alt=""
        aria-hidden="true"
        className="absolute -left-8 top-28 w-40 opacity-[.06] pointer-events-none lg:-left-16 lg:top-24 lg:w-72 lg:opacity-[.12]"
      />

      {/* ---------- content ---------- */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-10 pt-32 pb-40">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          {/* text (right side in RTL) */}
          <div className="lg:col-span-7 text-right">
            <div
              className="hx-up inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/[.07] backdrop-blur-md pl-5 pr-4 py-2 mb-8"
              style={up(50)}
            >
              <span className="relative flex w-2.5 h-2.5">
                <span className="hx-ping absolute inset-0 rounded-full bg-gild-bright" />
                <span className="relative w-2.5 h-2.5 rounded-full bg-gild-bright" />
              </span>
              <span className="text-stone text-sm">وكالة إعلانية سعودية — تبوك</span>
            </div>

            <h1 className="hx-up" style={up(150)}>
              <span className="block font-serif font-bold text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] leading-[1.15] text-parchment">
                {BRAND.name}
              </span>
              <span className="block text-xl sm:text-2xl md:text-3xl font-normal text-silver-light/80 mt-1 tracking-wide">
                للدعاية والإعلان
              </span>
            </h1>

            {/* tagline with gradient + hand-drawn underline */}
            <div className="hx-up relative inline-block mt-7" style={up(300)}>
              <p
                className="font-serif font-bold text-3xl md:text-5xl leading-[1.5] pb-2"
                style={{
                  backgroundImage: "linear-gradient(90deg,#e8556f 0%,#ffffff 55%,#d3cdcf 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                }}
              >
                {BRAND.tagline}
              </p>
              <svg viewBox="0 0 200 20" preserveAspectRatio="none" className="absolute -bottom-1 right-0 w-full h-3" aria-hidden="true">
                <path
                  className="hx-draw"
                  pathLength="1"
                  d="M2 12 C 28 2, 52 20, 82 9 S 140 2, 170 11 S 192 8, 198 6"
                  fill="none"
                  stroke="#e8556f"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <p className="hx-up text-stone/90 text-base md:text-lg leading-8 max-w-xl mt-8" style={up(450)}>
              {INTRO.lead}
            </p>

            <div className="hx-up flex flex-wrap gap-4 mt-10 justify-start" style={up(600)}>
              <a
                href="#services"
                onClick={scrollTo("services")}
                className="group inline-flex items-center gap-3 bg-parchment text-oxblood px-8 py-3.5 text-sm font-bold rounded-[20px] shadow-[0_14px_40px_-10px_rgba(232,85,111,.75)] hover:bg-silver-light hover:-translate-y-0.5 transition-all"
              >
                خدماتنا
                <IconChevron className="w-4 h-4 rotate-180 transition-transform group-hover:-translate-x-1" />
              </a>
              <a
                href="#contact"
                onClick={scrollTo("contact")}
                className="border border-parchment/40 bg-white/[.04] backdrop-blur-sm text-parchment px-8 py-3.5 text-sm rounded-[20px] hover:bg-parchment/10 hover:-translate-y-0.5 transition-all"
              >
                تواصل معنا
              </a>
            </div>

            <ul className="hx-up flex flex-wrap gap-2.5 mt-10" style={up(750)}>
              {VALUES.map((v) => (
                <li
                  key={v.title}
                  className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[.05] px-4 py-1.5 text-xs text-stone"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gild-bright" />
                  {v.title}
                </li>
              ))}
            </ul>
          </div>

          {/* logo scene (left side in RTL) */}
          <div className="hx-up relative h-[390px] sm:h-[430px] md:h-[460px] lg:col-span-5 lg:h-[560px]" style={up(400)}>
            {/* polaroid stack */}
            <div
              className="absolute inset-x-0 top-2 flex justify-end pr-5 transition-transform duration-300 ease-out sm:top-3 sm:justify-center sm:pr-0 lg:top-14"
              style={{ transform: "translate3d(var(--px), var(--py), 0)" }}
            >
              <div className="hx-float relative w-[min(56vw,310px)] sm:w-[min(55vw,310px)] lg:w-[310px]" style={{ "--r": "0deg", animationDuration: "7s" }}>
                {/* back polaroid: brand card */}
                <div className="absolute inset-0 translate-x-6 translate-y-5 rotate-[8deg] bg-[#f4f2ef] p-2.5 pb-0 shadow-[0_24px_50px_-20px_rgba(0,0,0,.7)] sm:translate-x-10 sm:p-3 lg:translate-x-12 lg:translate-y-7 lg:p-3.5">
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-oxblood-soft via-oxblood to-oxblood-deep">
                    <div className="absolute top-0 left-0 w-20 h-20 bg-silver/60" style={{ clipPath: "polygon(0 0,100% 0,0 100%)" }} />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,.2),transparent_60%)]" />
                    <img
                      src="/logo-new.png"
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 m-auto w-[84%] drop-shadow-[0_10px_18px_rgba(0,0,0,.4)]"
                    />
                  </div>
                </div>

                {/* front polaroid: photo */}
                <div className="relative -rotate-[4deg] bg-[#fbfaf8] p-2.5 pb-0 shadow-[0_34px_70px_-20px_rgba(0,0,0,.8)] transition-transform duration-500 hover:-rotate-1 hover:scale-[1.02] sm:p-3 lg:p-3.5">
                  {/* tape */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rotate-[3deg] w-16 h-5 bg-silver-light/80 shadow-sm z-10 sm:-top-4 sm:w-20 sm:h-6 lg:w-24 lg:h-7" style={{ clipPath: "polygon(4% 0,96% 0,100% 20%,96% 40%,100% 60%,96% 80%,100% 100%,0 100%,4% 80%,0 60%,4% 40%,0 20%)" }} />

                  <div className="relative aspect-square overflow-hidden bg-charcoal">
                    <img
                      src="/download1.png"
                      alt="من أعمال باب أجياد"
                      className="absolute inset-0 w-full h-full object-cover saturate-[1.1] contrast-[1.05]"
                    />
                    {/* instant-film look */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-gild/25 via-transparent to-white/10 mix-blend-soft-light" />
                    <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,.45)]" />
                    <img
                      src="/download1.png"
                      alt=""
                      aria-hidden="true"
                      className="absolute bottom-3 right-3 w-11 opacity-90 brightness-150 drop-shadow"
                    />
                  </div>

                  <div className="h-[72px] flex flex-col items-center justify-center text-center sm:h-[82px] lg:h-[92px]">
                    <p className="font-serif font-bold text-xl leading-none text-oxblood lg:text-[1.7rem]">بوابتك للإبداع</p>
                    <p className="text-[9px] text-silver mt-2 tracking-wide sm:text-[10px] lg:text-[11px]">باب أجياد ✦ تبوك</p>
                  </div>
                </div>
              </div>
            </div>

            {/* stickers */}
            <Chip pos="top-1 right-2 sm:top-0 sm:right-4 lg:top-0 lg:right-[-0.75rem]" rotate="-7deg" delay="0s" tone="light">تصميم ✦</Chip>
            <Chip pos="top-[38%] right-0 sm:left-4 sm:right-auto lg:left-[-0.5rem]" rotate="6deg" delay="-1.5s" tone="glass">طباعة</Chip>
            <Chip pos="bottom-28 right-1 sm:right-4 lg:right-0" rotate="5deg" delay="-3s" tone="red">حروف بارزة</Chip>
            <Chip pos="bottom-2 right-0 sm:bottom-2 sm:left-8 sm:right-auto lg:left-8" rotate="-4deg" delay="-4.5s" tone="glass">ويب وسوشيال</Chip>

            {/* mini glass note */}
            <div
              className="hidden lg:block absolute bottom-16 left-0 transition-transform duration-300 ease-out"
              style={{ transform: "translate3d(calc(var(--px) * 1.3), calc(var(--py) * 1.3), 0)" }}
            >
              <div className="flex items-center gap-3 rounded-2xl border border-white/25 bg-ink/60 backdrop-blur-md px-4 py-3 shadow-xl">
                <span className="w-8 h-8 rounded-full bg-parchment text-oxblood flex items-center justify-center">
                  <IconCheck className="w-4 h-4" />
                </span>
               
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- marquee ---------- */}
      <div className="absolute bottom-0 inset-x-0 z-10 border-t border-white/10 bg-black/20 backdrop-blur-md overflow-hidden">
        <div className="hx-marquee flex w-max py-4">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center" aria-hidden={k === 1}>
              {MARQUEE.map((t) => (
                <span key={t + k} className="flex items-center text-parchment/80 text-sm md:text-base whitespace-nowrap">
                  <span className="px-6 md:px-9">{t}</span>
                  <span className="text-gild-bright">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
