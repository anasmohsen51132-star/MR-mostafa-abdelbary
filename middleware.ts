// middleware.ts
// Runs in Edge Runtime — only import edge-safe modules
import { NextRequest, NextResponse } from "next/server";
import { verifyTokenEdge, extractTokenEdge } from "@/lib/auth-edge";
import { AUTH_COOKIE_NAME } from "@/lib/cookie-name";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/api/auth/login",
  "/api/auth/register",
  "/api/customize",
  "/opengraph-image",
];

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
function corsPreflightResponse() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": appUrl,
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}

function buildCsp(nonce: string) {
  const isDev = process.env.NODE_ENV !== "production";
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://img.youtube.com https://i.ytimg.com https://*.public.blob.vercel-storage.com https://res.cloudinary.com",
    "font-src 'self' data:",
    "frame-src https://www.youtube-nocookie.com",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");
}

function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes));
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // GOOGLE VERIFICATION FIX: تمرير ملف التحقق من جوجل مباشرة بدون أي توجيه أو معالجة
  if (pathname.startsWith("/google") && pathname.endsWith(".html")) {
    return NextResponse.next();
  }

  const nonce = generateNonce();
  const csp   = buildCsp(nonce);

  function withCsp<T extends Response>(res: T, includeNonceForRequest = true): T {
    res.headers.set("Content-Security-Policy", csp);
    if (includeNonceForRequest) res.headers.set("x-nonce", nonce);
    return res;
  }

  function next(extraRequestHeaders?: Headers) {
    const requestHeaders = extraRequestHeaders ?? new Headers(req.headers);
    requestHeaders.set("x-nonce", nonce);
    return withCsp(NextResponse.next({ request: { headers: requestHeaders } }));
  }

  function redirectNoStore(url: URL) {
    const res = NextResponse.redirect(url);
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  if (req.method === "OPTIONS" && pathname.startsWith("/api/")) {
    return withCsp(corsPreflightResponse(), false);
  }

  // Allow public paths
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith("/api/auth/"))) {
    return next();
  }

  // Allow static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return next();
  }

  const token = extractTokenEdge(req);
  if (!token) {
    if (pathname.startsWith("/api/")) {
      return withCsp(Response.json({ success: false, error: "غير مصرح" }, { status: 401 }), false);
    }
    return withCsp(redirectNoStore(new URL("/login", req.url)), false);
  }

  const payload = await verifyTokenEdge(token);
  if (!payload) {
    if (pathname.startsWith("/api/")) {
      return withCsp(Response.json({ success: false, error: "انتهت الجلسة" }, { status: 401 }), false);
    }
    const res = redirectNoStore(new URL("/login", req.url));
    res.cookies.set(AUTH_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(0),
      path: "/",
    });
    return withCsp(res, false);
  }

  // Role-based protection
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (payload.role !== "ADMIN" && payload.role !== "OWNER" && payload.role !== "DEVELOPER") {
      if (pathname.startsWith("/api/")) {
        return withCsp(Response.json({ success: false, error: "ليس لديك صلاحية" }, { status: 403 }), false);
      }
      return withCsp(redirectNoStore(new URL("/dashboard", req.url)), false);
    }
  }

  if (pathname.startsWith("/owner") || pathname.startsWith("/api/owner")) {
    if (payload.role !== "OWNER" && payload.role !== "DEVELOPER") {
      if (pathname.startsWith("/api/")) {
        return withCsp(Response.json({ success: false, error: "ليس لديك صلاحية" }, { status: 403 }), false);
      }
      return withCsp(redirectNoStore(new URL("/dashboard", req.url)), false);
    }
  }

  if (pathname.startsWith("/developer") || pathname.startsWith("/api/developer")) {
    if (payload.role !== "DEVELOPER") {
      if (pathname.startsWith("/api/")) {
        return withCsp(Response.json({ success: false, error: "ليس لديك صلاحية" }, { status: 403 }), false);
      }
      return withCsp(redirectNoStore(new URL("/dashboard", req.url)), false);
    }
  }

  // Inject user context into request headers for API routes
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-user-id",    payload.sub);
  requestHeaders.set("x-user-role",  payload.role);
  requestHeaders.set("x-user-phone", payload.phone);
  requestHeaders.set("x-user-name",  payload.name);

  return next(requestHeaders);
}

export const config = {
  // GOOGLE VERIFICATION FIX: استثناء ملفات HTML الخاصة بـ Google من الماتشر نهائياً
  matcher: ["/((?!_next/static|_next/image|favicon.ico|google.*\\.html$).*)"],
};
