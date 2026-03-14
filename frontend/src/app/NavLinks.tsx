"use client";

import { usePathname } from "next/navigation";

const links = [
  { label: "home", href: "/" },
  { label: "about", href: "/about" },
  { label: "contact", href: "/contact" },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 text-xs tracking-widest uppercase">
      {links.map((link, i) => {
        const active =
          link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
        return (
          <span key={link.href} className="flex items-center gap-1">
            {i > 0 && <span className="text-white/20">·</span>}
            <a
              href={link.href}
              className="px-4 py-2 transition-colors"
              style={{ color: active ? "#f59e0b" : "#ffffff" }}
            >
              {link.label}
            </a>
          </span>
        );
      })}
    </div>
  );
}
