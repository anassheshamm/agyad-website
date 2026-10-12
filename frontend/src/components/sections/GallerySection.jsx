import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchProjects, resolveImageUrl } from "../../services/api.js";

// Unified filters based on your project categories
const FILTERS = [
  "الكل", "إعلانات", "تصميم جرافيكي", "هوية بصرية", "تصوير", "فيديو", "طباعة خارجية", "شاشات رقمية"
];

export default function GallerySection() {
  const [filter, setFilter] = useState("الكل");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      const data = await fetchProjects();
      setProjects(data);
      setLoading(false);
    };
    loadProjects();
  }, []);

  if (loading) return <div className="text-center py-24 text-ink">جاري التحميل...</div>;

  // 1. Filter projects based on the selected category
  const filteredProjects = filter === "الكل" 
    ? projects 
    : projects.filter((p) => p.category === filter);

  // 2. Map ALL projects to the gallery, providing a dynamic placeholder if no image exists
  const galleryItems = filteredProjects.map((p, index) => {
    const hasImage = p.coverImage || (p.images && p.images.length > 0);
    
    // Auto-generate a burgundy placeholder with the project title if the admin didn't add an image
    const displayImage = hasImage 
      ? (p.coverImage || p.images[0]) 
      : `https://placehold.co/800x600/9B0028/FFFFFF?text=${encodeURIComponent(p.title)}`;

    return {
      id: p.slug || p._id,
      title: p.title,
      cat: p.category,
      image: resolveImageUrl(displayImage),
      size: index % 5 === 0 ? "tall" : index % 3 === 0 ? "wide" : "normal"
    };
  });

  return (
    <section id="gallery" className="bg-parchment text-ink py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="text-right mb-12">
          <p className="text-oxblood text-sm mb-3">معرض الأعمال</p>
          <h2 className="font-serif text-4xl md:text-5xl">تصفح إبداعاتنا</h2>
          <div className="hairline w-24 my-7 mr-0 ml-auto opacity-70" />
        </div>
        
        <div className="flex flex-wrap gap-x-8 gap-y-3 justify-end mb-12 border-b border-ink/10 pb-6">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={
                "text-sm pb-1 transition-colors border-b " +
                (filter === f
                  ? "text-oxblood border-oxblood"
                  : "text-ink/50 border-transparent hover:text-ink")
              }
            >
              {f}
            </button>
          ))}
        </div>

        {galleryItems.length === 0 ? (
           <div className="text-center py-20 bg-stone-100 border border-ink/10 rounded-xl">
             <h3 className="font-serif text-2xl text-oxblood mb-2">لا توجد أعمال مضافة حالياً</h3>
             <p className="text-ink/70">قريباً سيتم إضافة أعمالنا هنا...</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[190px] sm:auto-rows-[160px] md:auto-rows-[190px]">
            {galleryItems.map((g, i) => (
              <Link
                to={`/projects/${g.id}`}
                key={`${g.id}-${i}`}
                className={
                  "group relative overflow-hidden border border-ink/10 bg-stone-200 block " +
                  (g.size === "tall" ? "sm:row-span-2" : g.size === "wide" ? "md:col-span-2" : "")
                }
              >
                <img
                  src={g.image}
                  alt={g.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/60 transition-colors duration-500" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-right opacity-90 group-hover:opacity-100 transition-opacity">
                  <p className="text-white font-serif text-lg">{g.title}</p>
                  <p className="text-white/80 text-xs mt-1">{g.cat}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
