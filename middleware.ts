// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const ua = req.headers.get('user-agent')?.toLowerCase() || ''
  const isBot = /curl|python|scrapy|node-fetch|wget|axios|httpclient/.test(ua)

  if (isBot) {
    const deny = req.nextUrl.clone()
    deny.pathname = '/403'
    return NextResponse.redirect(deny)
  }

  const verified = req.cookies.get('verified')?.value === 'true'

  if (!verified && req.nextUrl.pathname === '/') {
    const url = req.nextUrl.clone()
    url.pathname = '/verify-check'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}
