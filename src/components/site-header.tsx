"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useEffectEvent, useState } from "react";

const navItems = [
  { label: "Home", href: "/", section: "home" },
  { label: "About", href: "/#about", section: "about" },
  { label: "Experience", href: "/#experience", section: "experience" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/#contact", section: "contact" }
];

type SiteHeaderProps = {
  alias: string;
};

export function SiteHeader({ alias }: SiteHeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const updateSection = useEffectEvent(() => {
    if (pathname !== "/") {
      return;
    }

    const sections = ["home", "about", "experience", "contact"];
    const scrollY = window.scrollY + 180;

    for (const sectionId of sections) {
      const element = document.getElementById(sectionId);

      if (!element) {
        continue;
      }

      const start = element.offsetTop;
      const end = start + element.offsetHeight;

      if (scrollY >= start && scrollY < end) {
        setActiveSection(sectionId);
      }
    }
  });

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    updateSection();

    if (pathname !== "/") {
      return;
    }

    window.addEventListener("scroll", updateSection, { passive: true });

    return () => window.removeEventListener("scroll", updateSection);
  }, [pathname, updateSection]);

  return (
    <header className="site-header">
      <div className="shell site-header-shell">
        <Link href="/" className="brand-mark">
          <span className="brand-prompt">root@{alias.toLowerCase()}</span>
          <span className="brand-status">offensive-ops</span>
        </Link>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`site-nav${menuOpen ? " is-open" : ""}`}>
          {navItems.map((item) => {
            const isHomeAnchor = item.section && pathname === "/" && activeSection === item.section;
            const isPathActive =
              !item.section &&
              (pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)));

            return (
              <Link
                key={item.label}
                href={item.href}
                className={isHomeAnchor || isPathActive ? "is-active" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
