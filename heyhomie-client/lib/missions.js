/**
 * Mission helpers shared by the account screens.
 *
 * Extracted from the original UpcomingMissionCard so the v3 screens and the
 * existing cards cannot drift on two things that are easy to get wrong:
 *
 * 1. `meeting_date` is a UNIX timestamp in SECONDS, not an ISO string. Passing it
 *    straight to `new Date()` silently yields a 1970 date, which looks like a
 *    rendering bug but reads as real data to a client.
 * 2. Whether a mission can still be changed is a real business rule (a cutoff on
 *    the day of the visit), not a UI preference — it must be asked, not guessed.
 */

/** A mission's meeting date as a real Date (the API sends epoch seconds). */
export const missionDate = meetingDate => new Date(Number(meetingDate) * 1000);

/** The cutoff hour used by `isMissionEditable` — now + 4h, wrapping past midnight. */
const hourSum = todayHours => {
    let hours = todayHours + 4;
    if (hours > 23) hours -= 23;
    return hours;
};

/**
 * A mission stays editable until the cutoff on the day it happens. Transcribed
 * from the original card so behaviour is identical, including its use of the
 * meeting's UTC hour against the local clock.
 */
export function isMissionEditable(meetingDate) {
    const meeting = missionDate(meetingDate);
    const today = new Date();

    if (meeting.getFullYear() === today.getFullYear() && meeting.getMonth() === today.getMonth() && meeting.getDate() === today.getDate()) {
        if (hourSum(today.getHours()) > meeting.getUTCHours()) return false;
    }

    return true;
}

/** Statuses that put a mission beyond changing, regardless of the clock. */
const CLOSED_STATUSES = ['canceled', 'done', 'freezed'];

/** The gate the original account page used for both Edit and Cancel. */
export const canChangeMission = mission => !!mission && !CLOSED_STATUSES.includes(mission.status) && isMissionEditable(mission.meeting_date);
