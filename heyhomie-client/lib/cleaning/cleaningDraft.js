/**
 * Cleaning calculator draft — a lightweight, browser-only handoff from the /cleaning
 * calculator to the (future) city-page booking flow.
 *
 * The landing calculator and the city-page BookingMenu use different models and the
 * calculator's selection is otherwise lost on the redirect to `/[city]`. This captures
 * the selection in sessionStorage so the booking flow can pre-fill it LATER, without
 * coupling the landing to the order Redux/backend today.
 *
 * CONSUME POINT (follow-up, done with the booking-flow owner): on `/[city]` when
 * `router.query.selectedService === 'cleaning'`, call `readCleaningDraft()` and map it
 * onto the order-session service config, then `clearCleaningDraft()`. Until that lands
 * this is write-only and harmless.
 *
 * No PII is stored — only the anonymous selection (type/frequency/rooms/add-ons) and the
 * computed headline price/time. Versioned + timestamped so a stale/incompatible draft is
 * easy to ignore.
 */
export const CLEANING_DRAFT_KEY = 'heyhomie:cleaningDraft';
const DRAFT_VERSION = 1;
const MAX_AGE_MS = 30 * 60 * 1000; // 30 min — a draft older than this is stale

/** Persist the calculator selection. SSR-safe + never throws (private mode / quota). */
export function saveCleaningDraft(draft) {
    if (typeof window === 'undefined' || !draft) return;
    try {
        const payload = {
            v: DRAFT_VERSION,
            at: Date.now(),
            type: draft.type,
            freq: draft.freq,
            rooms: draft.rooms,
            bathrooms: draft.bathrooms,
            area: draft.area,
            addons: draft.addons || {},
            pets: !!draft.pets,
            gearOnSite: !!draft.gearOnSite,
            total: draft.total,
            minutes: draft.minutes,
        };
        window.sessionStorage.setItem(CLEANING_DRAFT_KEY, JSON.stringify(payload));
    } catch {
        /* storage unavailable — capture is best-effort, never block the CTA */
    }
}

/** Read a fresh, version-matching draft, else null. SSR-safe + never throws. */
export function readCleaningDraft() {
    if (typeof window === 'undefined') return null;
    try {
        const raw = window.sessionStorage.getItem(CLEANING_DRAFT_KEY);
        if (!raw) return null;
        const d = JSON.parse(raw);
        if (!d || d.v !== DRAFT_VERSION) return null;
        if (typeof d.at === 'number' && Date.now() - d.at > MAX_AGE_MS) return null;
        return d;
    } catch {
        return null;
    }
}

/** Drop the draft once the booking flow has consumed it. SSR-safe + never throws. */
export function clearCleaningDraft() {
    if (typeof window === 'undefined') return;
    try {
        window.sessionStorage.removeItem(CLEANING_DRAFT_KEY);
    } catch {
        /* no-op */
    }
}
