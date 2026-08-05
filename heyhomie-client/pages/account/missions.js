/**
 * /account/missions — the v3 Missions screen.
 *
 * This route exists so the redesign never costs a client an action they already
 * had: mission cancel + edit used to live on /account, and they move here, on the
 * SAME endpoints and through the SAME modal dialogs, BEFORE /account switches to
 * the v3 Overview (which has no such controls).
 *
 * Session bootstrap, locale headers and the overlay/scroll-lock behaviour are
 * carried over from the original account page unchanged.
 */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { initAccountSession, setHeaders } from '../../lib/slices/userSlice';
import { _pushToOverlayActionStack, _removeFromOverlayActionStack, _toggleMenu } from '../../lib/slices/uiSlice';
import { cancelMission, editMission } from '../../api/endpoints/missions';
import { BASE_URL } from '../../api/url';

import AccountShell from '../../components/myaccount/v3/AccountShell';
import MissionsScreen from '../../components/myaccount/v3/Missions';
import Overlay from '../../components/citypage/menus/Overlay';
import CancelMissionModalDialog from '../../components/myaccount/main/missions/CancelMissionModalDialog';
import EditMissionModalDialog from '../../components/myaccount/main/missions/EditMissionModalDialog';

const contextClass = {
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
    info: 'bg-gray-600 text-white',
    warning: 'bg-orange-400 text-white',
    default: 'bg-indigo-600 text-white',
};

/**
 * Split a mission's `service` into the { …fields, config } shape the existing
 * EditMissionModalDialog expects. Transcribed from the original account page so
 * the payload the API receives is byte-for-byte what it received before.
 */
const SERVICE_TOP_LEVEL = [
    'id',
    'cleaning_duration',
    'payment_method',
    'user_comment',
    'type',
    'status',
    'city_id',
    'address_id',
    'address_name',
    'mission_date',
    'frequent_mission_day',
    'frequent_mission_time',
    'service_icon_image',
];

const toEditableService = service => {
    const top = {};
    const config = {};
    Object.keys(service || {}).forEach(key => {
        if (SERVICE_TOP_LEVEL.includes(key)) top[key] = service[key];
        else config[key] = service[key];
    });
    return { ...top, config };
};

function MissionsPage() {
    const t = useTranslations('AccountPage.IndexPage');
    const router = useRouter();
    const dispatch = useDispatch();
    const { user, ui } = useSelector(state => state);

    const [missionToCancel, setMissionToCancel] = useState('');
    const [missionForEdit, setMissionForEdit] = useState('');
    /** Bumped after a successful mutation so the screen re-reads from the API. */
    const [reloadToken, setReloadToken] = useState(0);

    // ── session + locale headers (unchanged from the original account page) ──
    useEffect(() => {
        if (user && user.headers) {
            dispatch(setHeaders({ acceptLanguage: router.locale, userLocale: router.locale }));
        }
    }, [user, router.locale]);

    useEffect(() => {
        dispatch(initAccountSession(url => router.push(url)));
    }, []);

    useEffect(() => {
        document.body.style.overflow = ui.overlayActionsStack.length > 0 ? 'hidden' : '';
    }, [ui.overlayActionsStack]);

    // ── cancel ──
    const openCancel = id => {
        setMissionToCancel(id);
        dispatch(_toggleMenu({ menu: 'cancelMissionModalDialog', isOpen: true }));
        dispatch(_pushToOverlayActionStack('cancelMissionModalDialog'));
    };
    const closeCancel = () => {
        setMissionToCancel('');
        dispatch(_toggleMenu({ menu: 'cancelMissionModalDialog', isOpen: false }));
        dispatch(_removeFromOverlayActionStack('cancelMissionModalDialog'));
    };
    const handleCancelMission = async id => {
        try {
            closeCancel();
            await cancelMission(user.headers, user.x_token_user, id);
            setReloadToken(n => n + 1);
            toast.success(t(`cancelSuccess_msg`));
        } catch (err) {
            toast.error(t(`error_msg`));
        }
    };

    // ── edit / reschedule ──
    const openEdit = service => {
        setMissionForEdit(toEditableService(service));
        dispatch(_toggleMenu({ menu: 'editMissionModalDialog', isOpen: true }));
        dispatch(_pushToOverlayActionStack('editMissionModalDialog'));
    };
    const closeEdit = () => {
        setMissionForEdit('');
        dispatch(_toggleMenu({ menu: 'editMissionModalDialog', isOpen: false }));
        dispatch(_removeFromOverlayActionStack('editMissionModalDialog'));
    };
    const handleUpdateMission = async servicePayload => {
        try {
            closeEdit();
            const flattened = { ...servicePayload.config };
            Object.keys(servicePayload).forEach(key => {
                if (key !== 'config') flattened[key] = servicePayload[key];
            });
            await editMission(user.headers, user.x_token_user, servicePayload.id, { mission: { ...flattened } });
            setReloadToken(n => n + 1);
            toast.success(t(`editSuccess_msg`));
        } catch (err) {
            toast.error(t(`error_msg`));
        }
    };

    return (
        <>
            <Head>
                <title>{t(`meta.title`)}</title>
                <meta name='description' content={t(`meta.description`)} />
            </Head>
            <ToastContainer
                toastClassName={({ type }) =>
                    `${contextClass[type || 'default']} flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer font-bold`
                }
                bodyClassName={() => 'p-3'}
            />
            <AccountShell active='missions' title='Missions' subtitle='Everything booked, in progress and finished'>
                <MissionsScreen onReschedule={openEdit} onCancel={openCancel} reloadToken={reloadToken} />
            </AccountShell>
            <Overlay />
            <CancelMissionModalDialog
                missionToCancelId={missionToCancel}
                handleCancelMission={handleCancelMission}
                handleClearMissionToCancelAndClose={closeCancel}
            />
            <EditMissionModalDialog service={missionForEdit} handleCancel={closeEdit} handleValidateService={handleUpdateMission} />
        </>
    );
}

export async function getServerSideProps() {
    try {
        const resCities = await fetch(`${BASE_URL}api/v1/cities`);
        const { cities } = await resCities.json();
        return { props: { cities } };
    } catch (err) {
        return { props: {} };
    }
}

export default MissionsPage;
