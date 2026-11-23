import { pages } from '../site/pages';
import { siteUrl, publicationReady } from '../site/config';
export function GET() {
  const paths = publicationReady
    ? [
        '/',
        ...pages
          .filter((p) => !['legal', 'privacy', 'terms'].includes(p.id))
          .map((p) => `/${p.slug}/`),
      ]
    : [];
  const escape = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((p) => `<url><loc>${escape(new URL(p, siteUrl).href)}</loc></url>`).join('')}</urlset>`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
}
