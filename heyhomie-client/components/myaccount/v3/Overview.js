/**
 * Account Overview — ported from "HeyHomie Web · Client Account v3".
 *
 * Layout, spacing, radii and type sizes are 1:1 with the design markup; colours
 * resolve through the theme tokens, which are the same brand canon the design was
 * drawn against.
 *
 * Every value here comes from `GET api/v1/users/missions` (id, service, status,
 * meeting_date, price, homie_name). Four blocks in the design have NO endpoint
 * behind them and are deliberately not drawn rather than filled with plausible
 * numbers: the homie's ★ rating / "12 missions with you" / spoken languages, the
 * credit balance, the "Your homies" preferred list, and the recurring-plan card
 * (that one belongs on the Services screen, on the subscriptions endpoint).
 */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import tw, { styled, theme } from 'twin.macro';

import { listMissions } from '../../../api/endpoints/missions';

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
    ${tw`flex flex-col flex-1`}
    min-width: 0;
    gap: 16px;
`;

const Rail = styled.div`
    ${tw`flex flex-col flex-none`}
    width: 330px;
    gap: 14px;

    @media (max-width: 1279px) {
        width: 100%;
    }
`;

const Card = styled.div`
    border-radius: 16px;
    background: ${theme`colors.whiteStandard`};
    padding: 24px;
`;

const NextCard = styled.div`
    border-radius: 16px;
    background: ${theme`colors.primary.dark`};
    padding: 28px;
    color: #fff;

    .top {
        ${tw`flex items-start justify-between`}
        gap: 24px;
    }
    .pill {
        ${tw`flex items-center`}
        gap: 8px;
    }
    .pill i {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: ${theme`colors.secondary.salad`};
    }
    .pill span {
        font-weight: 700;
        font-size: 12px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: ${theme`colors.secondary.salad`};
    }
    .when {
        font-weight: 800;
        font-size: 30px;
        letter-spacing: -0.015em;
        margin-top: 12px;
    }
    .summary {
        font-weight: 500;
        font-size: 14.5px;
        color: rgba(255, 255, 255, 0.62);
        margin-top: 8px;
    }
    .priceLabel {
        font-weight: 500;
        font-size: 12px;
        letter-spacing: 0.07em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.45);
    }
    .price {
        font-weight: 800;
        font-size: 28px;
        color: ${theme`colors.secondary.salad`};
        margin-top: 4px;
    }
    .foot {
        ${tw`flex items-center`}
        gap: 14px;
        margin-top: 26px;
        padding-top: 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.13);
    }
    .avatar {
        ${tw`flex items-center justify-center flex-none`}
        width: 42px;
        height: 42px;
        border-radius: 21px;
        background: ${theme`colors.primary.blue`};
        font-weight: 800;
        font-size: 13px;
    }
    .homie {
        font-weight: 700;
        font-size: 14.5px;
    }
    .ghost {
        ${tw`flex items-center cursor-pointer flex-none`}
        height: 44px;
        padding: 0 20px;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.22);
        font-weight: 700;
        font-size: 14px;
    }
`;

const Steps = styled.div`
    ${tw`flex`}
    margin-top: 26px;
`;

const Step = styled.div`
    ${tw`flex-1`}
    min-width: 0;

    .row {
        ${tw`flex items-center`}
    }
    .dot {
        ${tw`flex-none`}
        width: 11px;
        height: 11px;
        border-radius: 6px;
        background: ${p => (p.$on ? theme`colors.secondary.salad` : 'transparent')};
        border: ${p => (p.$on ? 'none' : '2px solid rgba(255,255,255,0.28)')};
    }
    .bar {
        ${tw`flex-1`}
        height: 2px;
        background: ${p => (p.$on ? theme`colors.secondary.salad` : 'rgba(255,255,255,0.14)')};
    }
    .title {
        font-weight: 700;
        font-size: 13px;
        margin-top: 10px;
        color: ${p => (p.$on ? '#fff' : 'rgba(255,255,255,0.5)')};
    }
    .meta {
        font-weight: 500;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.42);
        margin-top: 2px;
    }
`;

const SectionHead = styled.div`
    ${tw`flex items-center justify-between`}

    .h {
        font-weight: 700;
        font-size: 18px;
        color: ${theme`colors.primary.dark`};
    }
    .a {
        ${tw`cursor-pointer`}
        font-weight: 700;
        font-size: 13.5px;
        color: ${theme`colors.accountBlue`};
    }
