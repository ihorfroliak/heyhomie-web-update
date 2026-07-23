import { BASE_URL } from '../api/url';

const DOMAIN = 'https://www.heyhomie.io';
const LOCALES = ['pl', 'en'];
const DEFAULT_LOCALE = 'pl';

// Static, indexable routes (no locale prefix here — added per-locale below).
const STATIC_PATHS = ['', 'cleaning', 'flowers', 'massage', 'about', 'privacy', 'terms_conditions'];

// Polish (default locale) is served without a prefix; other locales are prefixed.
const localizedUrl = (locale, path) => {
    const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`;
    const suffix = path ? `/${path}` : '';
    return `${DOMAIN}${prefix}${suffix}` || `${DOMAIN}/`;
};

const urlEntry = path => {
    const alternates = LOCALES.map(locale => `        <xhtml:link rel="alternate" hreflang="${locale}" href="${localizedUrl(locale, path)}" />`).join('\n');

    return `    <url>
        <loc>${localizedUrl(DEFAULT_LOCALE, path)}</loc>
${alternates}
    </url>`;
};

const buildSitemap = paths => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${paths.map(urlEntry).join('\n')}
</urlset>`;

function SiteMap() {
    // getServerSideProps writes the response directly.
    return null;
}

export async function getServerSideProps({ res }) {
    let cityPaths = [];

    try {
        const resCities = await fetch(`${BASE_URL}api/v1/cities`);
        const { cities } = await resCities.json();
        cityPaths = (cities || []).map(c => c.name);
    } catch (err) {
        console.error('sitemap: failed to fetch cities', err);
    }

    const paths = [...STATIC_PATHS, ...cityPaths];

    res.setHeader('Content-Type', 'text/xml');
    res.write(buildSitemap(paths));
    res.end();

    return { props: {} };
}

export default SiteMap;
