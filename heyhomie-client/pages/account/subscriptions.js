/* eslint-disable no-useless-return */
/* eslint-disable no-shadow */
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import tw, { css, styled, theme } from 'twin.macro';

import { useTranslations } from 'next-intl';

import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import { initAccountSession, setHeaders } from '../../lib/slices/userSlice';

import 'react-toastify/dist/ReactToastify.css';

import Topnav from '../../components/utilpages/topnav/Topnav';
import Overlay from '../../components/citypage/menus/Overlay';
import SidenavMenu from '../../components/myaccount/sidenav/SidenavMenu';

import { ClearAllMenusAndModals, _pushToOverlayActionStack, _removeFromOverlayActionStack, _toggleMenu } from '../../lib/slices/uiSlice';

import ServicesComponent from '../../components/myaccount/subscriptions/services/ServicesComponent';
import Footer from '../../components/utilpages/footer/Footer';
import { BASE_URL } from '../../api/url';

import { cancelService, editService } from '../../api/endpoints/services';

import CancelServiceModalDialog from '../../components/myaccount/subscriptions/services/CancelServiceModalDialog';
import EditServiceModalDialog from '../../components/myaccount/subscriptions/services/EditServiceModalDialog';
import EditServiceCommentModalDialog from '../../components/myaccount/subscriptions/services/EditServiceCommentModalDialog';

const Container = styled.div`
    ${tw`
        pt-[120px]
        flex flex-col items-center
    `}

    min-height: 70vh;

    @media (min-width: 768px) {
        margin-left: 18vw;
        margin-right: 18vw;
    }
`;
const SubscriptionsPageHeader = styled.div`
    width: 100%;
    text-align: left;
    padding-left: 24px;

    button {
        margin-bottom: 28px;
    }
    button:focus {
        outline: none;
    }

    div {
        font-weight: bold;
        font-size: 28px;
    }

    @media (min-width: 678px) {
        padding-left: 0px;
    }
`;

