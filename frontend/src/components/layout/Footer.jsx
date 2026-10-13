import React from "react";
import { NAV } from "../../data/nav.js";
import Logo from "/logo-new.png";

import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaXTwitter,
} from "react-icons/fa6";

import { FaSnapchatGhost } from "react-icons/fa";

export default function Footer() {
  const socialLinks = [
    {
      icon: FaFacebookF,
      href: "https://www.facebook.com/share/1D4s4SMRkm/",
      label: "Facebook",
    },
    {
      icon: FaInstagram,
      href: "https://www.instagram.com/bbjydlldy?igsh=emxtcHp6c3kzazlo",
      label: "Instagram",
    },
    {
      icon: FaXTwitter,
      href: "https://x.com/babajyad8",
      label: "X",
    },
    {
      icon: FaYoutube,
      href: "https://youtube.com/@babajyad?si=16WQXS4MFawYVlJq",
      label: "YouTube",
    },
    {
      icon: FaSnapchatGhost,
      href: "https://www.snapchat.com/add/bab_ajyad?share_id=_STNJvyLxeI&locale=ar-AE",
      label: "Snapchat",
    },
    {
      icon: FaTiktok,
      href: "https://www.tiktok.com/@babajyad20262?_r=1&_t=ZS-97SO06H85Sf",
      label: "TikTok",
    },
  ];

  return (
    <footer className="bg-ink border-t border-ink-line py-14">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex flex-col items-center gap-8">
          <img
            src={Logo}
            alt="باب أجياد للدعاية والإعلان"
            className="h-12 w-auto"
          />

          <nav className="flex flex-wrap gap-7 justify-center">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() =>
                  document
                    .getElementById(n.id)
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="text-stone hover:text-gild-bright text-sm transition-colors"
              >
                {n.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-line bg-ink-soft text-stone transition-all duration-300 hover:border-gild-bright hover:text-gild-bright hover:-translate-y-1"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>

          <a
            href="mailto:babajyad2026@gmail.com"
            className="text-stone hover:text-gild-bright transition-colors text-sm"
          >
            babajyad2026@gmail.com
          </a>

          <p className="text-stone/70 text-xs text-center">
            © ٢٠٢٦ باب أجياد للدعاية والإعلان
          </p>
        </div>
      </div>
    </footer>
  );
}