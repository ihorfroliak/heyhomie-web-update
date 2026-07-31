/**
 * Bilingual copy for the /cleaning calculator + scope sections (pl / en).
 *
 * WHY a co-located dictionary instead of next-intl messages: messages/{pl,en}.json are
 * under heavy active edit (SEO content); adding keys there would intermingle with that
 * work and could not be committed in isolation. This keeps the calculator copy separate
 * and cleanly committable, while still bilingual. MIGRATION: once the messages WIP lands,
 * move these under `ServicesLandings.CleaningLanding.Calculator/Scope` and swap
 * `useCleaningCopy()` for `useTranslations(...)`.
 */
import { useRouter } from 'next/router';

const COPY = {
    pl: {
        calc: {
            title: 'Kalkulator sprzątania',
            s1: 'Rozmiar mieszkania',
            rooms: 'Pokoje',
            baths: 'Łazienki',
            kitchenNote: 'Kuchnia i przedpokój są zawsze w cenie — nie trzeba ich zaznaczać. Drugą kuchnię dopisz w uwagach, doliczymy ją ręcznie.',
            s2: 'Jak często?',
            freq: { once: 'Jednorazowo', weekly: 'Co tydzień', biweekly: 'Co 2 tyg.', monthly: 'Co miesiąc' },
            s3: 'Rodzaj sprzątania',
            type: {
                standard: { label: 'Standardowe', meta: 'regularna czystość, bez wnętrz AGD' },
                general: { label: 'Generalne', meta: 'z wnętrzami AGD, fugami i szafkami' },
            },
            s4: 'Metraż',
            areaNote: 'Metraż nie zmienia ceny — cena zależy od liczby pomieszczeń. Podajesz go, żeby homie wiedział, ile środków i czasu zabrać.',
            s5: 'Opcje dodatkowe',
            generalHint: n => `${n} opcje — reszta w cenie`,
            addon: {
                oven: ['Piekarnik w środku', ''],
                fridge: ['Lodówka w środku', ''],
                hood: ['Okap z filtrami', ''],
                cabinets: ['Szafki w środku', ''],
                microwave: ['Mikrofalówka w środku', ''],
                bins: ['Kosze na śmieci', ''],
                balcony: ['Balkon lub taras', ''],
                windows: ['Mycie okien', 'skrzydło'],
                ironing: ['Prasowanie', 'godzinę'],
                hours: ['Dodatkowa godzina', 'godzinę'],
            },
            s6: 'O obiekcie',
            s6note: 'To nie zakupy — to informacje, które zmieniają sposób pracy homie.',
            pets: 'Zwierzęta w domu',
            petsNote: 'Cena bez zmian — homie po prostu wie, na co uważać.',
            gear: 'Odkurzacz, mop i wiadro na miejscu',
            gearNoteStd: 'Nie masz? Homie przywiezie swój — +15 zł do standardowego jednorazowego.',
            gearNoteGen: 'Do generalnego zawsze wozimy sprzęt bezpłatnie.',
            line: { base: 'Kuchnia + przedpokój', rooms: 'Pokoje', baths: 'Łazienki', gear: 'Sprzęt na miejscu', discount: 'Rabat' },
            priceCaption: 'Cena za wizytę',
            time: 'Czas na miejscu',
            crew: n => `${n} ${n === 1 ? 'homie' : 'homies'}`,
            cta: 'Wybierz termin →',
            footnote: 'Płatność zawsze po wykonanej usłudze. Fakturę na firmę (NIP) wybierzesz w kolejnym kroku.',
        },
        hero: {
            breadcrumb: ['HeyHomie', 'Kraków', 'Sprzątanie mieszkań'],
            title: 'Sprzątanie mieszkań i domów',
            sub: 'Wybierz rozmiar, częstotliwość i rodzaj sprzątania — cena i czas przeliczają się na bieżąco. Płacisz dzień po wizycie, odwołanie do 24 h przed jest bezpłatne.',
            promises: [
                ['Płatność po usłudze', 'Nic nie pobieramy przy rezerwacji — płacisz dzień po wizycie.'],
                ['Bezpłatne odwołanie', 'Odwołaj lub przełóż do 24 h przed terminem bez opłat.'],
                ['Ubezpieczone sprzątanie', 'Każda wizyta jest objęta ubezpieczeniem.'],
                ['Uczciwy zakres', 'Mówimy wprost, czego nie robimy — przed rezerwacją, nie w regulaminie.'],
            ],
        },
        scope: {
            includedTitle: 'Co robimy w każdym pomieszczeniu',
            includedLead:
                'Pełna lista 73 pozycji — bez „i inne prace porządkowe”. W generalnym dochodzą wnętrza AGD, fugi i szafki; część pozycji jest dopłatą w standardowym, a w generalnym w cenie.',
            openChecklist: 'Otwórz pełny checklist →',
            std: 'standardowe',
            gen: 'generalne',
            exclusionsTitle: 'Czego nie robimy',
            exclusionsLead: 'Mówimy o tym wprost przed rezerwacją, a nie w regulaminie. Część prac możemy wykonać osobno — jak, napisane jest przy każdej.',
            fragileTitle: 'Rzeczy wymagające szczególnej ostrożności',
            fragileLead:
                'Naturalny kamień, mosiądz bez powłoki, antyki i sprzęt, który już jest uszkodzony, wymagają innych środków niż reszta domu — albo pominięcia. Zaznacz je przy rezerwacji: homie dostanie tę informację przed wejściem, a Ty masz to udokumentowane.',
            fragilePanelTitle: 'Zgłoś przed sprzątaniem',
            othersTitle: 'HeyHomie robi też',
            othersLead: 'Osobne usługi — możesz zamówić je razem ze sprzątaniem albo pojedynczo.',
            allServices: 'Wszystkie usługi →',
        },
    },
    en: {
        calc: {
            title: 'Cleaning calculator',
            s1: 'Home size',
            rooms: 'Rooms',
            baths: 'Bathrooms',
            kitchenNote: 'Kitchen and hallway are always included — no need to select them. Add a second kitchen in the notes and we will price it by hand.',
            s2: 'How often?',
            freq: { once: 'One-off', weekly: 'Weekly', biweekly: 'Every 2 wks', monthly: 'Monthly' },
            s3: 'Cleaning type',
            type: {
                standard: { label: 'Standard', meta: 'regular clean, no appliance interiors' },
                general: { label: 'General', meta: 'with appliance interiors, grout and cabinets' },
            },
            s4: 'Area',
            areaNote:
                'Area does not change the price — the price depends on the number of rooms. You give it so the homie knows how much time and supplies to bring.',
            s5: 'Add-ons',
            generalHint: n => `${n} options — the rest is included`,
            addon: {
                oven: ['Oven inside', ''],
                fridge: ['Fridge inside', ''],
                hood: ['Range hood + filters', ''],
                cabinets: ['Cabinets inside', ''],
                microwave: ['Microwave inside', ''],
                bins: ['Bins cleaned', ''],
                balcony: ['Balcony or terrace', ''],
                windows: ['Window washing', 'sash'],
                ironing: ['Ironing', 'hour'],
                hours: ['Extra hour', 'hour'],
            },
            s6: 'About the place',
            s6note: 'These are not purchases — they are facts that change how the homie works.',
            pets: 'Pets at home',
            petsNote: 'Price unchanged — the homie simply knows what to watch for.',
            gear: 'Vacuum, mop and bucket on site',
            gearNoteStd: "Don't have them? The homie brings their own — +15 zł on a standard one-off.",
            gearNoteGen: 'For a general clean we always bring the gear for free.',
            line: { base: 'Kitchen + hallway', rooms: 'Rooms', baths: 'Bathrooms', gear: 'Gear on site', discount: 'Discount' },
            priceCaption: 'Price per visit',
            time: 'Time on site',
            crew: n => `${n} ${n === 1 ? 'homie' : 'homies'}`,
            cta: 'Pick a date →',
            footnote: 'Always pay after the service. A company invoice (VAT ID) can be chosen in the next step.',
        },
        hero: {
            breadcrumb: ['HeyHomie', 'Kraków', 'Home cleaning'],
            title: 'Home and apartment cleaning',
            sub: 'Pick the size, frequency and type of clean — the price and time recalculate live. You pay the day after the visit; cancelling up to 24 h before is free.',
            promises: [
                ['Pay after the service', 'We charge nothing at booking — you pay the day after the visit.'],
                ['Free cancellation', 'Cancel or reschedule up to 24 h before, at no cost.'],
                ['Insured cleaning', 'Every visit is covered by insurance.'],
                ['Honest scope', 'We say plainly what we do not do — before booking, not in the terms.'],
            ],
        },
        scope: {
            includedTitle: 'What we do in every room',
            includedLead:
                'The full 73-item list — no “and other tidying”. A general clean adds appliance interiors, grout and cabinets; some items are an add-on on standard and included on general.',
            openChecklist: 'Open the full checklist →',
            std: 'standard',
            gen: 'general',
            exclusionsTitle: 'What we don’t do',
            exclusionsLead: 'We say it plainly before booking, not in the terms. A few of these we can do separately — how, is written next to each.',
            fragileTitle: 'Items needing special care',
            fragileLead:
                'Natural stone, uncoated brass, antiques and already-damaged items need different products than the rest of the home — or skipping. Flag them at booking: the homie gets the note before entering, and you have it documented.',
            fragilePanelTitle: 'Flag before the clean',
            othersTitle: 'HeyHomie also does',
            othersLead: 'Separate services — order them together with a clean or on their own.',
            allServices: 'All services →',
        },
    },
};

/** Locale-aware copy for the cleaning page. Falls back to pl (the default locale). */
export function useCleaningCopy() {
    const { locale } = useRouter();
    return COPY[locale] || COPY.pl;
}

export default COPY;
