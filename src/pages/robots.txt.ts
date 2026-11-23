import { siteUrl, publicationReady } from '../site/config';
export function GET() {
  return new Response(
    `User-agent: *\nAllow: /\n${publicationReady ? `Sitemap: ${new URL('/sitemap.xml', siteUrl).href}\n` : ''}`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
}
