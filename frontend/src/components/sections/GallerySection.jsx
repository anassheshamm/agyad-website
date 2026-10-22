import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchProjects, resolveImageUrl } from "../../services/api.js";

const FILTERS = [
  "الكل",
  "إعلانات",
  "تصميم جرافيكي",
  "هوية بصرية",
  "تصوير",
  "فيديو",
  "طباعة خارجية",
  "شاشات رقمية",
];

export default function GallerySection() {
  const [filter, setFilter] = useState("الكل");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchProjects();
        setProjects(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load gallery projects:", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const filteredProjects =
    filter === "الكل"
      ? projects
      : projects.filter((project) => project.category === filter);

  // Display a maximum of 6 projects for the selected filter.
  const galleryItems = filteredProjects.slice(0, 6).map((project) => {
    const displayImage =
      project.coverImage ||
      project.images?.[0] ||
      `https://placehold.co/800x600/9B0028/FFFFFF?text=${encodeURIComponent(
        project.title || "Bab Ajyad"
      )}`;

    return {
      id: project.slug || project._id,
      title: project.title,
      cat: project.category,
      image: resolveImageUrl(displayImage),
    };
  });

  if (loading) {
    return (
      <div className="text-center py-24 text-ink">
        جاري التحميل...
      </div>
    );
  }

  return (
    <section
      id="gallery"
      className="bg-parchment text-ink py-24 md:py-32"
      dir="rtl"
      lang="ar"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Section heading */}
        <div className="text-right mb-12">
          <p className="text-oxblood text-sm mb-3">
            معرض الأعمال
          </p>

          <h2 className="font-serif text-4xl md:text-5xl">
            تصفح إبداعاتنا
          </h2>

          <div className="hairline w-24 my-7 mr-0 ml-auto opacity-70" />
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-x-8 gap-y-3 justify-end mb-12 border-b border-ink/10 pb-6">
          {FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={
                "text-sm pb-2 transition-colors border-b " +
                (filter === item
                  ? "text-oxblood border-oxblood"
                  : "text-ink/50 border-transparent hover:text-ink")
              }
            >
              {item}
            </button>
          ))}
        </div>

        {/* Gallery */}
        {galleryItems.length === 0 ? (
          <div className="text-center py-20 bg-stone-100 border border-ink/10 rounded-xl">
            <h3 className="font-serif text-2xl text-oxblood mb-2">
              لا توجد أعمال مضافة حالياً
            </h3>

            <p className="text-ink/70">
              قريباً سيتم إضافة أعمالنا هنا...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {galleryItems.map((item) => (
              <Link
                to={`/projects/${item.id}`}
                key={item.id}
                className="group relative block aspect-[4/3] overflow-hidden rounded-xl bg-stone-200"
              >
                <img
                  src={item.image}
                  alt={item.title || "من أعمال باب أجياد"}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />

                {/* Image overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent transition-opacity duration-300 group-hover:from-black/90" />

                {/* Project title and category */}
                <div className="absolute inset-x-0 bottom-0 p-5 text-right">
                  <p className="text-white font-serif text-lg md:text-xl leading-relaxed">
                    {item.title}
                  </p>

                  <p className="text-white/80 text-sm mt-1">
                    {item.cat}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
