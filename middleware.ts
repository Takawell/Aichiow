import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const ua = req.headers.get('user-agent')?.toLowerCase() || ''
  const verified = req.cookies.get('verified')?.value === 'true'
  const url = req.nextUrl.clone()

  const botPatterns = [
    'curl',
    'wget',
    'python',
    'requests',
    'axios',
    'headlesschrome',
    'scrapy',
    'go-http-client',
    'java',
    'node-fetch',
    'libhttp',
    'libsoup',
    'httpclient',
    'aiohttp',
    'okhttp',
    'phantomjs'
  ]

  // Blokir bot API langsung ke /403
  if (botPatterns.some(bot => ua.includes(bot))) {
    url.pathname = '/403'
    return NextResponse.redirect(url)
  }

  // Human tapi belum verify → redirect ke splash
  if (!verified && req.nextUrl.pathname === '/') {
    url.pathname = '/verify-check'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/read/:path*', '/manga/:path*'], // bisa tambah path lain
}
