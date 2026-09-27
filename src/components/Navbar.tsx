"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Sparkles, X } from "lucide-react";
import { TOOLS, SITE } from "@/lib/tools";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-slate-950/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <span className="relative grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-purple-900/40 transition-transform duration-300 group-hover:scale-105">
            <Sparkles className="h-5 w-5 text-white" />
            <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-70" />
          </span>
          <span className="leading-tight">
            <span className="block text-lg font-extrabold text-white">{SITE.name}</span>
            <span className="block text-[11px] font-medium text-slate-400">
              {SITE.nameAr}
            </span>
          </span>
        </Link>

        {/* روابط سطح المكتب */}
        <div className="hidden items-center gap-1 lg:flex">
          <Link
            href="/"
            className="rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            الرئيسية
          </Link>
          {TOOLS.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition hover:bg-white/10 hover:text-white ${
                pathname === `/tools/${tool.slug}` ? "bg-white/10 text-white" : "text-slate-300"
              }`}
            >
              <span className="me-1.5">{tool.emoji}</span>
              {tool.shortName}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link href="/tools/text-generator" className="btn-primary hidden !px-5 !py-2.5 text-sm sm:inline-flex">
            ابدأ الآن
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label="فتح القائمة"
            aria-expanded={open}
            className="btn-ghost !px-3 !py-2.5 lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* قائمة الجوال */}
      <div
        className={`overflow-hidden border-t border-white/10 bg-slate-950/95 backdrop-blur-xl transition-all duration-300 lg:hidden ${
          open ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="grid gap-1.5 px-4 py-4">
          <Link
            href="/"
            onClick={closeMenu}
            className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-white/10"
          >
            🏠 الرئيسية
          </Link>
          {TOOLS.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              onClick={closeMenu}
              className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-white/10"
            >
              <span className="me-2">{tool.emoji}</span>
              {tool.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
