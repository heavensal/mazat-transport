import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import assert from 'node:assert/strict';
const root = resolve('dist');
const publicationReady =
  process.env.PUBLICATION_READY === 'true' && !!process.env.SITE_URL;
const retainedNoindex = [
  '/404.html',
  '/mentions-legales/index.html',
  '/confidentialite/index.html',
  '/conditions/index.html',
];
async function walk(dir) {
  return (
    await Promise.all(
      (await readdir(dir, { withFileTypes: true })).map((e) =>
        e.isDirectory() ? walk(join(dir, e.name)) : join(dir, e.name),
      ),
    )
  ).flat();
}
const files = await walk(root);
const htmlFiles = files.filter((f) => f.endsWith('.html'));
assert.equal(htmlFiles.length, 14, 'Expected 14 HTML pages including 404');
const titles = new Set();
const contents = new Map(
  await Promise.all(htmlFiles.map(async (f) => [f, await readFile(f, 'utf8')])),
);
let links = 0;
for (const [file, html] of contents) {
  const redirectTarget = html.match(
    /<meta http-equiv="refresh" content="0;url=([^"]+)"/,
  )?.[1];
  if (redirectTarget) {
    assert.ok(
      redirectTarget.startsWith('/'),
      `${file}: redirect must be local`,
    );
    assert.match(html, /<meta name="robots" content="noindex"/);
    const target = new URL(redirectTarget, 'https://preview.invalid');
    let path = join(root, decodeURIComponent(target.pathname));
    try {
      if ((await stat(path)).isDirectory()) path = join(path, 'index.html');
      await stat(path);
    } catch {
      assert.fail(`${file}: broken local redirect ${redirectTarget}`);
    }
    continue;
  }
  assert.match(html, /<html[^>]*lang="fr"/, 'French document language');
  assert.equal(
    (html.match(/<h1(?:\s|>)/g) || []).length,
    1,
    `${file}: exactly one h1`,
  );
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  assert.ok(title && !titles.has(title), `${file}: unique title`);
  titles.add(title);
  assert.match(html, /<meta name="description" content="[^"]+"/);
  const keptPrivate = retainedNoindex.some((suffix) => file.endsWith(suffix));
  const robots =
    !publicationReady || keptPrivate ? 'noindex, follow' : 'index, follow';
  assert.match(
    html,
    new RegExp(`<meta name="robots" content="${robots}"`),
    publicationReady
      ? `${file}: expected robots ${robots}`
      : 'Preview must not be indexable',
  );
  assert.doesNotMatch(
    html,
    /33\s*€|41\s*€|54\s*€|65\s*€|1[,.]25\s*€|Welcome to Astro|astro\.svg/,
  );
  for (const match of html.matchAll(
    /<script type="application\/ld\+json">(.*?)<\/script>/gs,
  ))
    assert.equal(JSON.parse(match[1])['@type'], 'MovingCompany');
  for (const match of html.matchAll(/(?:href|src)="([^"<>]+)"/g)) {
    const href = match[1];
    if (!href.startsWith('/') && !href.startsWith('#')) continue;
    const current = file.endsWith('/index.html')
      ? file.slice(root.length, -10)
      : file.slice(root.length);
    const url = new URL(href, `https://preview.invalid${current}`);
    let path = join(root, decodeURIComponent(url.pathname));
    try {
      if ((await stat(path)).isDirectory()) path = join(path, 'index.html');
      await stat(path);
    } catch {
      assert.fail(`${file}: broken local link ${href}`);
    }
    if (url.hash) {
      const target = contents.get(path) || (await readFile(path, 'utf8'));
      assert.ok(
        target.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),
        `${file}: broken anchor ${href}`,
      );
    }
    links++;
  }
}
const sitemap = await readFile(join(root, 'sitemap.xml'), 'utf8');
if (publicationReady) {
  assert.match(sitemap, /<loc>/, 'Published sitemap must list public URLs');
} else {
  assert.doesNotMatch(
    sitemap,
    /<loc>/,
    'Unconfigured preview sitemap must be empty',
  );
}
console.log(
  `PASS: ${htmlFiles.length} pages, ${links} internal links/assets, titles, descriptions, headings, JSON-LD, ${publicationReady ? 'publication index' : 'noindex'} and public-content checks.`,
);