`;

const Row = styled.div`
    ${tw`flex items-center cursor-pointer`}
    gap: 16px;
    padding: 14px 0;
    border-bottom: 1px solid ${theme`colors.surfaceGrey`};

    .service {
        font-weight: 700;
        font-size: 14.5px;
        color: ${theme`colors.primary.dark`};
    }
    .meta {
        font-weight: 500;
        font-size: 12.5px;
        color: ${theme`colors.primary.grey`};
        margin-top: 2px;
    }
    .status {
        font-weight: 700;
        font-size: 13.5px;
        color: ${theme`colors.primary.dark`};
    }
    .total {
        ${tw`flex-none text-right`}
        width: 90px;
        font-weight: 700;
        font-size: 14px;
        color: ${theme`colors.primary.dark`};
    }
`;

const Rebook = styled.div`
    ${tw`cursor-pointer`}
    border-radius: 16px;
    background: ${theme`colors.secondary.salad`};
    padding: 22px;

    .h {
        font-weight: 700;
        font-size: 17px;
        color: ${theme`colors.primary.dark`};
    }
    .b {
        font-weight: 500;
        font-size: 13.5px;
        line-height: 1.5;
        color: rgba(20, 19, 56, 0.66);
        margin-top: 6px;
    }
    .a {
        font-weight: 700;
        font-size: 14px;
        color: ${theme`colors.primary.dark`};
        margin-top: 14px;
    }
`;

const Help = styled.div`
    border-radius: 16px;
    background: #c8cff0; /* periwinkle — brand extra, no token in this repo yet */
    padding: 22px;

    .h {
        font-weight: 700;
        font-size: 15px;
        color: ${theme`colors.primary.dark`};
    }
    .b {
        font-weight: 500;
        font-size: 12.5px;
        line-height: 1.5;
        color: rgba(20, 19, 56, 0.66);
        margin-top: 6px;
    }
    .a {
        ${tw`cursor-pointer`}
        font-weight: 700;
        font-size: 13.5px;
        color: ${theme`colors.primary.dark`};
        margin-top: 13px;
    }
`;

const Empty = styled(Card)`
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
    .cta {
        ${tw`flex items-center justify-center cursor-pointer`}
        height: 48px;
        margin-top: 16px;
        border-radius: 8px;
        background: ${theme`colors.secondary.salad`};
        font-weight: 700;
        font-size: 15px;
        color: ${theme`colors.primary.dark`};
    }
