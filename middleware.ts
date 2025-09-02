import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const maintenance = process.env.MAINTENANCE_MODE === "true";
  const { pathname } = req.nextUrl;

  if (maintenance) {
    if (pathname === "/maintenance") {
      return NextResponse.next();
    }

    const url = req.nextUrl.clone();
    url.pathname = "/maintenance";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!favicon.ico|manifest.json|maintenance).*)",
  ],
};
