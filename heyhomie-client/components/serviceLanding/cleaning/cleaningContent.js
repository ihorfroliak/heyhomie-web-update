/**
 * Structural data for the /cleaning scope sections — NUMBERS + ids only. All TEXT
 * (pl/en) lives in ./cleaningCopy under `scope`, index-aligned with these arrays.
 * Source: the cleaning design canvas, aligned to heyhomie-shared/DOMAIN_RULES.md §11–§12.
 */

/** §12 — per-room scope counts. Aligned with copy `scope.rooms`. std = always/standard
 *  tasks; gen = the full general count. */
export const ROOM_COUNTS = [
    { std: 13, gen: 22 }, // whole apartment
    { std: 9, gen: 17 }, // kitchen
    { std: 7, gen: 12 }, // bathroom
    { std: 3, gen: 6 }, // bedroom
];

/** §11 — other services: price amount (PLN) + optional unit key. `amount: null` = quote.
 *  Text (names / "from" / unit labels / "quote") lives in copy `scope.services`. */
export const SERVICES = [
    { id: 'upholstery', amount: 199, unit: 'item' },
    { id: 'kitchen', amount: 249 },
    { id: 'bath', amount: 219 },
    { id: 'windows', amount: 25, unit: 'sash' },
    { id: 'office', amount: null },
];
