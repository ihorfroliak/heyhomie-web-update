/**
 * Account Missions — ported from "HeyHomie Web · Client Account v3".
 *
 * Layout, spacing, radii and type sizes are 1:1 with the design markup; colours
 * resolve through the tailwind theme, which is the brand canon the design was
 * drawn against.
 *
 * This screen carries the mission management that used to live on /account: the
 * detail panel's Reschedule and Cancel run the SAME real endpoints (`editMission`
 * / `cancelMission`) through the SAME modal dialogs, so nothing a client could do
 * before is lost in the redesign.
 *
 * Three things about the real payload that are easy to get wrong, so they are
 * handled here rather than assumed:
 *  - `meeting_date` is a UNIX timestamp in SECONDS (see lib/missions.js);
 *  - `service` is an OBJECT, not a string — the displayed name comes from
 *    `homie_service` through next-intl, and the cadence from `service.frequency`;
 *  - whether a mission can still be changed is a business rule (`canChangeMission`),
 *    shared with the original cards instead of re-implemented.
 *
 * The design's per-card address line has no field on a mission (an address belongs
 * to a service/subscription), so it is not drawn rather than filled with a guess.
 */
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useTranslations } from 'next-intl';
import tw, { styled, theme } from 'twin.macro';

import { listMissions } from '../../../api/endpoints/missions';
import { canChangeMission, missionDate } from '../../../lib/missions';

const Wrap = styled.div`
    ${tw`flex items-start`}
    gap: 20px;
    padding: 24px 32px 40px;

    @media (max-width: 1279px) {
        ${tw`flex-col`}
        padding: 16px;
    }
`;

const Col = styled.div`
    ${tw`flex-1`}
    min-width: 0;
`;

const Tabs = styled.div`
    ${tw`flex`}
    border-bottom: 1px solid ${theme`colors.borderColor`};
`;

const Tab = styled.div`
    ${tw`cursor-pointer`}
    padding: 0 4px 12px;
    margin-right: 26px;

    span {
        font-weight: 700;
        font-size: 15px;
        color: ${p => (p.$on ? theme`colors.primary.dark` : theme`colors.primary.grey`)};
    }
    .rule {
        height: 2px;
        margin-top: 12px;
        border-radius: 2px;
        background: ${p => (p.$on ? theme`colors.primary.dark` : 'transparent')};
    }
`;

const List = styled.div`
    ${tw`flex flex-col`}
    gap: 14px;
    margin-top: 18px;
`;

const MissionCard = styled.div`
    ${tw`cursor-pointer`}
    border-radius: 16px;
    background: ${theme`colors.whiteStandard`};
    padding: 20px 22px;
    border: 1.5px solid ${p => (p.$on ? theme`colors.primary.dark` : 'transparent')};

    .head {
        ${tw`flex items-start justify-between`}
        gap: 20px;
    }
    .when {
        font-weight: 700;
        font-size: 14px;
        line-height: 1.5;
        color: ${theme`colors.primary.grey`};
    }
    .service {
        font-weight: 700;
        font-size: 16px;
        line-height: 100%;
        color: ${theme`colors.primary.dark`};
        margin-top: 8px;
    }
    .cadence {
        font-weight: 700;
        font-size: 14px;
        color: ${theme`colors.primary.grey`};
    }
    .priceLabel {
        font-weight: 500;
        font-size: 12px;
        color: ${theme`colors.primary.grey`};
    }
    .price {
        font-weight: 700;
        font-size: 16px;
        color: ${theme`colors.primary.dark`};
    }
    .foot {
        ${tw`flex items-center`}
        gap: 22px;
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid ${theme`colors.surfaceGrey`};
    }
    .homieAvatar {
        ${tw`flex items-center justify-center flex-none`}
        width: 26px;
        height: 26px;
        border-radius: 13px;
        background: ${theme`colors.surfaceGrey`};
        font-weight: 800;
        font-size: 10.5px;
        color: ${theme`colors.primary.grey`};
    }
    .muted {
        font-weight: 500;
        font-size: 13.5px;
        color: ${theme`colors.primary.grey`};
        white-space: nowrap;
    }
    .status {
        font-weight: 700;
        font-size: 14px;
        color: ${theme`colors.primary.dark`};
    }
`;

