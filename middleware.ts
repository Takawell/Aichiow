import { NextRequest, NextResponse } from 'next/server';

const blockedAgents = [
  'curl', 'wget', 'httpx', 'httpie', 'node-fetch', 'axios', 'python', 'python-requests',
  'urllib', 'java', 'libwww-perl', 'perl', 'scrapy', 'httpclient', 'aiohttp', 'mechanize',
  'okhttp', 'phpcrawl', 'pycurl', 'ahrefsbot', 'semrush', 'mj12bot', 'dotbot', 'seznambot',
  'screaming frog', 'siteauditbot', 'yandexbot', 'duckduckbot', 'baiduspider', 'bingbot',
  'facebookexternalhit', 'twitterbot', 'slackbot', 'telegrambot', 'discordbot', 'linkpreview',
  'datadome', 'phantomjs', 'puppeteer', 'headlesschrome', 'slimerjs', 'selenium',
  'uptimerobot', 'statuscake', 'checkly', 'cloudflare-healthchecks', 'zgrab', 'masscan',
  'nmap', 'censys', 'shodan', 'netcraft', 'gptbot', 'bytespider', 'amazonbot',
  'anthropic-ai', 'openai', 'ccbot', 'yeti'
];

function isBlockedUserAgent(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return blockedAgents.some(bot => ua.includes(bot));
}

export function middleware(req: NextRequest) {
  const userAgent = req.headers.get('user-agent') || '';
  const url = req.nextUrl.clone();
  const cookieVerified = req.cookies.get('verified')?.value === '1';

  
   if (isBlockedUserAgent(userAgent)) {
    url.pathname = '/403';
    return NextResponse.redirect(url);
  }

  
   if (!cookieVerified && !url.pathname.startsWith('/verify')) {
    url.pathname = '/verify';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/anime/:path*', '/manga/:path*', '/read/:path*', '/api/:path*'],
};
