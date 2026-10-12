import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createService, deleteService, fetchServices, updateService, uploadProjectImages, resolveImageUrl } from "../../services/api";

const emptyForm = { title: "", description: "", image: "", items: "", order: 0, isActive: true };

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const previewRef = useRef(null);
  const navigate = useNavigate();

  const load = async () => setServices((await fetchServices(true)) || []);
  useEffect(() => {
    let active = true;
    fetchServices(true).then((data) => {
      if (active) setServices(data || []);
    });
    return () => { active = false; };
  }, []);

  const clearPreview = () => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = null;
    setImagePreview("");
  };

  useEffect(() => () => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
  }, []);

  const resetForm = () => {
    clearPreview();
    setImageFile(null);
    setForm(emptyForm);
    setEditingId(null);
  };

  const selectImage = (file) => {
    if (!file) return;
    if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size > 2 * 1024 * 1024) {
      setMessage({ type: "error", text: "اختر صورة JPG أو PNG أو WebP بحجم لا يتجاوز 2 MB" });
      return;
    }
    clearPreview();
    const preview = URL.createObjectURL(file);
    previewRef.current = preview;
    setImageFile(file);
    setImagePreview(preview);
    setMessage(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      let image = form.image;
      if (imageFile) {
        const uploaded = await uploadProjectImages([imageFile]);
        if (!uploaded.success) {
          setMessage({ type: "error", text: uploaded.message || "تعذر رفع صورة الخدمة" });
          return;
        }
        image = uploaded.data?.images?.[0];
        if (typeof image !== "string" || !image) {
          setMessage({ type: "error", text: "استجاب الخادم برابط صورة غير صالح" });
          return;
        }
      }
      const payload = { ...form, image, order: Number(form.order) || 0, items: form.items.split("\n").map((item) => item.trim()).filter(Boolean) };
      const result = editingId ? await updateService(editingId, payload) : await createService(payload);
      if (!result.success) {
        setMessage({ type: "error", text: result.message || "تعذر حفظ الخدمة" });
        return;
      }
      resetForm();
      await load();
      setMessage({ type: "success", text: "تم حفظ الخدمة بنجاح" });
    } catch (error) {
      console.error("Error saving service:", error);
      setMessage({ type: "error", text: "حدث خطأ أثناء حفظ الخدمة، حاول مرة أخرى" });
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (service) => {
    clearPreview();
    setImageFile(null);
    setEditingId(service._id);
    setForm({ title: service.title || "", description: service.description || "", image: service.image || "", items: (service.items || []).join("\n"), order: service.order || 0, isActive: service.isActive !== false });
    setMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (service) => {
    if (!window.confirm(`هل أنت متأكد من حذف «${service.title}»؟`)) return;
    const result = await deleteService(service._id);
    if (result.success) await load();
    else alert(result.message || "تعذر حذف الخدمة");
  };

  return (
    <main className="min-h-screen bg-[#F3F3F4] p-6 md:p-8 font-sans" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div><h1 className="text-3xl font-bold text-[#8e1b31]">إدارة الخدمات</h1><Link to="/admin/projects" className="text-sm text-[#2b2b2e] hover:underline">العودة إلى لوحة الإدارة</Link></div>
          <button onClick={() => { localStorage.removeItem("adminToken"); navigate("/admin/login"); }} className="bg-[#2b2b2e] text-white px-5 py-2 rounded-lg">تسجيل الخروج</button>
        </header>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-[#e6e6e8] shadow-sm mb-8 space-y-4">
          <h2 className="text-xl font-bold text-[#8e1b31]">{editingId ? "تعديل الخدمة" : "إضافة خدمة"}</h2>
          <label className="block text-sm font-bold">اسم الخدمة<input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-2 w-full bg-[#f3f3f4] border rounded-lg px-4 py-2 font-normal" /></label>
          <label className="block text-sm font-bold">الوصف<textarea required rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-2 w-full bg-[#f3f3f4] border rounded-lg px-4 py-2 font-normal" /></label>
          <div className="space-y-2">
            <p className="text-sm font-bold">صورة الخدمة (اختياري)</p>
            {(imagePreview || form.image) && <div className="relative w-full max-w-sm aspect-[16/9] overflow-hidden rounded-lg border bg-gray-100">
              <img src={imagePreview || resolveImageUrl(form.image)} alt={form.title || "معاينة صورة الخدمة"} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
              <button type="button" onClick={() => {
                clearPreview();
                setImageFile(null);
                if (!imageFile) setForm((current) => ({ ...current, image: "" }));
              }} className="absolute top-2 left-2 rounded-full bg-white/95 px-3 py-1 text-sm text-red-700 shadow">
                {imageFile ? "إلغاء الصورة الجديدة" : "حذف الصورة"}
              </button>
            </div>}
            <label className="inline-flex cursor-pointer items-center rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:border-red-400 hover:text-red-700">
              {imageFile || form.image ? "اختيار صورة أخرى" : "اختيار صورة"}
              <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => { selectImage(e.target.files?.[0]); e.target.value = ""; }} />
            </label>
            <p className="text-xs text-gray-500">صورة واحدة لكل خدمة، حتى 2 MB بصيغة JPG أو PNG أو WebP.</p>
          </div>
          <label className="block text-sm font-bold">تفاصيل الخدمة (سطر لكل نقطة)<textarea rows="4" value={form.items} onChange={(e) => setForm({ ...form, items: e.target.value })} className="mt-2 w-full bg-[#f3f3f4] border rounded-lg px-4 py-2 font-normal" /></label>
          <div className="flex flex-wrap items-center gap-6">
            <label className="text-sm font-bold">ترتيب العرض<input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} className="mr-2 w-24 bg-[#f3f3f4] border rounded-lg px-3 py-2 font-normal" /></label>
            <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />عرض الخدمة في الموقع</label>
            <button disabled={saving} className="bg-[#b3223f] text-white px-6 py-2 rounded-lg font-bold disabled:opacity-60">{saving ? "جاري رفع الصورة والحفظ..." : editingId ? "حفظ التعديلات" : "إضافة الخدمة"}</button>
            {editingId && <button type="button" onClick={resetForm} className="text-[#2b2b2e] underline">إلغاء التعديل</button>}
          </div>
          {message && <p role="status" className={`text-sm ${message.type === "error" ? "text-red-700" : "text-green-700"}`}>{message.text}</p>}
        </form>

        <div className="space-y-3">
          {services.map((service) => <article key={service._id} className="bg-white rounded-xl border border-[#e6e6e8] p-5 flex flex-wrap justify-between items-center gap-4">
            <div><h3 className="font-bold text-lg">{service.title} {!service.isActive && <span className="text-xs text-gray-500">(مخفية)</span>}</h3><p className="text-sm text-gray-600 mt-1">{service.description}</p></div>
            <div className="flex gap-4"><button onClick={() => startEdit(service)} className="text-blue-700 hover:underline">تعديل</button><button onClick={() => remove(service)} className="text-[#b3223f] hover:underline">حذف</button></div>
          </article>)}
          {services.length === 0 && <div className="bg-white rounded-xl p-8 text-center text-gray-500">لا توجد خدمات بعد.</div>}
        </div>
      </div>
    </main>
  );
}