const Dot = styled.div`
    ${tw`flex-none`}
    width: 9px;
    height: 9px;
    border-radius: 5px;
    background: ${p => p.$color};
`;

const Panel = styled.div`
    ${tw`flex-none`}
    width: 352px;
    border-radius: 16px;
    background: ${theme`colors.whiteStandard`};
    padding: 24px;
    position: sticky;
    top: 0;

    @media (max-width: 1279px) {
        width: 100%;
        position: static;
    }

    .h {
        ${tw`flex items-baseline justify-between`}
        gap: 12px;
    }
    .service {
        font-weight: 700;
        font-size: 18px;
        color: ${theme`colors.primary.dark`};
    }
    .id {
        font: 700 11px ui-monospace, Menlo, monospace;
        color: ${theme`colors.primary.grey`};
    }
    .meta {
        font-weight: 500;
        font-size: 13px;
        color: ${theme`colors.primary.grey`};
        margin-top: 5px;
    }
    .timeline {
        margin-top: 18px;
        border-radius: 8px;
        background: ${theme`colors.surfaceGrey`};
        padding: 18px 20px;
    }
    .note {
        font-weight: 500;
        font-size: 11.5px;
        line-height: 1.5;
        color: ${theme`colors.primary.grey`};
        margin-top: 12px;
    }
`;

const TimelineRow = styled.div`
    ${tw`flex`}
    gap: 12px;

    .rail {
        ${tw`flex flex-col items-center flex-none`}
    }
    .dot {
        width: 10px;
        height: 10px;
        border-radius: 5px;
        margin-top: 4px;
        background: ${p => (p.$on ? theme`colors.secondary.salad` : 'transparent')};
        border: ${p => (p.$on ? 'none' : `2px solid ${theme`colors.borderColor`}`)};
    }
    .line {
        width: 2px;
        flex: 1;
        min-height: 16px;
        background: ${p => (p.$on ? theme`colors.secondary.salad` : theme`colors.borderColor`)};
    }
    .title {
        font-weight: 700;
        font-size: 13px;
        color: ${p => (p.$on ? theme`colors.primary.dark` : theme`colors.primary.grey`)};
    }
    .meta {
        font-weight: 500;
        font-size: 11.5px;
        color: ${theme`colors.primary.grey`};
        margin-top: 1px;
    }
`;

const Actions = styled.div`
    ${tw`flex flex-col`}
    gap: 8px;
    margin-top: 16px;
`;

const Action = styled.div`
    ${tw`flex items-center justify-center cursor-pointer`}
    height: 44px;
    border-radius: 8px;
    font-weight: 700;
    font-size: 14px;
    background: ${p => (p.$primary ? theme`colors.secondary.salad` : theme`colors.whiteStandard`)};
    border: ${p => (p.$primary ? 'none' : `1px solid ${theme`colors.borderColor`}`)};
    color: ${p => (p.$danger ? '#E24B4A' : theme`colors.primary.dark`)};
    opacity: ${p => (p.$disabled ? 0.45 : 1)};
    pointer-events: ${p => (p.$disabled ? 'none' : 'auto')};
`;

const Placeholder = styled.div`
    border-radius: 16px;
    background: ${theme`colors.whiteStandard`};
    padding: 24px;

    .h {
        font-weight: 700;
        font-size: 18px;
        color: ${theme`colors.primary.dark`};
    }
    .b {
        font-weight: 500;
        font-size: 13.5px;
        line-height: 1.5;
        color: ${theme`colors.primary.grey`};
        margin-top: 6px;
    }
`;

/**
 * Status LABELS are not written here — `messages/*.json` already carries the full,
 * localized set under `missions.statuses`, and it is longer than it looks
 * (planned / awaiting_payment exist too). Only the colour is a UI decision.
 */
