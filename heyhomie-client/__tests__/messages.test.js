import fs from 'fs';
import path from 'path';

const load = locale => JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'messages', `${locale}.json`), 'utf8'));

const pl = load('pl');
const en = load('en');

const flatten = (node, prefix = '') =>
    Object.entries(node).reduce((acc, [key, value]) => {
        const full = prefix ? `${prefix}.${key}` : key;
        return value && typeof value === 'object' && !Array.isArray(value) ? [...acc, ...flatten(value, full)] : [...acc, full];
    }, []);

// [full.dotted.path, value] for every string leaf.
const values = (node, prefix = '') =>
    Object.entries(node).reduce((acc, [key, value]) => {
        const full = prefix ? `${prefix}.${key}` : key;
        if (value && typeof value === 'object' && !Array.isArray(value)) return [...acc, ...values(value, full)];
        if (typeof value === 'string') return [...acc, [full, value]];
        return acc;
    }, []);

// These values are deliberately raw HTML: each is passed to dangerouslySetInnerHTML
// rather than through the next-intl formatter, so tags in them are correct. Anything
// NOT on this list must stay tag-free — the formatter reads < > as tag syntax and
// throws at render, taking the page down.
const RAW_HTML_VALUES = [
    /^CityPage\.ServiceGeneral\.\w+\.headerCopy$/, // ServicesSlider
    /^CityPage\.ServiceConfig\.\w+_additionalOptionsInfo$/, // pages/[city].js
    /^UtilsPages\.AboutPage\.whoAreWe__text$/, // pages/about.js
    /^ServicesLandings\.\w+\.descriptionHTML$/, // service landings
    /^ServicesLandings\.\w+\.faq\.answer_\d+$/, // FAQSection
    /^ServicesLandings\.CleaningLanding\.cleaningPlans\.notes\.\w+$/, // pages/cleaning.js
];

const isRawHtmlValue = path => RAW_HTML_VALUES.some(pattern => pattern.test(path));

describe('PL/EN catalogue parity', () => {
    // next-intl throws at render time on a missing key, so a key added to one
    // locale and not the other is a production error on that locale only —
    // exactly the kind that survives a Polish-only smoke test.
    it('has identical key sets in both locales', () => {
        const plKeys = flatten(pl).sort();
        const enKeys = flatten(en).sort();

        expect(plKeys.filter(k => !enKeys.includes(k))).toEqual([]);
        expect(enKeys.filter(k => !plKeys.includes(k))).toEqual([]);
    });
});

describe('message values are safe for intl-messageformat', () => {
    // intl-messageformat parses < > as tag syntax. A raw tag in a value throws
    // at render, taking the whole page down rather than degrading.
    it.each([
        ['pl', pl],
        ['en', en],
    ])('%s has no HTML tags outside the raw-HTML allowlist', (locale, catalogue) => {
        const offenders = values(catalogue)
            .filter(([path]) => !isRawHtmlValue(path))
            .filter(([, value]) => /<[a-zA-Z/]/.test(value))
            .map(([path]) => path);

        expect(offenders).toEqual([]);
    });

    it.each([
        ['pl', pl],
        ['en', en],
    ])('%s still uses every raw-HTML allowlist entry', (locale, catalogue) => {
        // Keeps the allowlist honest: once a legacy value is rewritten to be
        // tag-free, its pattern should be deleted rather than left behind to
        // silently permit new HTML at that path.
        const unused = RAW_HTML_VALUES.filter(pattern => !values(catalogue).some(([path]) => pattern.test(path)));

        expect(unused).toEqual([]);
    });

    it.each([
        ['pl', pl],
        ['en', en],
    ])('%s has balanced interpolation braces', (locale, catalogue) => {
        const offenders = values(catalogue)
            .filter(([, value]) => (value.match(/{/g) || []).length !== (value.match(/}/g) || []).length)
            .map(([key]) => key);

        expect(offenders).toEqual([]);
    });
});

describe('brand copy rules', () => {
    // "Homies" is the brand term for our cleaners and is always capitalised in
    // user-facing copy. "Heyhomie.io" is the product name and is left alone.
    it.each([
        ['pl', pl],
        ['en', en],
    ])('%s never lowercases the Homies brand word', (locale, catalogue) => {
        const offenders = values(catalogue)
            .filter(([, value]) => /(?<![A-Za-z.])homies?\b/.test(value))
            .map(([key, value]) => `${key}: ${value.slice(0, 60)}`);

        expect(offenders).toEqual([]);
    });
});

describe('cleaning FAQ', () => {
    const faq = locale => locale.CleaningSeoSection.faq;

    it('pairs every question with an answer, in both locales', () => {
        [pl, en].forEach(catalogue => {
            const questions = Object.keys(faq(catalogue)).filter(k => /^q\d+$/.test(k));
            const answers = Object.keys(faq(catalogue)).filter(k => /^a\d+$/.test(k));

            expect(questions.length).toBe(answers.length);
            questions.forEach(q => expect(faq(catalogue)[q.replace('q', 'a')]).toBeTruthy());
        });
    });

    it('numbers questions contiguously from 1, so none is silently dropped', () => {
        // The component renders a fixed FAQ_KEYS range; a gap in the catalogue
        // would make next-intl throw for the missing index.
        const numbers = Object.keys(faq(pl))
            .filter(k => /^q\d+$/.test(k))
            .map(k => Number(k.slice(1)))
            .sort((a, b) => a - b);

        expect(numbers).toEqual(Array.from({ length: numbers.length }, (unused, i) => i + 1));
    });

    it('states that window cleaning is a separate add-on', () => {
        // A correction the client asked for: general cleaning covers what is
        // inside (oven, fridge, hood, cabinets) but NOT windows.
        expect(faq(pl).a2).toMatch(/osobna opcja dodatkowa/i);
        expect(faq(en).a2).toMatch(/separate add-on/i);
    });
});
