"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { navigation, profile } from "@/data/profile";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [active, setActive] = useState("top");
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const activeId = isHome ? active : "projects";
  const sectionHref = (id: string) => `${isHome ? "" : "/"}#${id}`;

  useEffect(() => {
    if (!isHome) return;
    const updateActive = () => {
      const marker = window.scrollY + Math.min(window.innerHeight * 0.36, 260);
      let current = "top";
      for (const item of navigation) {
        const section = document.getElementById(item.id);
        if (section && section.offsetTop <= marker) current = item.id;
      }
      if (
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 8
      )
        current = "contact";
      setActive(current);
    };
    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, [isHome]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        menuRef.current?.focus();
      }
    };
    const closeOnDesktop = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    window.addEventListener("resize", closeOnDesktop);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("resize", closeOnDesktop);
    };
  }, [open]);

  return (
    <header className="nav-shell">
      <div className="nav-inner">
        <a
          href={sectionHref("top")}
          className="brand"
          aria-label={`${profile.name}, back to home`}
          onClick={() => setOpen(false)}
        >
          {profile.shortName}
          <span>.</span>
        </a>
        <nav className="nav-pill hidden lg:flex" aria-label="Main navigation">
          {navigation.map(({ id, label }) => (
            <a
              key={id}
              href={sectionHref(id)}
              className={cn(activeId === id && "is-active")}
              aria-current={activeId === id ? "location" : undefined}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center justify-end gap-3">
          <a
            href={sectionHref("contact")}
            className="nav-talk"
            onClick={() => setOpen(false)}
          >
            Let’s talk <ArrowUpRight size={15} />
          </a>
          <button
            ref={menuRef}
            className="menu-toggle lg:hidden"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Close navigation" : "Open navigation"}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      <nav
        id="mobile-navigation"
        className={cn("mobile-navigation lg:hidden", !open && "hidden")}
        aria-label="Mobile navigation"
      >
        {navigation.map(({ id, label }) => (
          <a
            key={id}
            href={sectionHref(id)}
            aria-current={activeId === id ? "location" : undefined}
            onClick={() => setOpen(false)}
          >
            {label}
            <ArrowUpRight size={16} />
          </a>
        ))}
      </nav>
    </header>
  );
}