export const STATUS_COLOR = {
    planned: '#414483',
    searching_homie: '#F9A736',
    homie_found: '#77ECC8',
    done: '#52516B',
    canceled: '#E24B4A',
    unpaid: '#E24B4A',
    awaiting_payment: '#F9A736',
    freezed: '#52516B',
};

/** How far along the four visible steps each status sits. */
export const STEP_INDEX = {
    planned: 0,
    searching_homie: 0,
    homie_found: 1,
    done: 3,
    awaiting_payment: 3,
    unpaid: 3,
    freezed: 0,
    canceled: 0,
};

const fmtWhen = ts => {
    if (!ts) return '';
    const d = missionDate(ts);
    return `${d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })} · ${d.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
    })}`;
};
const fmtPrice = p => (p === null || p === undefined || p === '' ? '' : `${Math.round(Number(p))} zł`);
const initials = name =>
    (name || '')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(w => w[0])
        .join('')
        .toUpperCase();

export default function Missions({ onReschedule, onCancel, reloadToken }) {
    const router = useRouter();
    const t = useTranslations('AccountPage.IndexPage.MissionsComponent');
    const user = useSelector(state => state.user);

    /**
     * Service names and cadences are translation KEYS on the API's own values. An
     * unknown value must not take the screen down, so a missing key falls back to
     * the raw value instead of throwing.
     */
    const tr = (path, value) => {
        if (!value) return '';
        try {
            return t(`${path}.${value}`);
        } catch (e) {
            return String(value);
        }
    };
    const serviceName = m => tr('missions.servicesNames', m.homie_service) || (m.service && m.service.type) || '';
    const cadence = m => (m.service && m.service.frequency ? tr(`missions.frequency`, m.service.frequency) : '');
    const statusLabel = m => tr(`missions.statuses`, m.status);
    const [tab, setTab] = useState('upcoming');
    const [upcoming, setUpcoming] = useState([]);
    const [past, setPast] = useState([]);
    const [loading, setLoading] = useState(true);
    const [failed, setFailed] = useState(false);
    const [openId, setOpenId] = useState(null);

    useEffect(() => {
        let live = true;
        if (!user.x_token_user) return undefined;
        setLoading(true);
        setFailed(false);
        (async () => {
            try {
                const [u, p] = await Promise.all([
                    listMissions(user.headers, user.x_token_user, 'upcoming'),
                    listMissions(user.headers, user.x_token_user, 'past'),
                ]);
                if (!live) return;
                setUpcoming(u && u.missions ? u.missions : u || []);
                setPast(p && p.missions ? p.missions : p || []);
            } catch (e) {
                // An unreachable API and an empty account must not look the same.
                if (live) setFailed(true);
            } finally {
                if (live) setLoading(false);
            }
        })();
        return () => {
            live = false;
        };
    }, [user.x_token_user, reloadToken]);

    const missions = tab === 'upcoming' ? upcoming : past;
    const selected = useMemo(() => missions.find(m => m.id === openId) || missions[0], [missions, openId]);
    const step = selected ? STEP_INDEX[selected.status] ?? 0 : 0;
    const isUpcoming = tab === 'upcoming';
    const changeable = canChangeMission(selected);

    const timeline = [
        { title: 'Booked', meta: 'We have your order' },
        { title: 'Homie assigned', meta: selected && selected.homie_name ? selected.homie_name : 'Before the visit' },
        { title: 'Cleaning', meta: selected ? fmtWhen(selected.meeting_date) : '' },
        { title: 'Payment', meta: 'The day after the visit' },
    ];

    return (
        <Wrap>
            <Col>
                <Tabs>
                    {[
                        { key: 'upcoming', label: `Upcoming${upcoming.length ? ` (${upcoming.length})` : ''}` },
                        { key: 'past', label: `Past${past.length ? ` (${past.length})` : ''}` },
                    ].map(t => (
                        <Tab
                            key={t.key}
                            $on={t.key === tab}
                            onClick={() => {
                                setTab(t.key);
                                setOpenId(null);
                            }}
                        >
                            <span>{t.label}</span>
                            <div className='rule' />
                        </Tab>
                    ))}
                </Tabs>

                <List>
                    {missions.length ? (
                        missions.map(m => (
                            <MissionCard key={m.id} $on={selected && m.id === selected.id} onClick={() => setOpenId(m.id)}>
                                <div className='head'>
                                    <div style={{ minWidth: 0 }}>
                                        <div className='when'>{fmtWhen(m.meeting_date)}</div>
                                        <div className='service'>
                                            {serviceName(m)}
                                            {cadence(m) ? <span className='cadence'> {cadence(m)}</span> : null}
                                        </div>
                                    </div>
                                    {fmtPrice(m.price) ? (
                                        <div style={{ textAlign: 'right', flex: 'none' }}>
                                            <div className='priceLabel'>Price</div>
                                            <div className='price'>{fmtPrice(m.price)}</div>
                                        </div>
                                    ) : null}
                                </div>
                                <div className='foot'>
                                    {/* The design's address line has no field on a mission — omitted. */}
                                    <div style={{ flex: '1 1 auto', display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                                        <div className='homieAvatar'>{m.homie_name ? initials(m.homie_name) : '—'}</div>
                                        <span className='muted'>{m.homie_name || 'Homie assigned before the visit'}</span>
                                    </div>
                                    <div style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Dot $color={STATUS_COLOR[m.status] || '#52516B'} />
                                        <span className='status'>{statusLabel(m)}</span>
                                    </div>
                                </div>
                            </MissionCard>
                        ))
                    ) : (
                        <Placeholder>
                            <div className='h'>
                                {loading
                                    ? 'Loading…'
                                    : failed
                                    ? "We couldn't load your missions"
                                    : isUpcoming
                                    ? 'Nothing booked right now'
                                    : 'No finished missions yet'}
                            </div>
                            <div className='b'>
                                {failed
                                    ? 'The connection dropped on the way. Refresh the page — nothing about your account has changed.'
                                    : isUpcoming
                                    ? 'When you book a cleaning it shows up here, from confirmation through to payment.'
                                    : 'Missions move here once they are done.'}
                            </div>
                        </Placeholder>
                    )}
                </List>
            </Col>

            {selected ? (
                <Panel>
                    <div className='h'>
                        <div className='service'>{serviceName(selected)}</div>
                        <div className='id'>#{selected.id}</div>
                    </div>
                    <div className='meta'>{fmtWhen(selected.meeting_date)}</div>
                    {fmtPrice(selected.price) ? <div className='meta'>{fmtPrice(selected.price)}</div> : null}

                    <div className='timeline'>
                        {timeline.map((t, i) => (
                            <TimelineRow key={t.title} $on={i <= step}>
                                <div className='rail'>
                                    <div className='dot' />
                                    {i < timeline.length - 1 ? <div className='line' /> : null}
                                </div>
                                <div style={{ paddingBottom: '6px' }}>
                                    <div className='title'>{t.title}</div>
                                    <div className='meta'>{t.meta}</div>
                                </div>
                            </TimelineRow>
                        ))}
                    </div>

                    {/* The same endpoints the previous account page used — a redesign
                        must not cost the client an action they already had. The gate is
                        the shared `canChangeMission`, not a local guess about "24 h". */}
                    <Actions>
                        <Action $primary $disabled={!changeable} onClick={() => changeable && onReschedule && onReschedule(selected.service)}>
                            Reschedule
                        </Action>
                        <Action onClick={() => router.push('/cleaning')}>Book another</Action>
                        <Action $danger $disabled={!changeable} onClick={() => changeable && onCancel && onCancel(selected.id)}>
                            Cancel this mission
                        </Action>
                    </Actions>
                    <div className='note'>
                        {changeable
                            ? 'You can move or call off this mission until shortly before it starts.'
                            : 'This mission can no longer be changed. Book another whenever you need us.'}
                    </div>
                </Panel>
            ) : null}
        </Wrap>
    );
}
