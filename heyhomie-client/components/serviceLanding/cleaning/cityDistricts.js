/**
 * City data for the cleaning SEO section.
 *
 * Districts are proper nouns and stay identical in PL and EN, so they live here
 * as plain strings instead of i18n keys. Polish copy needs the locative case
 * ("w Krakowie", "we Wrocławiu"), so each city carries its inflected form.
 *
 * `seoCitiesOrder` drives the priority of the cross-linking block — Kraków first,
 * then Warszawa, Poznań, Wrocław, and the rest.
 */
export const cityDistricts = {
    krakow: {
        nameNominative: 'Kraków',
        nameEn: 'Kraków',
        locativePl: 'w Krakowie',
        districts: [
            'Stare Miasto',
            'Kazimierz',
            'Podgórze',
            'Grzegórzki',
            'Krowodrza',
            'Prądnik Czerwony',
            'Prądnik Biały',
            'Bronowice',
            'Zwierzyniec',
            'Salwator',
            'Dębniki',
            'Ruczaj',
            'Łagiewniki',
            'Borek Fałęcki',
            'Swoszowice',
            'Bieżanów',
            'Prokocim',
            'Czyżyny',
            'Mistrzejowice',
            'Bieńczyce',
            'Zabłocie',
            'Nowa Huta',
        ],
    },
    warsaw: {
        nameNominative: 'Warszawa',
        nameEn: 'Warsaw',
        locativePl: 'w Warszawie',
        districts: [
            'Śródmieście',
            'Mokotów',
            'Wola',
            'Praga-Południe',
            'Praga-Północ',
            'Ochota',
            'Żoliborz',
            'Bielany',
            'Bemowo',
            'Ursynów',
            'Wilanów',
            'Włochy',
            'Ursus',
            'Targówek',
            'Białołęka',
            'Wawer',
        ],
    },
    poznan: {
        nameNominative: 'Poznań',
        nameEn: 'Poznań',
        locativePl: 'w Poznaniu',
        districts: [
            'Stare Miasto',
            'Nowe Miasto',
            'Grunwald',
            'Jeżyce',
            'Wilda',
            'Łazarz',
            'Sołacz',
            'Winogrady',
            'Rataje',
            'Naramowice',
        ],
    },
    wroclaw: {
        nameNominative: 'Wrocław',
        nameEn: 'Wrocław',
        locativePl: 'we Wrocławiu',
        districts: [
            'Stare Miasto',
            'Śródmieście',
            'Krzyki',
            'Fabryczna',
            'Psie Pole',
            'Nadodrze',
            'Sępolno',
            'Biskupin',
            'Ołbin',
            'Gaj',
        ],
    },
    katowice: {
        nameNominative: 'Katowice',
        nameEn: 'Katowice',
        locativePl: 'w Katowicach',
        districts: [
            'Śródmieście',
            'Ligota',
            'Brynów',
            'Załęże',
            'Koszutka',
            'Dąb',
            'Bogucice',
            'Giszowiec',
            'Nikiszowiec',
            'Piotrowice',
        ],
    },
    rzeszow: {
        nameNominative: 'Rzeszów',
        nameEn: 'Rzeszów',
        locativePl: 'w Rzeszowie',
        districts: [
            'Śródmieście',
            'Nowe Miasto',
            'Baranówka',
            'Drabinianka',
            'Pobitno',
            'Staromieście',
            'Krakowska-Południe',
        ],
    },
};

export const seoCitiesOrder = ['krakow', 'warsaw', 'poznan', 'wroclaw', 'katowice', 'rzeszow'];

const capitalize = str => (str ? str.charAt(0).toUpperCase() + str.slice(1) : '');

/**
 * Resolves the display name + Polish locative ("w Krakowie") for a city key,
 * with a safe fallback for cities not yet in the dataset. Shared by the SEO
 * section and the city-page <head> so both stay in sync.
 */
export const getCitySeoForms = (cityName, isPl) => {
    const data = cityName ? cityDistricts[cityName] : null;

    let displayName = capitalize(cityName);
    let locative = isPl ? `w mieście ${displayName}` : `in ${displayName}`;

    if (data) {
        displayName = isPl ? data.nameNominative : data.nameEn;
        locative = isPl ? data.locativePl : `in ${data.nameEn}`;
    }

    return { data, displayName, locative };
};
