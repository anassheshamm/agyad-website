import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { fetchProjectById, createProject, updateProject, uploadProjectImages, resolveImageUrl } from "../../services/api";
import { IconChevron, IconCheck } from "../../components/icons.jsx";

const CATEGORIES = [
  "إعلانات", "تصميم جرافيكي", "هوية بصرية", "تصوير", "فيديو", "سوشيال ميديا",
  "طباعة خارجية", "طباعة داخلية", "شاشات رقمية", "تغليف مركبات", "فعاليات ومعارض",
];
const ICONS = [
  ["billboard", "لوحة"], ["van", "مركبة"], ["storefront", "متجر"], ["palette", "ألوان"],
  ["printer", "طابعة"], ["star", "نجمة"], ["camera", "كاميرا"],
];
const EMPTY_CLIENT = {
  client: "", brandManager: "", category: "", region: "",
  launchWindow: "", duration: "", channels: "", mainObjective: "",
};
const EMPTY = {
  title: "", subtitle: "", category: "", year: new Date().getFullYear(),
  isFeatured: false, description: "", icon: "billboard", videoPlaceholder: "", videoUrl: "",
  overview: "", story: "", coverImage: "", images: [], results: [], deliverables: [], clientInfo: EMPTY_CLIENT,
};

// Looks like plain text until hovered/focused — so the page reads like the public one.
const ghost =
  "w-full bg-transparent border border-dashed border-transparent hover:border-gray-300 focus:border-red-600 focus:bg-white rounded-lg px-2 -mx-2 outline-none transition-colors placeholder:text-gray-300";

const Card = ({ title, hint, children, className = "" }) => (
  <section className={`bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm ${className}`}>
    <h3 className="text-sm font-semibold text-red-700 mb-1">{title}</h3>
    {hint && <p className="text-xs text-gray-400 mb-4">{hint}</p>}
    {!hint && <div className="mb-3" />}
    {children}
  </section>
);

function InfoRows({ rows, values, onChange }) {
  return (
    <div className="divide-y divide-gray-100">
      {rows.map(([key, label]) => (
        <label key={key} className="flex items-center justify-between gap-4 py-2.5 text-sm">
          <span className="text-gray-500 shrink-0">{label}</span>
          <input
            value={values[key] || ""}
            onChange={(e) => onChange(key, e.target.value)}
            placeholder="اضغط للكتابة"
            className={`${ghost} text-gray-900 font-medium text-left`}
            dir="auto"
          />
        </label>
      ))}
    </div>
  );
}

function ListEditor({ items, onChange, placeholder, addLabel, check }) {
  const set = (i, v) => onChange(items.map((x, idx) => (idx === i ? v : x)));
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-3 group">
          {check ? (
            <div className="bg-white p-1 rounded-full border border-red-200 shrink-0">
              <IconCheck className="w-3.5 h-3.5 text-red-700" />
            </div>
          ) : (
            <IconChevron className="w-4 h-4 text-red-600 rotate-180 shrink-0" />
          )}
          <input value={item} onChange={(e) => set(i, e.target.value)} placeholder={placeholder} className={`${ghost} text-sm font-medium text-gray-700`} />
          <button type="button" onClick={() => remove(i)} aria-label="حذف" className="text-gray-300 hover:text-red-700 text-lg leading-none px-1 md:opacity-0 group-hover:opacity-100 focus:opacity-100 transition">×</button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, ""])} className="text-sm text-red-700 hover:text-red-800 font-medium">
        + {addLabel}
      </button>
    </div>
  );
}

