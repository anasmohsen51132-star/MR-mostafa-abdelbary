// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";
import "./luxury-enhancements.css";
import { Providers } from "./providers";
import { ThemeStyle } from "@/components/theme/ThemeStyle";
import { getSiteSettings } from "@/lib/site-settings";
import { SITE_URL, SITE_NAME, SITE_NAME_SHORT, SITE_DESCRIPTION, SITE_KEYWORDS, DEFAULT_LOCALE } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  const title = s.metaTitle?.trim() || SITE_NAME;
  const description = s.metaDescription?.trim() || SITE_DESCRIPTION;
  const keywords = s.metaKeywords?.trim()
    ? s.metaKeywords.split(",").map((k) => k.trim()).filter(Boolean)
    : SITE_KEYWORDS;
  const ogImage = s.ogImage?.trim() || "/opengraph-image";

  return {
    metadataBase: new URL(SITE_URL),
    // GOOGLE VERIFICATION FIX: إضافة كود التحقق الخاص بجوجل هنا
    verification: {
      google: "C55EKKdgIfuSHe_hXSkEBlS4CheFrCuUmUrr8Ni6Wgg",
    },
    title: {
      default: title,
      template: `%s | ${SITE_NAME_SHORT}`,
    },
    description,
    keywords,
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    applicationName: SITE_NAME_SHORT,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    alternates: {
      canonical: SITE_URL,
    },
    openGraph: {
      type: "website",
      locale: DEFAULT_LOCALE,
      url: SITE_URL,
      siteName: SITE_NAME,
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1A6B47",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  await headers();

  return (
    <html lang="ar" dir="rtl">
      <body>
        <ThemeStyle />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