function SubscriptionsPage({ cities }) {
    // UI translations for the component
    const t = useTranslations('AccountPage.SubscriptionsPage');

    // Redux state
    const dispatch = useDispatch();
    const { user, ui, order } = useSelector(state => state);

    // Topnav & redirect handlers
    const router = useRouter();
    const changeLocale = lang => {
        // set preffered language here
        router.push(router.pathname, router.asPath, { locale: lang });
    };
    const handlePushRedirect = url => {
        router.push(url);
    };

    // Lifted up services state
    const [currentVisible, setCurrentVisible] = useState('active');

    const [initialFetchLoading, setInitialFetchLoading] = useState(false);

    const [activeServices, setActiveServices] = useState([]);
    const [activeServicesVisibleNumber, setActiveServicesVisibleNumber] = useState(4);
    const [visibleActiveServices, setVisibleActiveServices] = useState([]);
    const [activeServicesLoading, setActiveServicesLoading] = useState(false);

    const [cancelledServices, setCancelledServices] = useState([]);
    const [cancelledServicesVisibleNumber, setCancelledServicesVisibleNumber] = useState(4);
    const [visibleCancelledServices, setVisibleCancelledServices] = useState([]);
    const [cancelledServicesLoading, setCancelledServicesLoading] = useState(false);
    // Handle cancel service
    const [serviceToCancel, setServiceToCancel] = useState('');
    const handleSetServiceForCancel = id => {
        setServiceToCancel(id);
        dispatch(_toggleMenu({ menu: 'cancelServiceModalDialog', isOpen: true }));
        dispatch(_pushToOverlayActionStack('cancelServiceModalDialog'));
    };
    const handleClearServiceToCancelAndClose = () => {
        setServiceToCancel('');
        dispatch(_toggleMenu({ menu: 'cancelServiceModalDialog', isOpen: false }));
        dispatch(_removeFromOverlayActionStack('cancelServiceModalDialog'));
    };
    const handleCancelService = async id => {
        try {
            setActiveServicesLoading(true);
            setCancelledServicesLoading(true);

            dispatch(_toggleMenu({ menu: 'cancelServiceModalDialog', isOpen: false }));
            dispatch(_removeFromOverlayActionStack('cancelServiceModalDialog'));

            const res = await cancelService(user.headers, user.x_token_user, id);

            if (res) {
                const workingArray = [...activeServices];
                const cancelledWorkingArray = [...cancelledServices];

                const serviceCanceled = workingArray.find(m => m.id === id);

                serviceCanceled.status = 'canceled';

                setActiveServices(activeServices => [...workingArray.filter(s => s.id !== id)]);

                setCancelledServices(cancelledServices => [...cancelledWorkingArray, serviceCanceled]);

                setActiveServicesLoading(false);
                setCancelledServicesLoading(false);
                toast.success(t(`cancelSuccess_msg`));

                setServiceToCancel('');
            }
        } catch (err) {
            setActiveServicesLoading(false);
            setCancelledServicesLoading(false);
            toast.error(t(`error_msg`));
            setServiceToCancel('');
            console.log(err);
        }
    };

    // Handle edit service
    const [serviceForEdit, setServiceForEdit] = useState('');
    const handleSetServiceForEdit = service => {
        const serviceFined = {};

        const configFromAPI = {};
        Object.keys(service).forEach(key => {
            if (
                key !== 'id' &&
                key !== 'type' &&
                key !== 'status' &&
                key !== 'city_id' &&
                key !== 'address_id' &&
                key !== 'address_name' &&
                key !== 'mission_date' &&
                key !== 'frequent_mission_day' &&
                key !== 'frequent_mission_time' &&
                key !== 'service_icon_image' &&
                key !== 'status'
            ) {
                configFromAPI[key] = service[key];
            } else {
                serviceFined[key] = service[key];
            }
        });

        serviceFined.config = { ...configFromAPI };

        setServiceForEdit({ ...serviceFined });

        dispatch(_toggleMenu({ menu: 'editServiceModalDialog', isOpen: true }));
        dispatch(_pushToOverlayActionStack('editServiceModalDialog'));
    };
    const handleClearServiceToEditAndClose = () => {
        setServiceForEdit('');
        dispatch(_toggleMenu({ menu: 'editServiceModalDialog', isOpen: false }));
        dispatch(_removeFromOverlayActionStack('editServiceModalDialog'));
    };
    const handleUpdateService = async servicePayload => {
        try {
            setActiveServicesLoading(true);
            setCancelledServicesLoading(true);

            dispatch(_toggleMenu({ menu: 'editServiceModalDialog', isOpen: false }));
            dispatch(_removeFromOverlayActionStack('editServiceModalDialog'));

            const workingObj = { ...servicePayload.config };

            Object.keys(servicePayload).forEach(key => {
                if (key !== 'config') {
                    workingObj[key] = servicePayload[key];
                }
            });

            const payload = {
                service: { ...workingObj },
            };

            const data = await editService(user.headers, user.x_token_user, servicePayload.id, payload);

            if (data) {
                const workingArray = [...activeServices];

                const index = workingArray.findIndex(s => s.id === servicePayload.id);

                workingArray[index] = { ...data.service };

                setActiveServices(activeServices => [...workingArray]);

                setActiveServicesLoading(false);
                setCancelledServicesLoading(false);
                toast.success(t(`editSuccess_msg`));

                setServiceForEdit('');
            }
        } catch (err) {
            setActiveServicesLoading(false);
            setCancelledServicesLoading(false);
            toast.error(t(`error_msg`));
            setServiceForEdit('');
            console.log(err);
        }
    };

    // Handle update service comment
    const [serviceForEditComment, setServiceForEditComment] = useState('');
    const handleSetServiceForEditComment = service => {
        const serviceFined = {};

        const configFromAPI = {};
        Object.keys(service).forEach(key => {
            if (
                key !== 'id' &&
                key !== 'type' &&
                key !== 'status' &&
                key !== 'city_id' &&
                key !== 'address_id' &&
                key !== 'address_name' &&
                key !== 'mission_date' &&
                key !== 'frequent_mission_day' &&
                key !== 'frequent_mission_time' &&
                key !== 'service_icon_image' &&
                key !== 'status'
            ) {
                configFromAPI[key] = service[key];
            } else {
                serviceFined[key] = service[key];
            }
        });

        serviceFined.config = { ...configFromAPI };

        setServiceForEditComment({ ...serviceFined });

        dispatch(_toggleMenu({ menu: 'editServiceCommentModalDialog', isOpen: true }));
        dispatch(_pushToOverlayActionStack('editServiceCommentModalDialog'));
    };
    const handleClearServiceToEditCommentAndClose = () => {
        setServiceForEditComment('');
        dispatch(_toggleMenu({ menu: 'editServiceCommentModalDialog', isOpen: false }));
        dispatch(_removeFromOverlayActionStack('editServiceCommentModalDialog'));
    };
    const handleUpdateServiceComment = async servicePayload => {
        try {
            setActiveServicesLoading(true);
            setCancelledServicesLoading(true);

            dispatch(_toggleMenu({ menu: 'editServiceCommentModalDialog', isOpen: false }));
            dispatch(_removeFromOverlayActionStack('editServiceCommentModalDialog'));

            const workingObj = { ...servicePayload.config };

            Object.keys(servicePayload).forEach(key => {
                if (key !== 'config') {
                    workingObj[key] = servicePayload[key];
                }
            });

            const payload = {
                service: { ...workingObj },
            };

            const data = await editService(user.headers, user.x_token_user, servicePayload.id, payload);

            if (data) {
                const workingArray = [...activeServices];

                const index = workingArray.findIndex(s => s.id === servicePayload.id);

                workingArray[index] = { ...data.service };

                setActiveServices(activeServices => [...workingArray]);

                setActiveServicesLoading(false);
                setCancelledServicesLoading(false);
                toast.success(t(`editSuccess_msg`));

                setServiceForEditComment('');
            }
        } catch (err) {
            setActiveServicesLoading(false);
            setCancelledServicesLoading(false);
            toast.error(t(`error_msg`));
            setServiceForEditComment('');
            console.log(err);
        }
    };

    // Set headers (authentication and other data agnostic)
    useEffect(() => {
        if (user && user.headers) {
            const headers = {
                acceptLanguage: router.locale,
                userLocale: router.locale,
            };
            dispatch(setHeaders(headers));
        }
    }, [user, router.locale]);

    useEffect(() => {
        dispatch(initAccountSession(handlePushRedirect));
    }, []);

    // Block scrolling on open menus/modals
    useEffect(() => {
        if (ui.overlayActionsStack.length > 0) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [ui.overlayActionsStack]);

    useEffect(() => {
        const hash = window && window.location.hash.replace(/^#\/?|\/$/g, '').split('/');

        if (ui.overlayActionsStack.length > 0) {
            if (!hash[0]) {
                router.push(
                    {
                        pathname: window && window.location.pathname,
                        hash: 'menuOpened',
                    },
                    undefined,
                    {
                        shallow: true,
                    }
                );
            } else {
                return;
            }
        } else {
            // eslint-disable-next-line no-lonely-if
            if (hash[0]) {
                router.push(
                    {
                        pathname: window && window.location.pathname,
                    },
                    undefined,
                    {
                        shallow: true,
                    }
                );
            } else {
                return;
            }
        }
    }, [ui.overlayActionsStack]);

    useEffect(() => {
        const verifyHash = () => {
            const hash = window.location.hash.replace(/^#\/?|\/$/g, '').split('/');
            if (!hash[0] && ui.overlayActionsStack.length > 0) {
                dispatch(ClearAllMenusAndModals());
            } else {
                return;
            }
        };

        verifyHash();
    });

    // Toasts configuration
    const contextClass = {
        success: 'bg-secondary-salad',
        error: 'bg-primary-maroon',
        warning: 'bg-primary-orange',
    };

    return (
        <>
            <Head>
                <title>{t(`meta.title`)}</title>
                <meta name='description' content={t(`meta.description`)} />
                <meta property='og:type' content='website' />
                <meta property='og:url' content='https://www.heyhomie.io/' />
                <meta property='og:title' content={t(`meta.og_title`)} />
                <meta property='og:description' content={t(`meta.og_description`)} />
            </Head>
            <ToastContainer
                toastClassName={({ type }) =>
                    `${contextClass[type || 'default']} flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer font-bold`
                }
                bodyClassName={() => 'p-3'}
            />
            <Topnav handleChangeLanguage={changeLocale} />
            <Container>
                <SubscriptionsPageHeader>
                    <button
                        onClick={() => {
                            handlePushRedirect('/account');
                        }}
                    >
                        <svg width='30' height='23' viewBox='0 0 30 23' fill='none' xmlns='http://www.w3.org/2000/svg'>
                            <path
                                d='M28.7761 9.82594H4.43679L11.7155 2.07504C12.193 1.60066 12.193 0.831427 11.7155 0.355789C11.2364 -0.118596 10.4615 -0.118596 9.98402 0.355789L0 11.0674L9.8308 21.8535C10.0702 22.091 10.3829 22.2101 10.6965 22.2101C11.0092 22.2101 11.3229 22.091 11.5623 21.8535C12.0398 21.3782 12.0398 20.6099 11.5623 20.1346L4.35814 12.2568H28.7761C29.4514 12.2568 30 11.7125 30 11.0414C30 10.3702 29.4514 9.82594 28.7761 9.82594Z'
                                fill='#14133A'
                            />
                        </svg>
                    </button>
                    <div>
                        <span style={{ color: '#727189' }}>
                            {t(`breadCrumbs.dashboard`)}
                            {` `}/{` `}
                        </span>
                        <span>{t(`breadCrumbs.heading`)}</span>
                    </div>
                </SubscriptionsPageHeader>
                <ServicesComponent
                    currentVisible={currentVisible}
                    setCurrentVisible={setCurrentVisible}
                    initialFetchLoading={initialFetchLoading}
                    setInitialFetchLoading={setInitialFetchLoading}
                    activeServices={activeServices}
                    setActiveServices={setActiveServices}
                    activeServicesVisibleNumber={activeServicesVisibleNumber}
                    setActiveServicesVisibleNumber={setActiveServicesVisibleNumber}
                    visibleActiveServices={visibleActiveServices}
                    setVisibleActiveServices={setVisibleActiveServices}
                    activeServicesLoading={activeServicesLoading}
                    setActiveServicesLoading={setActiveServicesLoading}
                    cancelledServices={cancelledServices}
                    setCancelledServices={setCancelledServices}
                    cancelledServicesVisibleNumber={cancelledServicesVisibleNumber}
                    setCancelledServicesVisibleNumber={setCancelledServicesVisibleNumber}
                    visibleCancelledServices={visibleCancelledServices}
                    setVisibleCancelledServices={setVisibleCancelledServices}
                    cancelledServicesLoading={cancelledServicesLoading}
                    setCancelledServicesLoading={setCancelledServicesLoading}
                    handleSetServiceForCancel={handleSetServiceForCancel}
                    handleSetServiceForEdit={handleSetServiceForEdit}
                    handleSetServiceForEditComment={handleSetServiceForEditComment}
                />
            </Container>
            <Footer cities={cities} />
            {/* Overlay */}
            <Overlay />
            {/* Menus and modals */}
            {/* Menus */}
            <SidenavMenu />
            {/* Modals */}
            <CancelServiceModalDialog
                serviceToCancelId={serviceToCancel}
                handleCancelService={handleCancelService}
                handleClearServiceToCancelAndClose={handleClearServiceToCancelAndClose}
            />
            <EditServiceModalDialog service={serviceForEdit} handleCancel={handleClearServiceToEditAndClose} handleValidateService={handleUpdateService} />
            <EditServiceCommentModalDialog
                service={serviceForEditComment}
                handleCancel={handleClearServiceToEditCommentAndClose}
                handleValidateService={handleUpdateServiceComment}
            />
        </>
    );
}

export async function getServerSideProps(context) {
    try {
        const resCities = await fetch(`${BASE_URL}api/v1/cities`);

        const { cities } = await resCities.json();

        return {
            props: {
                cities,
            },
        };
    } catch (err) {
        console.log(err);
    }

    return { props: {} };
}

export default SubscriptionsPage;
