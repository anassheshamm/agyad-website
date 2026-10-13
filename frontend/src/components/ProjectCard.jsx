import { createElement } from "react";
import { Link } from "react-router-dom";
import { IconArrow } from "./icons.jsx";
import { getIconComponent } from "../utils/iconMap.jsx";
import { resolveImageUrl } from "../services/api.js";

const TILE_BG = [
  "from-[#9B0028] via-[#7A001F] to-[#3C3C3C]",
  "from-[#3C3C3C] via-[#555555] to-[#8A8A8A]",
  "from-[#B80A35] via-[#9B0028] to-[#3C3C3C]",
];

export default function ProjectCard({ project, index }) {
  const ProjectIcon = getIconComponent(project.icon);
  
  // Use MongoDB slug or _id for the URL routing
  const detailHref = `/projects/${project.slug || project._id || '#'}`;

  // Use coverImage from backend if available, fallback to legacy image
  const displayImage = project.coverImage || project.image;

  return (
    <article className="group bg-white border border-[#D9D9D9] hover:border-[#9B0028] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
      <Link to={detailHref} className="relative h-56 overflow-hidden block">
        {displayImage ? (
          <img
            src={resolveImageUrl(displayImage)}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        ) : (
          <div className={"absolute inset-0 bg-gradient-to-br " + TILE_BG[index % TILE_BG.length]}>
            {/* Brochure-style diagonal accent */}
            <div className="absolute top-0 left-0 w-24 h-24 bg-white/10 rotate-45 -translate-x-10 -translate-y-10" />
            <div className="absolute bottom-0 right-0 w-28 h-28 bg-white/10 rotate-45 translate-x-12 translate-y-12" />
            
            <div className="absolute inset-0 flex items-center justify-center">
              {createElement(ProjectIcon, { className: "w-14 h-14 text-white transition-transform duration-500 group-hover:scale-110" })}
            </div>
          </div>
        )}
      </Link>

      <div className="p-6 flex flex-col flex-1">
        <span className="self-start text-xs font-medium text-[#9B0028] bg-[#F8F8F8] border border-[#D9D9D9] px-3 py-1 rounded-full">
          {project.category}
        </span>
        
        <Link to={detailHref}>
          <h3 className="text-xl font-bold text-[#3C3C3C] mt-4 mb-3 leading-relaxed hover:text-[#9B0028] transition-colors">
            {project.title}
          </h3>
        </Link>
        
        {/* Map backend 'description' field while falling back to legacy 'body' */}
        <p className="text-[#555555] text-sm leading-7 mb-6 flex-1">
          {project.description || project.body}
        </p>
        
        <div className="w-full h-px bg-[#E5E5E5] mb-4" />
        
        <Link to={detailHref} className="inline-flex items-center gap-2 text-sm font-medium text-[#9B0028] hover:text-[#7A001F] transition-colors">
          عرض تفاصيل المشروع
          <IconArrow className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
