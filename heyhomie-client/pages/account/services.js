/**
 * /account/services — the v3 Services screen (the client's recurring plans).
 *
 * Like /account/missions, this route takes over real functionality before the old
 * page is retired: editing and cancelling a recurring service run the SAME
 * endpoints (`editService` / `cancelService`) through the SAME modal dialogs, with
 * the same { …fields, config } payload split the subscriptions page used, so the
 * API receives exactly what it received before.
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
import { cancelService, editService } from '../../api/endpoints/services';
import { BASE_URL } from '../../api/url';

import AccountShell from '../../components/myaccount/v3/AccountShell';
import ServicesScreen from '../../components/myaccount/v3/Services';
import Overlay from '../../components/citypage/menus/Overlay';
import CancelServiceModalDialog from '../../components/myaccount/subscriptions/services/CancelServiceModalDialog';
import EditServiceModalDialog from '../../components/myaccount/subscriptions/services/EditServiceModalDialog';

const contextClass = {
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
    info: 'bg-gray-600 text-white',
    warning: 'bg-orange-400 text-white',
    default: 'bg-indigo-600 text-white',
};

/**
 * Fields the API keeps at the top level of a service; everything else belongs in
 * `config`. Transcribed from the subscriptions page so the split is identical.
 */
const SERVICE_TOP_LEVEL = [
    'id',
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

function ServicesPage() {
    const t = useTranslations('AccountPage.SubscriptionsPage');
    const router = useRouter();
    const dispatch = useDispatch();
    const { user, ui } = useSelector(state => state);

    const [serviceToCancel, setServiceToCancel] = useState('');
    const [serviceForEdit, setServiceForEdit] = useState('');
    /** Bumped after a successful mutation so the screen re-reads from the API. */
    const [reloadToken, setReloadToken] = useState(0);

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
        setServiceToCancel(id);
        dispatch(_toggleMenu({ menu: 'cancelServiceModalDialog', isOpen: true }));
        dispatch(_pushToOverlayActionStack('cancelServiceModalDialog'));
    };
    const closeCancel = () => {
        setServiceToCancel('');
        dispatch(_toggleMenu({ menu: 'cancelServiceModalDialog', isOpen: false }));
        dispatch(_removeFromOverlayActionStack('cancelServiceModalDialog'));
    };
    const handleCancelService = async id => {
        try {
            closeCancel();
            await cancelService(user.headers, user.x_token_user, id);
            setReloadToken(n => n + 1);
            toast.success(t(`cancelSuccess_msg`));
        } catch (err) {
            toast.error(t(`error_msg`));
        }
    };

    // ── edit ──
    const openEdit = service => {
        setServiceForEdit(toEditableService(service));
        dispatch(_toggleMenu({ menu: 'editServiceModalDialog', isOpen: true }));
        dispatch(_pushToOverlayActionStack('editServiceModalDialog'));
    };
    const closeEdit = () => {
        setServiceForEdit('');
        dispatch(_toggleMenu({ menu: 'editServiceModalDialog', isOpen: false }));
        dispatch(_removeFromOverlayActionStack('editServiceModalDialog'));
    };
    const handleUpdateService = async servicePayload => {
        try {
            closeEdit();
            const flattened = { ...servicePayload.config };
            Object.keys(servicePayload).forEach(key => {
                if (key !== 'config') flattened[key] = servicePayload[key];
            });
            await editService(user.headers, user.x_token_user, servicePayload.id, { service: { ...flattened } });
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
            <AccountShell active='services' title='Services' subtitle='Your recurring plans and what else we can do'>
                <ServicesScreen onEdit={openEdit} onCancel={openCancel} reloadToken={reloadToken} />
            </AccountShell>
            <Overlay />
            <CancelServiceModalDialog
                serviceToCancelId={serviceToCancel}
                handleCancelService={handleCancelService}
                handleClearServiceToCancelAndClose={closeCancel}
            />
            <EditServiceModalDialog service={serviceForEdit} handleCancel={closeEdit} handleValidateService={handleUpdateService} />
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

export default ServicesPage;
