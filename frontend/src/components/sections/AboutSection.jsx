
import React from "react";
import { IconEye, IconTarget, IconCheck } from "../icons.jsx";
import { INTRO, VISION, MISSION, VALUES, VALUES_INTRO, GOALS } from "../../data/about.js";

const POINTS = [
  { icon: IconEye, title: "رؤيتنا", body: VISION },
  { icon: IconTarget, title: "رسالتنا", body: MISSION },
];

export default function AboutSection() {
  return (
    <div dir="rtl" lang="ar">
      <section id="about" className="relative bg-parchment text-charcoal py-24 md:py-32 overflow-hidden">
        
        <div className="relative max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-12 gap-10 md:gap-14 items-start">
          {/* صورة من نحن */}
          <div className="md:col-span-6">
            <img
              src="/images/projects/about-uss.jpeg"
              alt="فريق باب أجياد أثناء العمل"
              className="w-full h-auto md:h-[440px] object-cover rounded-[2rem]"
            />
          </div>

          {/* مقدمة من نحن */}
          <div className="md:col-span-6">
            <p className="text-oxblood text-sm mb-3">{INTRO.eyebrow}</p>
            <h2 className="font-serif font-bold text-4xl md:text-5xl leading-tight text-oxblood">
              من نحن
            </h2>
            <div className="hairline w-24 my-7" />
            <p className="text-charcoal font-medium leading-8 mb-5">{INTRO.lead}</p>
            {INTRO.paragraphs.map((t, i) => (
              <p key={i} className="text-charcoal/70 leading-8 mb-5">{t}</p>
            ))}
          </div>

          {/* الرؤية والرسالة */}
          <div className="md:col-span-12">
            <div className="border-t border-charcoal/15">
              {POINTS.map((pt, i) => (
                <div key={i} className="flex items-start gap-6 py-7 border-b border-charcoal/15">
                  <span className="w-8 shrink-0 text-center">
                    <pt.icon className="w-7 h-7 text-oxblood mx-auto" />
                  </span>
                  <div>
                    <h3 className="font-serif font-bold text-xl mb-1.5 text-oxblood">{pt.title}</h3>
                    <p className="text-charcoal/70 text-sm leading-7">{pt.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* القيم */}
          <div className="md:col-span-12 mt-6">
            <h3 className="font-serif font-bold text-3xl text-oxblood">قيمنا</h3>
            <p className="text-silver text-sm mt-2 mb-8">{VALUES_INTRO}</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {VALUES.map((v) => (
                <div key={v.title} className="bg-parchment-soft border-r-4 border-oxblood p-6 cut-corner">
                  <IconCheck className="w-6 h-6 text-oxblood mb-3" />
                  <h4 className="font-serif font-bold text-xl mb-2">{v.title}</h4>
                  <p className="text-charcoal/70 text-sm leading-7">{v.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* الأهداف */}
          <div className="md:col-span-12">
            <h3 className="font-serif font-bold text-3xl text-oxblood mb-8">أهدافنا</h3>
            <ol className="grid md:grid-cols-2 gap-x-12">
              {GOALS.map((g, i) => (
                <li key={i} className="flex items-start gap-4 py-5 border-b border-charcoal/15">
                  <span className="font-serif font-bold text-2xl text-silver w-8 shrink-0">
                    {String(i + 1).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d])}
                  </span>
                  <span className="text-charcoal/80 leading-7">{g}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
}
