import { cityDistricts, seoCitiesOrder, getCitySeoForms } from '../components/serviceLanding/cleaning/cityDistricts';

// The six supported cities are a fixed constraint (CLAUDE.md). If this list ever
// changes, the routing, sitemap and cross-linking assumptions change with it.
const CITIES = ['krakow', 'warsaw', 'wroclaw', 'poznan', 'katowice', 'rzeszow'];

describe('city dataset', () => {
    it('covers exactly the six supported cities', () => {
        expect(Object.keys(cityDistricts).sort()).toEqual([...CITIES].sort());
        expect([...seoCitiesOrder].sort()).toEqual([...CITIES].sort());
    });

    it.each(CITIES)('%s has districts, streets and both name forms', city => {
        const data = cityDistricts[city];
        expect(data.nameNominative).toBeTruthy();
        expect(data.nameEn).toBeTruthy();
        expect(data.locativePl).toBeTruthy();
        expect(data.districts.length).toBeGreaterThan(0);
        expect(data.keyStreets.length).toBeGreaterThan(0);
    });

    it('leads with Krakow, the priority SEO city', () => {
        expect(seoCitiesOrder[0]).toBe('krakow');
    });
});

describe('getCitySeoForms — Polish locative', () => {
    // Polish city names decline. Concatenating a nominative into a sentence
    // produces "sprzatanie Krakow", which reads as broken Polish to a native
    // speaker and to the search engine.
    it.each([
        ['krakow', 'w Krakowie'],
        ['warsaw', 'w Warszawie'],
        ['poznan', 'w Poznaniu'],
        ['katowice', 'w Katowicach'],
        ['rzeszow', 'w Rzeszowie'],
    ])('%s uses the "w" locative', (city, expected) => {
        expect(getCitySeoForms(city, true).locative).toBe(expected);
    });

    it('uses "we" before Wroclaw, not "w"', () => {
        // Polish takes "we" before consonant clusters like "Wr-".
        expect(getCitySeoForms('wroclaw', true).locative).toBe('we Wrocławiu');
    });

    it('builds English locatives from the English name', () => {
        expect(getCitySeoForms('warsaw', false).locative).toBe('in Warsaw');
        expect(getCitySeoForms('warsaw', false).displayName).toBe('Warsaw');
    });

    it('falls back safely for a city the dataset does not know', () => {
        // The city list comes from the API at request time, so it can outrun
        // this dataset. That must degrade, not crash.
        const pl = getCitySeoForms('gdansk', true);
        expect(pl.data).toBeNull();
        expect(pl.locative).toBe('w mieście Gdansk');
        expect(pl.streets).toBe('');

        expect(getCitySeoForms(undefined, true).data).toBeNull();
    });
});

describe('key streets', () => {
    it('gives each city its own streets, never another city’s', () => {
        const krakow = getCitySeoForms('krakow', true).streets;
        const warsaw = getCitySeoForms('warsaw', true).streets;

        expect(krakow).toContain('Floriańska');
        expect(warsaw).toContain('Marszałkowska');
        expect(krakow).not.toContain('Marszałkowska');
    });

    it('keeps Polish spelling in the English locale too', () => {
        // Street and district names are proper nouns and the literal strings
        // people type into search — they are not translated or transliterated.
        expect(getCitySeoForms('krakow', false).streets).toContain('Floriańska');
        expect(cityDistricts.krakow.districts).toContain('Prądnik Czerwony');
    });
});
