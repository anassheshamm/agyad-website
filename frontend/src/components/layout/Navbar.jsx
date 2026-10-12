import React, { useState } from "react";
import { IconMenu, IconClose } from "../icons.jsx";
import { Link, useLocation } from "react-router-dom";

export const NAV = [
  { id: "home", label: "الرئيسية", path: "/" },
  { id: "about", label: "من نحن", path: "/" },
  { id: "services", label: "خدماتنا", path: "/" },
  { id: "projects", label: "أعمالنا", path: "/projects" },
  { id: "contact", label: "تواصل معنا", path: "/" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const go = (id, path) => {
    setOpen(false);

    if (location.pathname === "/" && path === "/") {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <div dir="rtl" lang="ar">
      <header
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
        className="
          fixed top-0 inset-x-0 z-50
          bg-ink
          border-b border-ink-line
          backdrop-blur
        "
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
          <Link
            to="/"
            onClick={() => go("home", "/")}
            className="flex items-center gap-2 shrink-0"
          >
            <img src="/logo-new.png" alt="باب أجياد" className="w-40 md:w-48 h-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-9">
            {NAV.map((n) =>
              location.pathname === "/" && n.path === "/" ? (
                <button
                  key={n.id}
                  onClick={() => go(n.id, n.path)}
                  className="underline-grow text-sm text-stone hover:text-parchment transition-colors"
                >
                  {n.label}
                </button>
              ) : (
                <Link
                  key={n.id}
                  to={n.path}
                  className="underline-grow text-sm text-stone hover:text-parchment transition-colors"
                >
                  {n.label}
                </Link>
              )
            )}
          </nav>

          <button
            onClick={() => go("contact", "/")}
            className="
              hidden md:inline-block
              border bg-white/90
              border-white/40
              text-gild-bright
              text-sm
              px-5 py-2.5
              hover:bg-gild
              hover:text-white
              transition-colors
              rounded-[25px]
            "
          >
            تواصل معنا
          </button>

          <button
            className="md:hidden text-parchment"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <IconClose className="w-7 h-7" />
            ) : (
              <IconMenu className="w-7 h-7" />
            )}
          </button>
        </div>

        {open && (
          <div className="md:hidden bg-ink border-t border-ink-line px-6 py-6 flex flex-col gap-5">
            {NAV.map((n) =>
              location.pathname === "/" && n.path === "/" ? (
                <button
                  key={n.id}
                  onClick={() => go(n.id, n.path)}
                  className="text-right text-parchment/90 text-base"
                >
                  {n.label}
                </button>
              ) : (
                <Link
                  key={n.id}
                  to={n.path}
                  onClick={() => setOpen(false)}
                  className="text-right text-parchment/90 text-base block"
                >
                  {n.label}
                </Link>
              )
            )}
          </div>
        )}
      </header>
    </div>
  );
}
