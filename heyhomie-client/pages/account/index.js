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
import { TextInput } from '../../components/ui/Input';
import { PrimaryButtonFull, SecondaryButtonFull } from '../../components/ui/Buttons';
import BottomNavDiv from '../../components/myaccount/main/bottomNav/BottomNavDiv';
import { ClearAllMenusAndModals, _pushToOverlayActionStack, _removeFromOverlayActionStack, _toggleMenu } from '../../lib/slices/uiSlice';
import RewardsModal from '../../components/myaccount/main/rewards/RewardsModal';
import MissionsComponent from '../../components/myaccount/main/missions/MissionsComponent';
import Footer from '../../components/utilpages/footer/Footer';
import { BASE_URL } from '../../api/url';

import { cancelMission, editMission } from '../../api/endpoints/missions';
import CancelMissionModalDialog from '../../components/myaccount/main/missions/CancelMissionModalDialog';
import ReferralMenu from '../../components/myaccount/main/referralmenu/ReferralMenu';
import ReferralSection from '../../components/myaccount/main/referralsection/ReferralSection';
import { detailUser } from '../../api/endpoints/user';
import EditMissionModalDialog from '../../components/myaccount/main/missions/EditMissionModalDialog';
import EditMissionCommentModalDialog from '../../components/myaccount/main/missions/EditMissionCommentModalDialog';

const Container = styled.div`
    ${tw`
        pt-24
        flex flex-col items-center
    `}

    @media(min-width: 768px) {
        margin-left: 18vw;
        margin-right: 18vw;
    }
`;
const AccountPageWelcome = styled.div`
    width: 100%;
    text-align: left;
    padding-left: 24px;

    h2 {
        font-weight: bold;
        font-size: 32px;
        line-height: 38px;
        color: ${theme`colors.primary.dark`};
    }
    h3 {
        font-size: 14px;
        line-height: 17px;
        color: ${theme`colors.primary.dark`};
    }

    @media (min-width: 678px) {
        padding-left: 0px;
        h2 {
            font-size: 40px;
            line-height: 48px;
        }
        h3 {
            font-size: 18px;
            line-height: 22px;
        }
    }
`;

