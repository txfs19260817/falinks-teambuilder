/* eslint-disable @next/next/no-server-import-in-page */
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { AppConfig } from '@/utils/AppConfig';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  if (url.pathname === '/usages/') {
    url.pathname = `/usages/${AppConfig.defaultFormat}`;
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
