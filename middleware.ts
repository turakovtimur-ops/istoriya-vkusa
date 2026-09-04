export const config = { matcher: ['/images/:path*', '/menus/:path*'] };
export default function middleware(request: Request) {
  const referer = request.headers.get('referer') || '';
  const allow = ['istoriya-vkusa.ru', 'yandex.ru', 'vercel.app', 'localhost'];
  if (referer && !allow.some((d) => referer.includes(d))) {
    return new Response('403 — контент защищён © Тураков Т.Р.', { status: 403 });
  }
}
