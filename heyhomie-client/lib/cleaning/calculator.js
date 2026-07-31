/**
 * Cleaning price + time engine — the canonical calculator logic.
 *
 * Single source of truth: ../../../heyhomie-shared/DOMAIN_RULES.md (§1–§7). These
 * numbers MUST match the mobile packages/domain and the backend price list — do not
 * change a price/rule here without updating heyhomie-shared first.
 *
 * Pure functions, no React/DOM — unit-testable and reusable by the calculator UI
 * and by any server-side price check.
 */

/** §1.1 — base + per-room + per-bathroom, by cleaning type. Kitchen + hallway are
 *  folded into the base (never counted). Prices in PLN. */
export const TYPES = {
    standard: { id: 'standard', base: 119, room: 30, bath: 40 },
    general: { id: 'general', base: 194, room: 50, bath: 65 },
};

/** §2 — frequency multipliers. `save` is the badge label. */
export const FREQS = [
    { id: 'once', mult: 1, save: '', cyclic: false },
    { id: 'weekly', mult: 0.85, save: '-15%', cyclic: true },
    { id: 'biweekly', mult: 0.9, save: '-10%', cyclic: true },
    { id: 'monthly', mult: 0.95, save: '-5%', cyclic: true },
];

/**
 * §3 — add-ons. `price` PLN; `min` = extra on-site minutes; `inGeneral: true` means
 * it is already part of a general clean (hidden from the list on general); `qty`
 * add-ons are counted (windows per sash, ironing/hours per hour).
 */
export const ADDONS = [
    { id: 'oven', price: 40, min: 30, inGeneral: true },
    { id: 'fridge', price: 35, min: 25, inGeneral: true },
    { id: 'hood', price: 45, min: 30, inGeneral: true },
    { id: 'cabinets', price: 35, min: 30, inGeneral: true },
    { id: 'microwave', price: 25, min: 15, inGeneral: true },
    { id: 'bins', price: 20, min: 15, inGeneral: true },
    { id: 'balcony', price: 30, min: 25, inGeneral: true },
    { id: 'windows', price: 25, min: 20, inGeneral: false, qty: true },
    { id: 'ironing', price: 45, min: 60, inGeneral: false, qty: true },
    { id: 'hours', price: 55, min: 60, inGeneral: false, qty: true },
];

/** §7 — gear (vacuum/mop/bucket) fee for standard; general always free; cyclic waives
 *  it after the 10th visit. */
export const GEAR_FEE = 15;
export const FREE_GEAR_AFTER = 10;

/** §5 — on-site time estimate (mobile parity): rooms·30 + kitchen 60 + baths·60 +
 *  corridor 30, min 3h; add-ons add their `min`. Kitchen + corridor are the base. */
const MIN_MINUTES = 180;
const BASE_MINUTES = 60 /* kitchen */ + 30; /* corridor */

const byId = Object.fromEntries(ADDONS.map(a => [a.id, a]));
const freqById = Object.fromEntries(FREQS.map(f => [f.id, f]));

/** Add-ons offered for a plan — the seven `inGeneral` ones collapse out on general. */
export function visibleAddons(typeId) {
    return typeId === 'general' ? ADDONS.filter(a => !a.inGeneral) : ADDONS;
}

/** Normalise a selection map ({ addonId: qty }) to entries that actually apply on the
 *  chosen type (an inGeneral add-on selected on general contributes nothing). */
function activeAddons(typeId, selection = {}) {
    const visible = new Set(visibleAddons(typeId).map(a => a.id));
    return Object.entries(selection)
        .filter(([id, qty]) => qty > 0 && visible.has(id) && byId[id])
        .map(([id, qty]) => ({ def: byId[id], qty: byId[id].qty ? qty : 1 }));
}

/**
 * Full price + time breakdown for a booking.
 * @param {object} input
 * @param {'standard'|'general'} input.type
 * @param {number} input.rooms
 * @param {number} input.bathrooms
 * @param {string} input.freq            one of FREQS ids
 * @param {object} [input.addons]        { addonId: qty }
 * @param {boolean} [input.gearOnSite]   true => customer has gear (no fee)
 * @param {number} [input.visitIndex]    1-based visit number (cyclic gear waiver)
 */
export function calculate(input) {
    const type = TYPES[input.type] || TYPES.standard;
    const freq = freqById[input.freq] || FREQS[0];
    const rooms = Math.max(0, input.rooms || 0);
    const baths = Math.max(0, input.bathrooms || 0);

    // §1 base clean, before frequency discount.
    const roomsCost = rooms * type.room;
    const bathsCost = baths * type.bath;
    const cleanBase = type.base + roomsCost + bathsCost;

    // §3 add-ons (not discounted by frequency).
    const addons = activeAddons(type.id, input.addons);
    const addonsCost = addons.reduce((s, a) => s + a.def.price * a.qty, 0);

    // §7 gear fee — general free; standard one-off +15; standard cyclic 15 until the 10th.
    let gearFee = 0;
    if (!input.gearOnSite && type.id !== 'general') {
        const past10 = freq.cyclic && (input.visitIndex || 1) > FREE_GEAR_AFTER;
        if (!past10) gearFee = GEAR_FEE;
    }

    // §2 discount applies to the clean; add-ons + gear are charged at face value.
    const discountedClean = Math.round(cleanBase * freq.mult);
    const total = discountedClean + addonsCost + gearFee;
    const undiscounted = cleanBase + addonsCost + gearFee;

    // §5 time estimate.
    const rawMinutes = BASE_MINUTES + rooms * 30 + baths * 60 + addons.reduce((s, a) => s + a.def.min * a.qty, 0);
    const minutes = Math.max(rawMinutes, MIN_MINUTES);

    // §1.1 crew: general or larger jobs run with 2 homies (mirror of the mobile rule).
    const crew = type.id === 'general' || rooms + baths >= 4 ? 2 : 1;

    return {
        total, // PLN, after discount
        undiscounted, // PLN, before discount (for the struck-through price)
        discountPln: undiscounted - total,
        cleanBase,
        discountedClean,
        addonsCost,
        gearFee,
        minutes,
        hours: Math.round((minutes / 60) * 10) / 10,
        crew,
        lines: [
            { id: 'base', value: type.base },
            rooms > 0 && { id: 'rooms', qty: rooms, value: roomsCost },
            baths > 0 && { id: 'baths', qty: baths, value: bathsCost },
            ...addons.map(a => ({ id: a.def.id, qty: a.def.qty ? a.qty : undefined, value: a.def.price * a.qty })),
            gearFee > 0 && { id: 'gear', value: gearFee },
            freq.mult < 1 && { id: 'discount', value: -(cleanBase - discountedClean) },
        ].filter(Boolean),
    };
}

/** Convenience: format a PLN integer as "219 zł". */
export const zl = n => `${Math.round(n)} zł`;
