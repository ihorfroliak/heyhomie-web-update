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
            rooms: [
                { name: 'W całym mieszkaniu', sample: 'Podłogi, kurz, fronty szaf, drzwi i klamki, lustra, włączniki, kosze.' },
                { name: 'Kuchnia', sample: 'Blaty, zlew i bateria, płyta i płytki nad blatem, AGD z zewnątrz — a w generalnym wnętrza AGD i szafki.' },
                { name: 'Łazienka', sample: 'WC, kabina, wanna, umywalka i lustra — w generalnym fugi, kamień i szafki w środku.' },
                { name: 'Sypialnia', sample: 'Szafy i biurko, pościel na życzenie, parapety — w generalnym wnętrza szaf i lustra.' },
            ],
            exclusions: [
                {
                    title: 'Nie przenosimy mebli',
                    body: 'Sprzątamy dookoła i pod tym, co da się podnieść jedną ręką. Przesuwanie szaf i kanap to ryzyko dla podłogi i dla kręgosłupa homie.',
                    tag: '',
                },
                {
                    title: 'Nie czyścimy rolet i żaluzji',
                    body: 'Lamele łatwo wygiąć, a mechanizmu nie da się naprawić na miejscu. Odkurzamy je z zewnątrz, gdy są zamknięte.',
                    tag: '',
                },
                { title: 'Nie myjemy żyrandoli', body: 'Wszystko powyżej 3 m i wszystko, co wymaga demontażu, zostaje. Dostępne lampy przecieramy.', tag: '' },
                { title: 'Nie myjemy sufitów', body: 'Usuwamy pajęczyny z narożników, ale sufit jako powierzchnia nie wchodzi w żadną z usług.', tag: '' },
                {
                    title: 'Nie myjemy klatki schodowej',
                    body: 'Możemy to zrobić po ustaleniu: wybierz „dodatkową godzinę” i dopisz w uwadze, o co chodzi, albo napisz do wsparcia.',
                    tag: 'możliwe po ustaleniu',
                },
                {
                    title: 'Nie dezynfekujemy pomieszczeń',
                    body: 'Dezynfekcję pojedynczych elementów — na przykład wnętrza lodówki — wykonujemy po zgłoszeniu we wsparciu.',
                    tag: 'możliwe po ustaleniu',
                },
            ],
            fragile: ['Kamień naturalny', 'Mosiądz / miedź bez powłoki', 'Antyki', 'Sprzęt już uszkodzony', 'Parkiet bez lakieru', 'Sprzęt AGD z usterką'],
            fragilePlaceholder: 'Np. „Bateria w łazience z nieszkliwionego mosiądzu — proszę tylko przetrzeć wodą”.',
            fragileNote: 'Każde sprzątanie jest ubezpieczone. Zgłoszone wcześniej uszkodzenia zapisujemy w zleceniu razem ze zdjęciem, jeśli je dodasz.',
            services: {
                from: 'od',
                zl: 'zł',
                quote: 'wycena',
                units: { item: '/ mebel', sash: '/ skrzydło' },
                names: {
                    upholstery: 'Czyszczenie tapicerki',
                    kitchen: 'Generalne kuchni',
                    bath: 'Generalne łazienki',
                    windows: 'Mycie okien',
                    office: 'Sprzątanie biur',
                },
            },
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
            rooms: [
                { name: 'Whole apartment', sample: 'Floors, dust, cabinet fronts, doors and handles, mirrors, switches, bins.' },
                {
                    name: 'Kitchen',
                    sample: 'Countertops, sink and tap, hob and splashback tiles, appliances outside — and on a general clean the appliance interiors and cabinets.',
                },
                { name: 'Bathroom', sample: 'Toilet, shower, bathtub, basin and mirrors — on a general clean grout, limescale and cabinets inside.' },
                { name: 'Bedroom', sample: 'Wardrobes and desk, bedding on request, window sills — on a general clean wardrobe interiors and mirrors.' },
            ],
            exclusions: [
                {
                    title: 'We don’t move furniture',
                    body: 'We clean around and under whatever lifts with one hand. Sliding wardrobes and sofas risks the floor and the homie’s back.',
                    tag: '',
                },
                {
                    title: 'We don’t clean blinds or shutters',
                    body: 'Slats bend easily and the mechanism can’t be fixed on site. We vacuum them from the outside when closed.',
                    tag: '',
                },
                { title: 'We don’t wash chandeliers', body: 'Anything above 3 m or needing disassembly stays. We wipe reachable lamps.', tag: '' },
                { title: 'We don’t wash ceilings', body: 'We remove cobwebs from corners, but the ceiling as a surface isn’t part of any service.', tag: '' },
                {
                    title: 'We don’t clean the stairwell',
                    body: 'We can do it by arrangement: pick “extra hour” and note what’s needed, or message support.',
                    tag: 'possible on request',
                },
                {
                    title: 'We don’t disinfect whole rooms',
                    body: 'Disinfecting single items — the fridge interior, say — we do on request via support.',
                    tag: 'possible on request',
                },
            ],
            fragile: ['Natural stone', 'Uncoated brass / copper', 'Antiques', 'Already-damaged items', 'Unlacquered parquet', 'Faulty appliances'],
            fragilePlaceholder: 'E.g. “Bathroom tap in unglazed brass — please just wipe with water.”',
            fragileNote: 'Every clean is insured. Pre-declared damage is logged on the order together with a photo if you add one.',
            services: {
                from: 'from',
                zl: 'zł',
                quote: 'quote',
                units: { item: '/ item', sash: '/ sash' },
                names: {
                    upholstery: 'Upholstery cleaning',
                    kitchen: 'Kitchen deep clean',
                    bath: 'Bathroom deep clean',
                    windows: 'Window washing',
                    office: 'Office cleaning',
                },
            },
        },
    },
};

/** Locale-aware copy for the cleaning page. Falls back to pl (the default locale). */
export function useCleaningCopy() {
    const { locale } = useRouter();
    return COPY[locale] || COPY.pl;
}

export default COPY;