`;

/** The API's mission statuses, mapped to what a client is told. */
const STATUS_LABEL = {
    searching_homie: 'Finding a homie',
    homie_found: 'Homie assigned',
    in_progress: 'In progress',
    done: 'Done',
    canceled: 'Cancelled',
    unpaid: 'Unpaid',
    freezed: 'Paused',
};

/** How far along the four visible steps a mission is, from its own status. */
const STEP_INDEX = {
    searching_homie: 0,
    homie_found: 1,
    in_progress: 2,
    done: 3,
    unpaid: 3,
    freezed: 0,
    canceled: 0,
};

const fmtDate = d => (d ? new Date(d).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) : '');
const fmtTime = d => (d ? new Date(d).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '');
const fmtPrice = p => (p === null || p === undefined || p === '' ? '' : `${Math.round(Number(p))} zł`);
const initials = name =>
    (name || '')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(w => w[0])
        .join('')
        .toUpperCase();

export default function Overview() {
    const router = useRouter();
    const user = useSelector(state => state.user);
    const [upcoming, setUpcoming] = useState([]);
    const [past, setPast] = useState([]);
    const [loading, setLoading] = useState(true);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        let live = true;
        if (!user.x_token_user) return undefined;
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
                // A failed load is said out loud — an empty account and an unreachable
                // API must not look the same to the client.
                if (live) setFailed(true);
            } finally {
                if (live) setLoading(false);
            }
        })();
        return () => {
            live = false;
        };
    }, [user.x_token_user]);

    const next = upcoming[0];
    const last = past[0];
    const step = next ? STEP_INDEX[next.status] ?? 0 : 0;

    const steps = [
        { title: 'Booked', meta: 'We have your order' },
        { title: 'Homie assigned', meta: next && next.homie_name ? next.homie_name : 'Before the visit' },
        { title: 'Cleaning', meta: next ? fmtTime(next.meeting_date) : '' },
        { title: 'Payment', meta: 'The day after' },
    ];

    return (
        <Wrap>
            <Col>
                {next ? (
                    <NextCard>
                        <div className="top">
                            <div>
                                <div className="pill">
                                    <i />
                                    <span>Next mission · {STATUS_LABEL[next.status] || next.status}</span>
                                </div>
                                <div className="when">{fmtDate(next.meeting_date)}</div>
                                <div className="summary">
                                    {[next.service, fmtTime(next.meeting_date)].filter(Boolean).join(' · ')}
                                </div>
                            </div>
                            {fmtPrice(next.price) ? (
                                <div style={{ textAlign: 'right', flex: 'none' }}>
                                    <div className="priceLabel">Charged after</div>
                                    <div className="price">{fmtPrice(next.price)}</div>
                                </div>
                            ) : null}
                        </div>

                        <Steps>
                            {steps.map((s, i) => (
                                <Step key={s.title} $on={i <= step}>
                                    <div className="row">
                                        <div className="dot" />
                                        {i < steps.length - 1 ? <div className="bar" /> : null}
                                    </div>
                                    <div className="title">{s.title}</div>
                                    <div className="meta">{s.meta}</div>
                                </Step>
                            ))}
                        </Steps>

                        <div className="foot">
                            <div className="avatar">{next.homie_name ? initials(next.homie_name) : '—'}</div>
                            <div style={{ flex: 1 }}>
                                {/* The API gives a name and nothing else about a homie, so the
                                    design's rating / mission count / languages line is not drawn. */}
                                <div className="homie">
                                    {next.homie_name ? `${next.homie_name} is your homie` : 'Your homie is assigned before the visit'}
                                </div>
                            </div>
                            <div className="ghost" onClick={() => router.push('/account/missions')}>
                                Reschedule
                            </div>
                        </div>
                    </NextCard>
                ) : (
                    <Empty>
                        <div className="h">{loading ? 'Loading your missions…' : failed ? "We couldn't load your missions" : 'Nothing booked right now'}</div>
                        <div className="b">
                            {failed
                                ? 'The connection dropped on the way. Refresh the page — nothing about your account has changed.'
                                : 'When you book a cleaning, you can follow it here from confirmation through to payment.'}
                        </div>
                        {!loading && !failed ? (
                            <div className="cta" onClick={() => router.push('/cleaning')}>
                                Book a cleaning
                            </div>
                        ) : null}
                    </Empty>
                )}

                <Card>
                    <SectionHead>
                        <div className="h">Recent missions</div>
                        <div className="a" onClick={() => router.push('/account/missions')}>
                            See all →
                        </div>
                    </SectionHead>
                    {past.length ? (
                        past.slice(0, 5).map(m => (
                            <Row key={m.id} onClick={() => router.push('/account/missions')}>
                                <div style={{ flex: '1 1 auto', minWidth: 0 }}>
                                    <div className="service">{m.service}</div>
                                    <div className="meta">
                                        {[fmtDate(m.meeting_date), m.homie_name].filter(Boolean).join(' · ')}
                                    </div>
                                </div>
                                <div className="status">{STATUS_LABEL[m.status] || m.status}</div>
                                <div className="total">{fmtPrice(m.price)}</div>
                            </Row>
                        ))
                    ) : (
                        <div style={{ fontWeight: 500, fontSize: '13.5px', color: '#52516B', marginTop: '14px' }}>
                            {loading ? 'Loading…' : 'Your finished missions will show up here.'}
                        </div>
                    )}
                </Card>
            </Col>

            <Rail>
                {last ? (
                    <Rebook onClick={() => router.push('/cleaning')}>
                        <div className="h">Book the same again</div>
                        <div className="b">{[last.service, fmtPrice(last.price)].filter(Boolean).join(' · ')}</div>
                        <div className="a">Pick a date →</div>
                    </Rebook>
                ) : null}

                <Help>
                    <div className="h">Something not right?</div>
                    <div className="b">Tell us within 24 hours of a mission and we come back and redo it — free.</div>
                    <div className="a" onClick={() => router.push('/account/settings')}>
                        Report an issue →
                    </div>
                </Help>
            </Rail>
        </Wrap>
    );
}
