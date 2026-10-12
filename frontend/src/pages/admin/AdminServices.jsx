import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createService, deleteService, fetchServices, updateService } from "../../services/api";

const emptyForm = { title: "", description: "", icon: "palette", items: "", order: 0, isActive: true };

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const load = async () => setServices((await fetchServices(true)) || []);
  useEffect(() => { load(); }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = { ...form, order: Number(form.order) || 0, items: form.items.split("\n").map((item) => item.trim()).filter(Boolean) };
    const result = editingId ? await updateService(editingId, payload) : await createService(payload);
    if (!result.success) return alert(result.message || "تعذر حفظ الخدمة");
    setForm(emptyForm);
    setEditingId(null);
    await load();
  };

  const startEdit = (service) => {
    setEditingId(service._id);
    setForm({ title: service.title || "", description: service.description || "", icon: service.icon || "palette", items: (service.items || []).join("\n"), order: service.order || 0, isActive: service.isActive !== false });
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
          <div className="grid md:grid-cols-2 gap-4">
            <label className="block text-sm font-bold">اسم الخدمة<input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-2 w-full bg-[#f3f3f4] border rounded-lg px-4 py-2 font-normal" /></label>
            <label className="block text-sm font-bold">الأيقونة<input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="palette, printer, billboard..." className="mt-2 w-full bg-[#f3f3f4] border rounded-lg px-4 py-2 font-normal" /></label>
          </div>
          <label className="block text-sm font-bold">الوصف<textarea required rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-2 w-full bg-[#f3f3f4] border rounded-lg px-4 py-2 font-normal" /></label>
          <label className="block text-sm font-bold">تفاصيل الخدمة (سطر لكل نقطة)<textarea rows="4" value={form.items} onChange={(e) => setForm({ ...form, items: e.target.value })} className="mt-2 w-full bg-[#f3f3f4] border rounded-lg px-4 py-2 font-normal" /></label>
          <div className="flex flex-wrap items-center gap-6">
            <label className="text-sm font-bold">ترتيب العرض<input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} className="mr-2 w-24 bg-[#f3f3f4] border rounded-lg px-3 py-2 font-normal" /></label>
            <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />عرض الخدمة في الموقع</label>
            <button className="bg-[#b3223f] text-white px-6 py-2 rounded-lg font-bold">{editingId ? "حفظ التعديلات" : "إضافة الخدمة"}</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="text-[#2b2b2e] underline">إلغاء التعديل</button>}
          </div>
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
