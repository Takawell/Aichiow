import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Cek ENV MAINTENANCE_MODE
  if (process.env.MAINTENANCE_MODE === 'true') {
    const url = req.nextUrl.clone();

    // Jangan redirect jika sudah di halaman /maintenance
    if (url.pathname !== '/maintenance') {
      url.pathname = '/maintenance';
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

// Matcher untuk semua route utama
export const config = {
  matcher: [
    '/',
    '/home/:path*',
    '/upcoming/:path*',
    '/explore/:path*',
    '/anime/:path*',
    '/manga/:path*',
    '/manhwa/:path*',
    '/light-novel/:path*',
  ],
};
