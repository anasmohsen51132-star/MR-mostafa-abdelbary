// src/app/icon-192/route.ts
//
// Serves a 192x192 PNG at /icon-192, referenced explicitly by src/app/manifest.ts.
// NOTE: this intentionally uses a plain Route Handler rather than Next's
// special icon.tsx naming convention — that convention only auto-detects
// exact reserved names (icon.tsx, apple-icon.tsx) or numbered suffixes
// (icon1.tsx, icon2.tsx) for the *favicon* <link> tags, not arbitrary names
// like "icon-192". A manifest.json icons[].src just needs *some* URL that
// serves an image, so a regular route handler returning a static file is
// the reliable way to do that at a custom path.
//
// BRAND UPDATE: previously this rendered a gold/emerald "م" placeholder via
// next/og's ImageResponse. It now serves the real MB Chemistry Academy logo
// (public/icon-192.png, pre-cropped to a transparent circular badge) so the
// PWA install icon matches the brand mark used everywhere else (icon.png,
// apple-icon.png).
//
// BUGFIX: an earlier version embedded the logo as a base64 string literal
// directly in this file's source. A single ~70,000-character string on one
// line crashed TypeScript's parser during the Vercel build ("File ... is
// not a module"). Reading the PNG from /public at request time avoids that
// entirely and is simpler.
import { readFile } from "fs/promises";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "public", "icon-192.png");
  const file = await readFile(filePath);

  return new Response(file, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
