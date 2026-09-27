import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SITE } from "@/lib/tools";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "AI Tools Hub — 5 أدوات ذكاء اصطناعي مجانية بالكامل بالعربية",
    template: "%s | AI Tools Hub",
  },
  description: SITE.description,
  keywords: [
    "ذكاء اصطناعي",
    "أدوات ذكاء اصطناعي مجانية",
    "توليد نصوص عربية",
    "تلخيص النصوص",
    "ترجمة فورية",
    "تحسين الكتابة",
    "تحليل المشاعر",
    "AI Tools Hub",
    "Groq",
    "Llama 3",
  ],
  authors: [{ name: "AI Tools Hub" }],
  applicationName: SITE.name,
  openGraph: {
    type: "website",
    locale: "ar_AR",
    siteName: SITE.name,
    title: "AI Tools Hub — 5 أدوات ذكاء اصطناعي مجانية بالكامل",
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Tools Hub — 5 أدوات ذكاء اصطناعي مجانية",
    description: SITE.description,
  },
  robots: { index: true, follow: true },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#0b1120",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <meta
          name="google-site-verification"
          content="j-iHu7oSEMHvRJt9EXUbTqBgAL71liygmOrO5HD72EU"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&family=Tajawal:wght@400;500;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased">
        <div className="app-bg" aria-hidden="true" />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:start-3 focus:z-[60] focus:rounded-xl focus:bg-white focus:px-4 focus:py-2 focus:text-slate-900"
        >
          تخطَّ إلى المحتوى
        </a>
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
