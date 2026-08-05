/**
 * Account Services — ported from "HeyHomie Web · Client Account v3", on the real
 * subscriptions endpoint (`GET api/v1/users/services`).
 *
 * The design draws this screen as a CATALOGUE of bookable services with "from"
 * prices. There is no endpoint that lists a catalogue with prices — `listServices`
 * returns the client's OWN recurring services, and pricing only exists per-service
 * behind `calculate`. So the grid is filled with what the account actually has:
 * the plan cards. That is also the card the design shows on Overview ("Cleaning
 * every 2 weeks"), which belongs here, next to the controls that change it.
 *
 * A service carries: id, type, status (active | freezed | canceled), frequency,
 * frequent_mission_day, frequent_mission_time (an HOUR, rendered as `HH:00`),
 * address_name, service_icon_image. Names, cadences, weekdays and statuses are all
 * already localized in messages/*.json — none of them are written in English here.
 */
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useTranslations } from 'next-intl';
import tw, { styled, theme } from 'twin.macro';

import { listServices } from '../../../api/endpoints/services';

const Wrap = styled.div`
    padding: 24px 32px 40px;

    @media (max-width: 767px) {
        padding: 16px;
    }
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;

    @media (max-width: 1279px) {
        grid-template-columns: repeat(2, 1fr);
    }
    @media (max-width: 767px) {
        grid-template-columns: 1fr;
    }
`;

const SectionLabel = styled.div`
    font-weight: 700;
    font-size: 12px;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: ${theme`colors.primary.grey`};
    margin: 26px 0 12px;

    &:first-of-type {
        margin-top: 0;
    }
`;

const PlanCard = styled.div`
    ${tw`flex flex-col`}
    border-radius: 16px;
    background: ${theme`colors.whiteStandard`};
    padding: 24px;
    opacity: ${p => (p.$muted ? 0.72 : 1)};

    .top {
        ${tw`flex items-start justify-between`}
        gap: 16px;
    }
    .icon {
        ${tw`flex items-center justify-center flex-none`}
        width: 44px;
        height: 44px;
        border-radius: 12px;
        background: ${theme`colors.surfaceGrey`};
        overflow: hidden;
    }
    .icon img {
        width: 24px;
        height: 24px;
    }
    .tag {
        ${tw`flex-none`}
        font-weight: 800;
        font-size: 10px;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        padding: 5px 8px;
        border-radius: 6px;
        color: ${theme`colors.primary.dark`};
        background: ${p => p.$tagBg};
    }
    .name {
        font-weight: 700;
        font-size: 18px;
        color: ${theme`colors.primary.dark`};
        margin-top: 16px;
    }
    .cadence {
        font-weight: 500;
        font-size: 13.5px;
        line-height: 1.55;
        color: ${theme`colors.primary.grey`};
        margin-top: 6px;
        min-height: 44px;
    }
    .where {
        font-weight: 500;
        font-size: 12.5px;
        color: ${theme`colors.primary.grey`};
        margin-top: 2px;
    }
    .actions {
        ${tw`flex`}
        gap: 8px;
        margin-top: 16px;
    }
`;

const Btn = styled.div`
    ${tw`flex items-center justify-center cursor-pointer flex-1`}
    height: 44px;
    border-radius: 8px;
    font-weight: 700;
    font-size: 13.5px;
    background: ${p => (p.$primary ? theme`colors.secondary.salad` : theme`colors.whiteStandard`)};
    border: ${p => (p.$primary ? 'none' : `1px solid ${theme`colors.borderColor`}`)};
    color: ${p => (p.$danger ? '#E24B4A' : theme`colors.primary.dark`)};
`;

const Promo = styled.div`
    ${tw`flex flex-col justify-center`}
    border-radius: 16px;
    background: #c8cff0; /* periwinkle — brand extra, no token in this repo yet */
    padding: 24px;

    .h {
        font-weight: 700;
        font-size: 18px;
        color: ${theme`colors.primary.dark`};
    }
    .b {
        font-weight: 500;
        font-size: 13.5px;
        line-height: 1.55;
        color: rgba(20, 19, 56, 0.66);
        margin-top: 8px;
    }
    .cta {
        ${tw`flex items-center justify-center cursor-pointer`}
        height: 44px;
        margin-top: 18px;
        border-radius: 8px;
        background: ${theme`colors.primary.dark`};
        font-weight: 700;
        font-size: 14px;
        color: #fff;
    }
`;