export default function AdminProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [toast, setToast] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [coverPreview, setCoverPreview] = useState("");
  const previewUrls = useRef(new Set());

  const notify = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const update = useCallback((patch) => {
    setForm((f) => ({ ...f, ...patch }));
    setDirty(true);
  }, []);
  const updateClient = (key, value) => update({ clientInfo: { ...form.clientInfo, [key]: value } });

  useEffect(() => () => previewUrls.current.forEach((preview) => URL.revokeObjectURL(preview)), []);

  useEffect(() => {
    if (!isEditing) return;
    (async () => {
      const d = await fetchProjectById(id);
      if (d) {
        const projectData = { ...d };
        delete projectData.slug;
        setForm({
          ...EMPTY, ...projectData,
          year: d.year || EMPTY.year,
          isFeatured: Boolean(d.isFeatured),
          icon: d.icon || "billboard",
          coverImage: d.coverImage || "",
          images: d.images || [], results: d.results || [], deliverables: d.deliverables || [],
          clientInfo: { ...EMPTY_CLIENT, ...(d.clientInfo || {}) },
        });
      } else {
        notify("error", "لم يتم العثور على المشروع");
      }
      setLoading(false);
    })();
  }, [id, isEditing]);

  // Warn before leaving with unsaved edits
  useEffect(() => {
    const warn = (e) => { if (dirty) { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const onTitle = (title) => update({ title });

  const allowedImage = (file) => /image\/(jpeg|png|webp)/.test(file.type) && file.size <= 2 * 1024 * 1024;
  const makePreview = (file) => {
    const preview = URL.createObjectURL(file);
    previewUrls.current.add(preview);
    return preview;
  };
  const removePreview = (preview) => {
    if (preview) {
      URL.revokeObjectURL(preview);
      previewUrls.current.delete(preview);
    }
  };
  const projectImageCount = (coverPending = coverFile, galleryPending = imageFiles) => new Set([
    ...(coverPending ? [] : [form.coverImage]), ...form.images,
    ...(coverPending ? ["pending-cover"] : []), ...galleryPending.map((_file, i) => `pending-image-${i}`),
  ].filter(Boolean)).size;

  const selectCover = (file) => {
    if (!file) return;
    if (!allowedImage(file)) return notify("error", "اختر صورة JPG أو PNG أو WebP بحجم لا يتجاوز 2 MB");
    if (projectImageCount(file, imageFiles) > 10) return notify("error", "الحد الأقصى 10 صور للمشروع، بما فيها صورة الغلاف");
    removePreview(coverPreview);
    setCoverFile(file);
    setCoverPreview(makePreview(file));
    update({});
  };

  const selectImages = (files) => {
    const selected = Array.from(files || []);
    if (selected.some((file) => !allowedImage(file))) return notify("error", "اختر صور JPG أو PNG أو WebP بحجم لا يتجاوز 2 MB لكل صورة");
    const next = [...imageFiles, ...selected];
    if (projectImageCount(coverFile, next) > 10) return notify("error", "الحد الأقصى 10 صور للمشروع، بما فيها صورة الغلاف");
    setImageFiles([...imageFiles, ...selected.map((file) => ({ file, preview: makePreview(file) }))]);
    update({});
  };

  const save = async (e) => {
    e?.preventDefault();
    if (!form.title.trim()) return notify("error", "اكتب عنوان المشروع أولاً");
    if (!form.category) return notify("error", "اختر تصنيف المشروع من الإعدادات");
    if (projectImageCount() > 10) return notify("error", "الحد الأقصى 10 صور للمشروع، بما فيها صورة الغلاف");
    setSaving(true);
    try {
      let coverImage = form.coverImage;
      let addedImages = [];
      const pendingFiles = [...(coverFile ? [coverFile] : []), ...imageFiles.map(({ file }) => file)];
      if (pendingFiles.length) {
        const uploaded = await uploadProjectImages(pendingFiles);
        if (!uploaded.success) return notify("error", uploaded.message || "تعذر رفع الصور");
        const urls = uploaded.data?.images;
        if (!Array.isArray(urls) || urls.length !== pendingFiles.length || urls.some((url) => typeof url !== "string" || !url)) {
          return notify("error", "استجاب الخادم بروابط صور غير مكتملة، حاول رفع الصور مرة أخرى");
        }
        if (coverFile) coverImage = urls.shift();
        addedImages = urls;
      }
      const clean = (arr) => arr.map((x) => x.trim()).filter(Boolean);
      const images = [...new Set([...clean(form.images), ...addedImages])];
      if (new Set([coverImage, ...images].filter(Boolean)).size > 10) return notify("error", "الحد الأقصى 10 صور للمشروع، بما فيها صورة الغلاف");
      const payload = {
        ...form, coverImage,
        images, results: clean(form.results), deliverables: clean(form.deliverables),
      };
      const res = isEditing ? await updateProject(id, payload) : await createProject(payload);
      if (res.success) {
        setDirty(false);
        notify("success", "تم حفظ المشروع");
        setTimeout(() => navigate("/admin/projects"), 700);
      } else {
        notify("error", res.message || "تعذر حفظ المشروع");
      }
    } catch (err) {
      console.error(err);
      notify("error", "حدث خطأ أثناء الحفظ، حاول مرة أخرى");
    } finally {
      setSaving(false);
    }
  };

  const leave = (e) => {
    if (dirty && !window.confirm("لديك تعديلات غير محفوظة. هل تريد المغادرة؟")) e.preventDefault();
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-700">جاري التحميل...</div>;
  }

  return (
    <form onSubmit={save} dir="rtl" lang="ar" className="bg-gray-50 min-h-screen font-sans text-gray-900">
      {/* Top bar — same position as the public page */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-3 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-gray-500 font-medium">
            <Link to="/admin/projects" onClick={leave} className="hover:text-red-700 transition-colors">إدارة المشاريع</Link>
            <span className="mx-3 text-gray-300">/</span>
            <span className="text-gray-900">{form.title || (isEditing ? "تعديل المشروع" : "مشروع جديد")}</span>
          </p>
          <div className="flex items-center gap-3">
            <span className={`text-xs ${dirty ? "text-amber-600" : "text-gray-400"}`}>
              {dirty ? "● تعديلات غير محفوظة" : "كل شيء محفوظ"}
            </span>
            <Link to="/admin/projects" onClick={leave} className="bg-white border border-gray-200 text-gray-700 text-sm font-medium px-5 py-2.5 rounded-lg hover:border-red-300 hover:text-red-700 transition-colors">
              إلغاء
            </Link>
            <button type="submit" disabled={saving} className="bg-red-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-red-800 disabled:opacity-60 transition-colors shadow-sm">
              {saving ? "جاري الحفظ..." : "حفظ المشروع"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-10">
        <p className="text-xs text-gray-400 mb-4">اضغط على أي نص في الصفحة لتعديله مباشرة. الحقول الفارغة تظهر بخط منقط عند المرور عليها.</p>

        <input
          value={form.title}
          onChange={(e) => onTitle(e.target.value)}
          placeholder="عنوان المشروع"
          className={`${ghost} text-3xl md:text-4xl font-semibold tracking-tight mb-2 py-1`}
        />
        <input
          value={form.subtitle}
          onChange={(e) => update({ subtitle: e.target.value })}
          placeholder="العنوان الفرعي (اختياري)"
          className={`${ghost} text-lg text-gray-500 mb-10 py-1`}
        />

        {/* Media */}
        <Card title="معرض الوسائط" className="mb-8">
          <input
            value={form.videoPlaceholder}
            onChange={(e) => update({ videoPlaceholder: e.target.value })}
            placeholder="نص قصير يظهر أعلى المعرض (اختياري)"
            className={`${ghost} text-sm text-gray-500 mb-4`}
          />
          <label className="block text-xs text-gray-500 mb-1">رابط الفيديو (اختياري)</label>
          <input value={form.videoUrl} onChange={(e) => update({ videoUrl: e.target.value })} placeholder="https://.../video.mp4" dir="ltr" className={`${ghost} text-sm mb-2`} />
          {form.videoUrl && <video src={form.videoUrl} controls className="w-full rounded-xl mb-6" />}

          <div className="mb-5">
            <p className="text-xs text-gray-500 mb-2">صورة الغلاف</p>
            <div className="flex flex-wrap items-start gap-4">
              {(coverPreview || form.coverImage) && <div className="relative w-48 aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                <img src={coverPreview || resolveImageUrl(form.coverImage)} alt="معاينة الغلاف" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.opacity = 0.15)} />
                <button type="button" onClick={() => {
                  removePreview(coverPreview);
                  setCoverPreview("");
                  setCoverFile(null);
                  if (!coverFile) update({ coverImage: "" });
                }} aria-label="حذف صورة الغلاف" className="absolute top-2 left-2 w-7 h-7 rounded-full bg-white/90 text-gray-600 hover:text-red-700 shadow">×</button>
              </div>}
              <label className="w-48 aspect-[4/3] rounded-xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-red-400 hover:text-red-700 transition-colors flex flex-col items-center justify-center gap-1 text-sm cursor-pointer">
                <span className="text-2xl leading-none">+</span> اختيار صورة الغلاف
                <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => { selectCover(e.target.files?.[0]); e.target.value = ""; }} />
              </label>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4 mb-3">صور إضافية ({new Set([form.coverImage, ...form.images, ...(coverFile ? ["pending-cover"] : []), ...imageFiles.map((_file, i) => `pending-${i}`)].filter(Boolean)).size}/10)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {form.images.map((img, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                <div className="relative aspect-[4/3] bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                  {img ? <img src={resolveImageUrl(img)} alt="" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.opacity = 0.15)} /> : "ألصق رابط الصورة بالأسفل"}
                  <button type="button" onClick={() => update({ images: form.images.filter((_, x) => x !== i) })} aria-label="حذف الصورة" className="absolute top-2 left-2 w-7 h-7 rounded-full bg-white/90 text-gray-600 hover:text-red-700 shadow">×</button>
                </div>
                <input
                  value={img}
                  onChange={(e) => update({ images: form.images.map((x, idx) => (idx === i ? e.target.value : x)) })}
                  placeholder="/images/photo.jpg"
                  dir="ltr"
                  className="w-full bg-white px-3 py-2 text-xs outline-none border-t border-gray-100 focus:bg-red-50/40"
                />
              </div>
            ))}
            {imageFiles.map(({ file, preview }, i) => <div key={`${file.name}-${i}`} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
              <img src={preview} alt={file.name} className="w-full h-full object-cover" />
              <button type="button" onClick={() => { removePreview(preview); setImageFiles(imageFiles.filter((_item, index) => index !== i)); update({}); }} aria-label="حذف الصورة المحددة" className="absolute top-2 left-2 w-7 h-7 rounded-full bg-white/90 text-gray-600 hover:text-red-700 shadow">×</button>
            </div>)}
            <label className="aspect-[4/3] rounded-xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-red-400 hover:text-red-700 transition-colors flex flex-col items-center justify-center gap-1 text-sm cursor-pointer">
              <span className="text-2xl leading-none">+</span> اختيار صور إضافية
              <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only" onChange={(e) => { selectImages(e.target.files); e.target.value = ""; }} />
            </label>
          </div>
        </Card>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="grid sm:grid-cols-2 gap-6">
              <Card title="تفاصيل العميل">
                <InfoRows
                  values={form.clientInfo} onChange={updateClient}
                  rows={[["client", "العميل"], ["brandManager", "مدير العلامة"], ["category", "القطاع"], ["region", "المنطقة"]]}
                />
              </Card>
              <Card title="نظرة عامة">
                <InfoRows
                  values={form.clientInfo} onChange={updateClient}
                  rows={[["launchWindow", "تاريخ الإطلاق"], ["duration", "المدة الزمنية"], ["channels", "القنوات"], ["mainObjective", "الهدف الرئيسي"]]}
                />
              </Card>
            </div>

            <Card title="قصة المشروع">
              <textarea value={form.overview} onChange={(e) => update({ overview: e.target.value })} rows={4} placeholder="نظرة عامة على المشروع..." className={`${ghost} text-sm text-gray-600 leading-loose mb-4 resize-y`} />
              <textarea value={form.story} onChange={(e) => update({ story: e.target.value })} rows={5} placeholder="اكتب قصة المشروع: التحدي، الفكرة، التنفيذ..." className={`${ghost} text-sm text-gray-600 leading-loose resize-y`} />
            </Card>

            <Card title="النتائج والإنجازات">
              <ListEditor check items={form.results} onChange={(results) => update({ results })} placeholder="مثال: زيادة المبيعات بنسبة ٤٠٪" addLabel="إضافة نتيجة" />
            </Card>
          </div>

          <aside className="lg:col-span-4 space-y-8">
            {/* Project settings: things the visitor sees on cards / URLs, not on the detail page body */}
            <section className="bg-white border-2 border-dashed border-red-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-semibold text-red-700">إعدادات المشروع</h3>

              <label className="block text-xs text-gray-500">
                التصنيف *
                <select value={form.category} onChange={(e) => update({ category: e.target.value })} className="mt-1 w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none focus:border-red-600">
                  <option value="" disabled>اختر التصنيف...</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block text-xs text-gray-500">
                  السنة
                  <input type="number" value={form.year} onChange={(e) => update({ year: e.target.value })} className="mt-1 w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none focus:border-red-600" />
                </label>
                <label className="block text-xs text-gray-500">
                  الأيقونة
                  <select value={form.icon} onChange={(e) => update({ icon: e.target.value })} className="mt-1 w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none focus:border-red-600">
                    {ICONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </label>
              </div>

              <label className="block text-xs text-gray-500">
                وصف قصير يظهر في بطاقة المشروع
                <textarea value={form.description} onChange={(e) => update({ description: e.target.value })} rows={3} className="mt-1 w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none focus:border-red-600" />
              </label>

              <label className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 cursor-pointer">
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => update({ isFeatured: e.target.checked })} className="mt-1 h-4 w-4 accent-red-700" />
                <span className="text-sm">
                  <strong className="block font-semibold">عرض في الصفحة الرئيسية</strong>
                  <small className="text-gray-500">يظهر أيضاً دائماً في صفحة المشاريع.</small>
                </span>
              </label>
            </section>

            <Card title="المخرجات والخدمات">
              <ListEditor items={form.deliverables} onChange={(deliverables) => update({ deliverables })} placeholder="مثال: تصميم وطباعة اللوحات" addLabel="إضافة مخرج" />
            </Card>

            {/* Static preview of the visitor-facing contact box */}
            <section className="bg-red-700/90 text-white rounded-2xl p-6 md:p-8 opacity-60 select-none" aria-hidden="true">
              <p className="text-xs text-red-200 font-semibold mb-2">التواصل</p>
              <h3 className="text-xl font-medium mb-2">هل ترغب في مشروع مشابه؟</h3>
              <p className="text-xs text-red-100">نموذج التواصل يظهر هنا للزوار تلقائياً.</p>
            </section>
          </aside>
        </div>
      </main>

      {toast && (
        <div role="status" className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-30 px-6 py-3 rounded-lg text-sm font-medium shadow-lg text-white ${toast.type === "success" ? "bg-green-700" : "bg-gray-900"}`}>
          {toast.msg}
        </div>
      )}
    </form>
  );
}
