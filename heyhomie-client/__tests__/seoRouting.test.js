import { localizedUrl, buildSitemap } from '../pages/sitemap.xml';
import { stripMarkup } from '../components/serviceLanding/cleaning/CleaningSeoSection';

// The URL architecture is a fixed constraint (CLAUDE.md): Polish is served
// unprefixed, English under /en, and there is no /pl/ prefix. A regression here
// silently changes every canonical and hreflang the site emits.
describe('localised URLs', () => {
    it('serves Polish without a locale prefix', () => {
        expect(localizedUrl('pl', 'krakow')).toBe('https://www.heyhomie.io/krakow');
        expect(localizedUrl('pl', 'cleaning')).toBe('https://www.heyhomie.io/cleaning');
    });

    it('serves English under /en', () => {
        expect(localizedUrl('en', 'krakow')).toBe('https://www.heyhomie.io/en/krakow');
    });

    it('never emits a /pl/ prefix', () => {
        expect(localizedUrl('pl', 'krakow')).not.toContain('/pl/');
    });

    it('handles the root path for both locales', () => {
        expect(localizedUrl('pl', '')).toBe('https://www.heyhomie.io');
        expect(localizedUrl('en', '')).toBe('https://www.heyhomie.io/en');
    });
});

describe('sitemap', () => {
    const xml = buildSitemap(['', 'cleaning', 'krakow']);

    it('is a well-formed urlset with one entry per path', () => {
        expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
        expect(xml).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
        expect((xml.match(/<url>/g) || []).length).toBe(3);
    });

    it('points <loc> at the Polish URL and lists both locales as alternates', () => {
        expect(xml).toContain('<loc>https://www.heyhomie.io/krakow</loc>');
        expect(xml).toContain('hreflang="pl" href="https://www.heyhomie.io/krakow"');
        expect(xml).toContain('hreflang="en" href="https://www.heyhomie.io/en/krakow"');
    });
});

describe('stripMarkup — plain text for JSON-LD', () => {
    // FAQ answers carry a markdown-lite the renderer understands. schema.org
    // wants plain text; leaking ** or [](...) into the FAQPage entity is
    // invisible on the page but invalidates the rich result.
    it('unwraps bold', () => {
        expect(stripMarkup('Windows are **a separate add-on**.')).toBe('Windows are a separate add-on.');
    });

    it('keeps link text and drops the target', () => {
        expect(stripMarkup('Press [Book now](#order) to start.')).toBe('Press Book now to start.');
    });

    it('flattens support notes onto one line', () => {
        expect(stripMarkup('Leave the keys.\n» Tell support first.')).toBe('Leave the keys. Tell support first.');
    });

    it('leaves plain answers untouched', () => {
        expect(stripMarkup('Yes, we clean every district.')).toBe('Yes, we clean every district.');
    });

    it('removes every marker when several appear together', () => {
        const out = stripMarkup('**Three** options: see [pricing](#order).\n» Ask support.');

        expect(out).not.toMatch(/\*\*|\[|\]\(|»|\n/);
    });
});