const Note = styled.div`
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

const TAG_BG = {
    active: '#77ECC8',
    freezed: '#F4D779',
    canceled: '#E2E2EB',
};

export default function Services({ onEdit, onCancel, reloadToken }) {
    const router = useRouter();
    const t = useTranslations('AccountPage.SubscriptionsPage.ServicesComponent');
    const user = useSelector(state => state.user);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [failed, setFailed] = useState(false);

    /** Localized label with a fallback, so an unknown API value cannot throw. */
    const tr = (path, value) => {
        if (!value && value !== 0) return '';
        try {
            return t(`${path}.${value}`);
        } catch (e) {
            return String(value);
        }
    };

    useEffect(() => {
        let live = true;
        if (!user.x_token_user) return undefined;
        setLoading(true);
        setFailed(false);
        (async () => {
            try {
                const data = await listServices(user.headers, user.x_token_user);
                if (!live) return;
                setServices(data && data.services ? data.services : []);
            } catch (e) {
                // An unreachable API and an account with no plans must not look alike.
                if (live) setFailed(true);
            } finally {
                if (live) setLoading(false);
            }
        })();
        return () => {
            live = false;
        };
    }, [user.x_token_user, reloadToken]);

    const running = useMemo(() => services.filter(s => s.status === 'active' || s.status === 'freezed'), [services]);
    const cancelled = useMemo(() => services.filter(s => s.status === 'canceled'), [services]);

    /** "Every 2 weeks, Tuesday at 17:00" — every part of it out of messages/*.json. */
    const cadenceOf = s => {
        const parts = [tr('services.frequency', s.frequency)];
        if (s.frequent_mission_day) parts.push(tr('services.weekDays', s.frequent_mission_day));
        const line = parts.filter(Boolean).join(', ');
        if (s.frequent_mission_time === undefined || s.frequent_mission_time === null || s.frequent_mission_time === '') return line;
        return `${line} ${t('services.time_at')} ${s.frequent_mission_time}:00`;
    };

    const renderCard = s => (
        <PlanCard key={s.id} $muted={s.status !== 'active'} $tagBg={TAG_BG[s.status] || TAG_BG.canceled}>
            <div className='top'>
                <div className='icon'>{s.service_icon_image ? <img src={s.service_icon_image} alt='' /> : null}</div>
                <div className='tag'>{tr('services.statuses', s.status)}</div>
            </div>
            <div className='name'>{tr('services.servicesNames', s.type)}</div>
            <div className='cadence'>{cadenceOf(s)}</div>
            {s.address_name ? <div className='where'>{s.address_name}</div> : null}
            {s.status !== 'canceled' ? (
                <div className='actions'>
                    <Btn $primary onClick={() => onEdit && onEdit(s)}>
                        {t('services.editService_btn')}
                    </Btn>
                    <Btn $danger onClick={() => onCancel && onCancel(s.id)}>
                        {t('services.cancelService_btn')}
                    </Btn>
                </div>
            ) : null}
        </PlanCard>
    );

    return (
        <Wrap>
            {running.length || loading || failed ? <SectionLabel>Your plans</SectionLabel> : null}

            {loading || failed ? (
                <Note>
                    <div className='h'>{loading ? 'Loading your plans…' : "We couldn't load your plans"}</div>
                    <div className='b'>
                        {failed ? 'The connection dropped on the way. Refresh the page — nothing about your account has changed.' : 'One moment.'}
                    </div>
                </Note>
            ) : (
                <Grid>
                    {running.map(renderCard)}
                    <Promo>
                        <div className='h'>{running.length ? 'Need something else?' : 'Not sure what you need?'}</div>
                        <div className='b'>Answer a few questions about your home and we quote in under a minute.</div>
                        <div className='cta' onClick={() => router.push('/cleaning')}>
                            Open the calculator
                        </div>
                    </Promo>
                </Grid>
            )}

            {cancelled.length ? (
                <>
                    <SectionLabel>Cancelled</SectionLabel>
                    <Grid>{cancelled.map(renderCard)}</Grid>
                </>
            ) : null}
        </Wrap>
    );
}
