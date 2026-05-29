import https from 'https';
import http from 'http';

const SITEMAP_URL = 'https://adinovaestudio.com/sitemap.xml';

const pings = [
  { name: 'Google (legacy)', url: `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}` },
  { name: 'Bing (legacy)', url: `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}` },
];

async function ping({ name, url }) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const opts = { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AdinovaBot/1.0)' } };
    const req = client.get(url, opts, (res) => {
      let body = '';
      res.on('data', (c) => { body += c; });
      res.on('end', () => {
        const ok = res.statusCode >= 200 && res.statusCode < 300;
        console.log(`  ${ok ? '✓' : '✗'} ${name}: ${res.statusCode}${ok ? '' : ' — ' + body.slice(0, 120)}`);
        resolve(ok);
      });
    });
    req.on('error', (e) => {
      console.log(`  ✗ ${name}: ERROR — ${e.message}`);
      resolve(false);
    });
  });
}

console.log('');
console.log('=== Notificar sitemap a buscadores ===');
console.log(`Sitemap: ${SITEMAP_URL}`);
console.log('');

const results = await Promise.all(pings.map(ping));

console.log('');

const anyOk = results.some(Boolean);
if (!anyOk) {
  console.log('⚠ Los endpoints legacy de ping están deprecados.');
  console.log('');
  console.log('✅ Google Search Console (manual):');
  console.log('   https://search.google.com/search-console/sitemaps?resource_id=https://adinovaestudio.com/');
  console.log('');
  console.log('✅ Bing Webmaster Tools (manual, requiere registro gratis):');
  console.log('   https://www.bing.com/webmasters');
  console.log('');
  console.log('📌 El sitemap también se descubre automáticamente vía robots.txt al rastrear el sitio.');
}