function AccountPage({ cities }) {
    // UI translations for the component
    const t = useTranslations('AccountPage.IndexPage');

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

    // Lifted up missions state
    const [currentVisible, setCurrentVisible] = useState('upcoming');

    const [initialFetchLoading, setInitialFetchLoading] = useState(false);

    const [upcomingMissions, setUpcomingMissions] = useState([]);
    const [upcomingMissionsVisibleNumber, setUpcomingMissionsVisibleNumber] = useState(4);
    const [visibleUpcomingMissions, setVisibleUpcomingMissions] = useState([]);
    const [upcomingMissionsLoading, setUpcomingMissionsLoading] = useState(false);

    const [pastMissions, setPastMissions] = useState([]);
    const [pastMissionsVisibleNumber, setPastMissionsVisibleNumber] = useState(4);
    const [visiblePastMissions, setVisiblePastMissions] = useState([]);
    const [pastMissionsLoading, setPastMissionsLoading] = useState(false);
    // Handle cancel mission
    const [missionToCancel, setMissionToCancel] = useState('');
    const handleSetMissionForCancel = id => {
        setMissionToCancel(id);
        dispatch(_toggleMenu({ menu: 'cancelMissionModalDialog', isOpen: true }));
        dispatch(_pushToOverlayActionStack('cancelMissionModalDialog'));
    };
    const handleClearMissionToCancelAndClose = () => {
        setMissionToCancel('');
        dispatch(_toggleMenu({ menu: 'cancelMissionModalDialog', isOpen: false }));
        dispatch(_removeFromOverlayActionStack('cancelMissionModalDialog'));
    };
    const handleCancelMission = async id => {
        try {
            setUpcomingMissionsLoading(true);
            setPastMissionsLoading(true);

            dispatch(_toggleMenu({ menu: 'cancelMissionModalDialog', isOpen: false }));
            dispatch(_removeFromOverlayActionStack('cancelMissionModalDialog'));

            const res = await cancelMission(user.headers, user.x_token_user, id);

            if (res) {
                const workingArray = [...upcomingMissions];

                const index = workingArray.findIndex(m => m.id === id);

                workingArray[index].status = 'canceled';

                setUpcomingMissions(upcomingMissions => [...workingArray]);

                setUpcomingMissionsLoading(false);
                setPastMissionsLoading(false);
                toast.success(t(`cancelSuccess_msg`));

                setMissionToCancel('');
            }
        } catch (err) {
            setUpcomingMissionsLoading(false);
            setPastMissionsLoading(false);
            toast.error(t(`error_msg`));
            setMissionToCancel('');
            console.log(err);
        }
    };

    // Handle edit mission
    const [missionForEdit, setMissionForEdit] = useState('');
    const handleSetMissionForEdit = service => {
        const serviceFined = {};

        const configFromAPI = {};
        Object.keys(service).forEach(key => {
            if (
                key !== 'id' &&
                key !== 'cleaning_duration' &&
                key !== 'payment_method' &&
                key !== 'user_comment' &&
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

        setMissionForEdit({ ...serviceFined });

        dispatch(_toggleMenu({ menu: 'editMissionModalDialog', isOpen: true }));
        dispatch(_pushToOverlayActionStack('editMissionModalDialog'));
    };
    const handleClearMissionToEditAndClose = () => {
        setMissionForEdit('');
        dispatch(_toggleMenu({ menu: 'editMissionModalDialog', isOpen: false }));
        dispatch(_removeFromOverlayActionStack('editMissionModalDialog'));
    };
    const handleUpdateMission = async servicePayload => {
        try {
            setUpcomingMissionsLoading(true);
            setPastMissionsLoading(true);

            dispatch(_toggleMenu({ menu: 'editMissionModalDialog', isOpen: false }));
            dispatch(_removeFromOverlayActionStack('editMissionModalDialog'));

            const workingObj = { ...servicePayload.config };

            Object.keys(servicePayload).forEach(key => {
                if (key !== 'config') {
                    workingObj[key] = servicePayload[key];
                }
            });

            const payload = {
                mission: { ...workingObj },
            };

            const data = await editMission(user.headers, user.x_token_user, servicePayload.id, payload);

            if (data) {
                const workingArray = [...upcomingMissions];

                const index = workingArray.findIndex(s => s.id === servicePayload.id);

                workingArray[index] = { ...data.mission };

                setUpcomingMissions(upcomingMissions => [...workingArray]);

                setUpcomingMissionsLoading(false);
                setPastMissionsLoading(false);
                toast.success(t(`editSuccess_msg`));

                setMissionForEdit('');
            }
        } catch (err) {
            setUpcomingMissionsLoading(false);
            setPastMissionsLoading(false);
            toast.error(t(`error_msg`));
            setMissionForEdit('');
            console.log(err);
        }
    };

    // Editing comment
    const [missionForEditComment, setMissionForEditComment] = useState('');
    const handleSetMissionForEditComment = service => {
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

        setMissionForEditComment({ ...serviceFined });

        dispatch(_toggleMenu({ menu: 'editMissionCommentModalDialog', isOpen: true }));
        dispatch(_pushToOverlayActionStack('editMissionCommentModalDialog'));
    };
    const handleClearMissionToEditCommentAndClose = () => {
        setMissionForEditComment('');
        dispatch(_toggleMenu({ menu: 'editMissionCommentModalDialog', isOpen: false }));
        dispatch(_removeFromOverlayActionStack('editMissionCommentModalDialog'));
    };
    const handleUpdateMissionComment = async servicePayload => {
        try {
            setUpcomingMissionsLoading(true);
            setPastMissionsLoading(true);

            dispatch(_toggleMenu({ menu: 'editMissionCommentModalDialog', isOpen: false }));
            dispatch(_removeFromOverlayActionStack('editMissionCommentModalDialog'));

            const workingObj = { ...servicePayload.config };

            Object.keys(servicePayload).forEach(key => {
                if (key !== 'config') {
                    workingObj[key] = servicePayload[key];
                }
            });

            const payload = {
                mission: { ...workingObj },
            };

            const data = await editMission(user.headers, user.x_token_user, servicePayload.id, payload);

            if (data) {
                const workingArray = [...upcomingMissions];

                const index = workingArray.findIndex(s => s.id === servicePayload.id);

                workingArray[index] = { ...data.mission };

                setUpcomingMissions(upcomingMissions => [...workingArray]);

                setUpcomingMissionsLoading(false);
                setPastMissionsLoading(false);
                toast.success(t(`editSuccess_msg`));

                setMissionForEditComment('');
            }
        } catch (err) {
            setUpcomingMissionsLoading(false);
            setPastMissionsLoading(false);
            toast.error(t(`error_msg`));
            setMissionForEditComment('');
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
            <Topnav handleChangeLanguage={changeLocale} isAccount={true} />
            <Container>
                <AccountPageWelcome>
                    <h2>
                        {t(`welcomeDiv.hey_welcomeMsg`)} {user.first_name},
                    </h2>
                    <h3>{t(`welcomeDiv.howAreYou_welcomeMsg`)}</h3>
                </AccountPageWelcome>
                <ReferralSection />
                <MissionsComponent
                    currentVisible={currentVisible}
                    setCurrentVisible={setCurrentVisible}
                    initialFetchLoading={initialFetchLoading}
                    setInitialFetchLoading={setInitialFetchLoading}
                    upcomingMissions={upcomingMissions}
                    setUpcomingMissions={setUpcomingMissions}
                    upcomingMissionsVisibleNumber={upcomingMissionsVisibleNumber}
                    setUpcomingMissionsVisibleNumber={setUpcomingMissionsVisibleNumber}
                    visibleUpcomingMissions={visibleUpcomingMissions}
                    setVisibleUpcomingMissions={setVisibleUpcomingMissions}
                    upcomingMissionsLoading={upcomingMissionsLoading}
                    setUpcomingMissionsLoading={setUpcomingMissionsLoading}
                    pastMissions={pastMissions}
                    setPastMissions={setPastMissions}
                    pastMissionsVisibleNumber={pastMissionsVisibleNumber}
                    setPastMissionsVisibleNumber={setPastMissionsVisibleNumber}
                    visiblePastMissions={visiblePastMissions}
                    setVisiblePastMissions={setVisiblePastMissions}
                    pastMissionsLoading={pastMissionsLoading}
                    setPastMissionsLoading={setPastMissionsLoading}
                    handleSetMissionForCancel={handleSetMissionForCancel}
                    handleSetMissionForEdit={handleSetMissionForEdit}
                    handleSetMissionForEditComment={handleSetMissionForEditComment}
                />
                <BottomNavDiv />
            </Container>
            <Footer cities={cities} />
            {/* Overlay */}
            <Overlay />
            {/* Menus and modals */}
            {/* Menus */}
            <SidenavMenu />
            <ReferralMenu />
            {/* Modals */}
            <RewardsModal />
            <CancelMissionModalDialog
                missionToCancelId={missionToCancel}
                handleCancelMission={handleCancelMission}
                handleClearMissionToCancelAndClose={handleClearMissionToCancelAndClose}
            />
            <EditMissionModalDialog service={missionForEdit} handleCancel={handleClearMissionToEditAndClose} handleValidateService={handleUpdateMission} />
            <EditMissionCommentModalDialog
                service={missionForEditComment}
                handleCancel={handleClearMissionToEditCommentAndClose}
                handleValidateService={handleUpdateMissionComment}
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

export default AccountPage;
