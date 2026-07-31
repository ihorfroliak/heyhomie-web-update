/**
 * Static content for the /cleaning scope sections (what's included, what we don't do,
 * fragile disclosure, other services). Source: the cleaning design canvas, aligned to
 * heyhomie-shared/DOMAIN_RULES.md §9–§12. Copy is PL-first; step 4 moves the strings
 * into next-intl messages.
 */

/** §12 — per-room scope summary. std = always/standard tasks, gen = full general count. */
export const ROOM_CARDS = [
    { room: 'W całym mieszkaniu', std: 13, gen: 22, sample: 'Podłogi, kurz, fronty szaf, drzwi i klamki, lustra, włączniki, kosze.' },
    { room: 'Kuchnia', std: 9, gen: 17, sample: 'Blaty, zlew i bateria, płyta i płytki nad blatem, AGD z zewnątrz — a w generalnym wnętrza AGD i szafki.' },
    { room: 'Łazienka', std: 7, gen: 12, sample: 'WC, kabina, wanna, umywalka i lustra — w generalnym fugi, kamień i szafki w środku.' },
    { room: 'Sypialnia', std: 3, gen: 6, sample: 'Szafy i biurko, pościel na życzenie, parapety — w generalnym wnętrza szaf i lustra.' },
];

export const TOTAL_TASKS = '73 pozycje';

/** §9 — what we don't do. `tag` set only when a paid work-around exists. */
export const EXCLUSIONS = [
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
];

/** §8 — fragile items the customer can flag before the visit. */
export const FRAGILE = ['Kamień naturalny', 'Mosiądz / miedź bez powłoki', 'Antyki', 'Sprzęt już uszkodzony', 'Parkiet bez lakieru', 'Sprzęt AGD z usterką'];

export const FRAGILE_PLACEHOLDER = 'Np. „Bateria w łazience z nieszkliwionego mosiądzu — proszę tylko przetrzeć wodą”.';
export const FRAGILE_NOTE = 'Każde sprzątanie jest ubezpieczone. Zgłoszone wcześniej uszkodzenia zapisujemy w zleceniu razem ze zdjęciem, jeśli je dodasz.';

/** §11 — other services (separate pricing). */
export const OTHER_SERVICES = [
    { id: 'upholstery', name: 'Czyszczenie tapicerki', price: 'od 199 zł', unit: '/ mebel' },
    { id: 'kitchen', name: 'Generalne kuchni', price: 'od 249 zł', unit: '' },
    { id: 'bath', name: 'Generalne łazienki', price: 'od 219 zł', unit: '' },
    { id: 'windows', name: 'Mycie okien', price: 'od 25 zł', unit: '/ skrzydło' },
    { id: 'office', name: 'Sprzątanie biur', price: 'wycena', unit: '' },
];
