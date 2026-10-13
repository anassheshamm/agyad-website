import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchProjects, deleteProject } from "../../services/api";

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("الكل");
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const data = await fetchProjects();
      setProjects(Array.isArray(data) ? data : []);
      setLoading(false);
    })();
  }, []);

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const categories = useMemo(
    () => ["الكل", ...new Set(projects.map((p) => p.category).filter(Boolean))],
    [projects]
  );

  const shown = projects.filter(
    (p) =>
      (category === "الكل" || p.category === category) &&
      (p.title || "").toLowerCase().includes(query.trim().toLowerCase())
  );

  const handleDelete = async (project) => {
    if (!window.confirm(`هل أنت متأكد من حذف «${project.title}»؟ لا يمكن التراجع عن ذلك.`)) return;
    const res = await deleteProject(project._id);
    if (res.success) {
      setProjects((list) => list.filter((p) => p._id !== project._id));
      notify("تم حذف المشروع");
    } else {
      notify(res.message || "تعذر حذف المشروع");
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const featured = projects.filter((p) => p.isFeatured).length;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900" dir="rtl" lang="ar">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-xl font-bold text-red-700">لوحة الإدارة</h1>
          <nav className="flex flex-wrap items-center gap-3">
            <Link to="/admin/projects/new" className="text-sm font-medium bg-red-700 text-white px-5 py-2.5 rounded-lg hover:bg-red-800 transition-colors shadow-sm">
              + مشروع جديد
            </Link>
            <button onClick={logout} className="text-sm text-gray-500 hover:text-red-700 px-2">تسجيل الخروج</button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">المشاريع</h2>
            <p className="text-sm text-gray-500 mt-1">
              {projects.length} مشروع، منها {featured} ظاهر في الصفحة الرئيسية
            </p>
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث باسم المشروع..."
            className="w-full sm:w-72 bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-red-600"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={"px-4 py-1.5 rounded-full border text-sm transition-colors " + (category === c ? "bg-red-700 border-red-700 text-white" : "bg-white border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-700")}
            >
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-red-700 py-20">جاري التحميل...</p>
        ) : shown.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-300 rounded-2xl py-16 text-center">
            <p className="text-gray-700 font-medium mb-1">
              {projects.length === 0 ? "لا توجد مشاريع بعد" : "لا توجد نتائج مطابقة"}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              {projects.length === 0 ? "ابدأ بإضافة أول مشروع ليظهر في الموقع." : "جرّب كلمة بحث أو تصنيفاً آخر."}
            </p>
            {projects.length === 0 && (
              <Link to="/admin/projects/new" className="inline-block bg-red-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-red-800">
                إضافة مشروع
              </Link>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {shown.map((p) => (
              <article key={p._id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
                <Link to={`/admin/projects/edit/${p._id}`} className="block aspect-[16/10] bg-gray-100 relative">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">بدون صورة</span>
                  )}
                  {p.isFeatured && (
                    <span className="absolute top-3 right-3 bg-red-700 text-white text-xs px-3 py-1 rounded-full">في الرئيسية</span>
                  )}
                </Link>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-semibold text-lg leading-snug">{p.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 mb-4">{[p.category, p.year].filter(Boolean).join(" • ")}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <Link to={`/admin/projects/edit/${p._id}`} className="text-sm font-medium bg-gray-900 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition-colors">
                      تعديل
                    </Link>
                    <button onClick={() => handleDelete(p)} className="text-sm text-gray-400 hover:text-red-700 transition-colors">
                      حذف
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {toast && (
        <div role="status" className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-6 py-3 rounded-lg shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
