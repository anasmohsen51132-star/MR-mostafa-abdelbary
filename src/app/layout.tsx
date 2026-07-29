// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";
import "./luxury-enhancements.css";
import { Providers } from "./providers";
import { ThemeStyle } from "@/components/theme/ThemeStyle";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { getNoFlashScript } from "@/lib/theme-script";
import { getSiteSettings } from "@/lib/site-settings";
import { SITE_URL, SITE_NAME, SITE_NAME_SHORT, SITE_DESCRIPTION, SITE_KEYWORDS, DEFAULT_LOCALE } from "@/lib/seo";

// SEO NOTE: `icons` and `manifest` are intentionally NOT set on this
// metadata object. Next.js's file-based conventions — src/app/icon.tsx,
// src/app/apple-icon.tsx, and src/app/manifest.ts — already generate and
// auto-link the correct <link> tags for all of these. Explicitly setting
// `metadata.icons` here would override and disable the file-based icons
// entirely (this is documented Next.js behavior), so the two approaches
// must not be mixed.
//
// CUSTOM-004 (Platform Settings / SEO): this used to be a static `export
// const metadata`. It's now generateMetadata() so the OWNER's saved
// meta title/description/keywords/OG image (if set) can override the
// static SITE_* defaults from src/lib/seo.ts — falling back to those
// defaults whenever a field is left empty, so an untouched install looks
// exactly as it did before this feature existed.
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
  // TASK 06: was a single static "#1A6B47" (old emerald, doesn't match
  // the Chemistry palette either). The array form lets the browser
  // chrome (mobile address bar tint, etc.) follow prefers-color-scheme
  // automatically before any JS runs. ThemeProvider additionally updates
  // this meta tag live to track an explicit user toggle that overrides
  // the OS preference — see applyThemeToDom() in ThemeProvider.tsx.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F0F4FF" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0F1E" },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // NEXT-003 FIX: reading headers() here is what matters, not the value
  // itself — it forces this layout to render dynamically per request
  // (required, since the nonce/CSP differ on every request and must never
  // be cached/shared across requests). Next.js automatically applies this
  // same nonce to its own internally-generated inline hydration scripts;
  // if a custom inline <script> is ever added directly in this app, pass
  // nonce={(await headers()).get("x-nonce")} to it explicitly.
  //
  // TASK 06: this is exactly that "custom inline <script>" case — the
  // pre-hydration no-flash theme script below. Without the nonce, the
  // strict CSP in middleware.ts (script-src 'self' 'nonce-...'
  // 'strict-dynamic') silently blocks it, and every page load would
  // flash the wrong theme before React ever mounts.
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    // suppressHydrationWarning is scoped to exactly this element, which
    // is the only one whose attributes are intentionally mutated outside
    // of React (by the script below, before hydration, and by
    // ThemeProvider on every toggle after that). This is the same
    // documented pattern used by next-themes and other theme libraries —
    // it does not suppress warnings anywhere else in the tree.
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body>
        {/* Must run before anything below paints — sets data-theme/dark
            on <html> synchronously so there is never a flash of the
            wrong theme. See src/lib/theme-script.ts for why the nonce is
            required. */}
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: getNoFlashScript() }} />
        <ThemeStyle />
        <ThemeProvider>
          <Providers>{children}</Providers>
          <ThemeToggle floating />
        </ThemeProvider>
      </body>
    </html>
  );
}
