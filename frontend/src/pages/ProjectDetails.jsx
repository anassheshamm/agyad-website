import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProjectById, resolveImageUrl } from "../services/api.js";
import { IconChevron, IconShare, IconSend, IconCheck } from "../components/icons.jsx";

function InfoTable({ rows }) {
  return (
    <div className="divide-y divide-gray-100">
      {rows.map((r, i) => (
        <div key={i} className="flex items-start justify-between gap-6 py-3 text-sm">
          <span className="text-gray-500 shrink-0">{r.label}</span>
          <span className="text-gray-900 font-medium text-right">{r.value}</span>
        </div>
      ))}
    </div>
  );
}

function NotFound() {
  return (
    <div dir="rtl" lang="ar" className="min-h-screen flex items-center justify-center bg-gray-50 text-center px-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">لم يتم العثور على المشروع</h1>
        <p className="text-gray-500 mb-8">قد يكون الرابط غير صحيح أو أن المشروع لم يعد متاحاً.</p>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 bg-red-700 text-white text-sm font-medium px-6 py-3 rounded-lg hover:bg-red-800 transition-colors"
        >
          العودة لكل المشاريع
        </Link>
      </div>
    </div>
  );
}

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      const data = await fetchProjectById(id);
      setProject(data);
      setLoading(false);
    };
    loadProject();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-700">جاري التحميل...</div>;
  }

  if (!project) return <NotFound />;

  // Map backend clientInfo to the table rows format
  const clientRows = project.clientInfo ? [
    { label: "العميل", value: project.clientInfo.client },
    { label: "مدير العلامة", value: project.clientInfo.brandManager },
    { label: "القطاع", value: project.clientInfo.category },
    { label: "المنطقة", value: project.clientInfo.region },
  ].filter(r => r.value) : [];

  const overviewRows = project.clientInfo ? [
    { label: "تاريخ الإطلاق", value: project.clientInfo.launchWindow },
    { label: "المدة الزمنية", value: project.clientInfo.duration },
    { label: "القنوات", value: project.clientInfo.channels },
    { label: "الهدف الرئيسي", value: project.clientInfo.mainObjective },
  ].filter(r => r.value) : [];
  const galleryImages = [...new Set([project.coverImage, ...(project.images || [])].filter(Boolean))];

  return (
    <div dir="rtl" lang="ar" className="bg-gray-50 min-h-screen font-sans text-gray-900">
      {/* Top bar: breadcrumb + actions */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-4 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-gray-500 font-medium">
            <Link to="/projects" className="hover:text-red-700 transition-colors">المشاريع</Link>
            <span className="mx-3 text-gray-300">/</span>
            <span className="text-gray-900">{project.title}</span>
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/projects" className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium px-5 py-2.5 rounded-lg hover:border-red-300 hover:text-red-700 hover:bg-gray-50 transition-colors">
              <IconChevron className="w-4 h-4 rotate-180" /> العودة للمشاريع
            </Link>
            <button onClick={() => (navigator.share ? navigator.share({ title: project.title, url: window.location.href }) : navigator.clipboard?.writeText(window.location.href))} className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium px-5 py-2.5 rounded-lg hover:border-red-300 hover:text-red-700 hover:bg-gray-50 transition-colors">
              <IconShare className="w-4 h-4" /> مشاركة
            </button>
            <a href="#contact-box" className="inline-flex items-center gap-2 bg-red-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-red-800 transition-colors shadow-sm">
              طلب استشارة
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-2 tracking-tight">
          {project.title}
        </h1>
        {project.subtitle && (
          <p className="text-lg text-gray-500 mb-10">{project.subtitle}</p>
        )}

        {/* Gallery Section */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 mb-8 shadow-sm">
          <h2 className="text-sm font-semibold text-red-700 mb-1.5 uppercase tracking-wide">
            معرض الوسائط
          </h2>
          {project.videoPlaceholder && (
            <p className="text-gray-500 text-sm mb-6 max-w-2xl leading-relaxed">
              {project.videoPlaceholder}
            </p>
          )}

          {project.videoUrl && (
            <video src={project.videoUrl} controls className="w-full rounded-xl mb-6" />
          )}

          {galleryImages.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages.map((img, i) => (
                <div key={i} className="aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                  <img src={resolveImageUrl(img)} alt={`${project.title} - ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Client Info + Overview */}
            <div className="grid sm:grid-cols-2 gap-6">
              {clientRows.length > 0 && (
<section className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
                <h3 className="text-sm font-semibold text-red-700 mb-4 uppercase tracking-wide">
                  تفاصيل العميل
                </h3>
                <InfoTable rows={clientRows} />
              </section>
)}

              {overviewRows.length > 0 && (
<section className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
                <h3 className="text-sm font-semibold text-red-700 mb-4 uppercase tracking-wide">
                  نظرة عامة
                </h3>
                <InfoTable rows={overviewRows} />
              </section>
)}
            </div>

            {/* Story & Overview Text */}
            <section className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
              <h3 className="text-sm font-semibold text-red-700 mb-4 uppercase tracking-wide">
                قصة المشروع
              </h3>
              {project.overview && (
                <p className="text-gray-600 text-sm leading-loose whitespace-pre-line mb-6">
                  {project.overview}
                </p>
              )}
              {project.story && (
                <p className="text-gray-600 text-sm leading-loose whitespace-pre-line">
                  {project.story}
                </p>
              )}
            </section>

            {/* Achievements / Results */}
            {project.results && project.results.length > 0 && (
              <section className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
                <h3 className="text-sm font-semibold text-red-700 mb-5 uppercase tracking-wide">
                  النتائج والإنجازات
                </h3>
                <ul className="space-y-4">
                  {project.results.map((a, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-red-100 transition-colors">
                      <div className="bg-white p-1 rounded-full border border-red-200 shrink-0 shadow-sm mt-0.5">
                        <IconCheck className="w-3.5 h-3.5 text-red-700" />
                      </div>
                      <span className="leading-relaxed font-medium">{a}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Deliverables List */}
            {project.deliverables && project.deliverables.length > 0 && (
              <section className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
                <h3 className="text-sm font-semibold text-red-700 mb-5 uppercase tracking-wide">
                  المخرجات والخدمات
                </h3>
                <ul className="space-y-3">
                  {project.deliverables.map((d, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                      <IconChevron className="w-4 h-4 text-red-600 rotate-180 shrink-0" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Contact Box */}
            <section id="contact-box" className="bg-red-700 text-white rounded-2xl p-6 md:p-8 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full blur-3xl -translate-y-10 translate-x-10 pointer-events-none"></div>

              <p className="text-xs text-red-200 font-semibold tracking-wider uppercase mb-2">التواصل</p>
              <h3 className="text-2xl font-medium mb-3">هل ترغب في مشروع مشابه؟</h3>
              <p className="text-sm text-red-100 leading-relaxed mb-6">تواصل معنا لمناقشة التفاصيل وبناء نجاحك القادم.</p>

              <div className="relative z-10">
                <a
                  href={`https://wa.me/966595014299?text=${encodeURIComponent(`السلام عليكم، أرغب في الاستفسار عن تنفيذ مشروع مشابه لـ «${project.title}». هل يمكنكم تزويدي بالتفاصيل؟`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-white text-red-800 py-3.5 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 mt-2"
                >
                  تواصل عبر واتساب <IconSend className="w-4 h-4 rtl:rotate-180" />
                </a>
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}
