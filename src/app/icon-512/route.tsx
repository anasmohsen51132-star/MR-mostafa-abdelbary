// src/app/icon-512/route.tsx
// Serves a 512x512 PNG at /icon-512 — see the note in icon-192/route.tsx
// for why this is a plain Route Handler rather than the icon.tsx convention.
//
// BRAND UPDATE: previously this rendered a gold/emerald "م" placeholder via
// next/og's ImageResponse. It now serves the real MB Chemistry Academy logo
// (public/icon-512.png, pre-cropped to a transparent circular badge) so the
// PWA install icon matches the brand mark used everywhere else (icon.png,
// apple-icon.png).
//
// BUGFIX: an earlier version embedded the logo as a base64 string literal
// directly in this file's source. A single ~320,000-character string on one
// line crashed TypeScript's parser during the Vercel build ("File ... is
// not a module"). Reading the PNG from /public at request time avoids that
// entirely and is simpler.
import { readFile } from "fs/promises";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "public", "icon-512.png");
  const file = await readFile(filePath);

  return new Response(file, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
