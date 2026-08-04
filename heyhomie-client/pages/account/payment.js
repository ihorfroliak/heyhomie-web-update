/* eslint-disable no-useless-return */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import { useTranslations } from 'next-intl';

import { useDispatch, useSelector } from 'react-redux';
import tw, { css, styled, theme } from 'twin.macro';
import { ToastContainer } from 'react-toastify';
import { initAccountSession, setHeaders } from '../../lib/slices/userSlice';
import { addNewCard, deleteCardMyAccount } from '../../lib/slices/cardsSlice';

import 'react-toastify/dist/ReactToastify.css';

import Topnav from '../../components/utilpages/topnav/Topnav';
import Overlay from '../../components/citypage/menus/Overlay';
import SidenavMenu from '../../components/myaccount/sidenav/SidenavMenu';
import CardsComponent from '../../components/myaccount/payment/CardsComponent';

import DeleteCardModalDialog from '../../components/myaccount/payment/DeleteCardModalDialog';
import AddNewCardModalDialog from '../../components/myaccount/payment/AddNewCardModalDialog';
import { ClearAllMenusAndModals, _pushToOverlayActionStack, _removeFromOverlayActionStack, _toggleMenu } from '../../lib/slices/uiSlice';
import BillingsComponent from '../../components/myaccount/payment/BillingsComponent';
import { BASE_URL } from '../../api/url';
import Footer from '../../components/utilpages/footer/Footer';

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
const PaymentPageHeader = styled.div`
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

function PaymentPage({ cities }) {
    // UI translations for the component
    const t = useTranslations('AccountPage.PaymentPage');

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

    // Add and delete cards
    // Delete card
    const [cardToDelete, setCardToDelete] = useState('');
    const handleSetCardForDelete = card => {
        setCardToDelete(card);
        dispatch(_toggleMenu({ menu: 'deleteCardModalDialog', isOpen: true }));
        dispatch(_pushToOverlayActionStack('deleteCardModalDialog'));
    };
    const handleClearCardToDeleteAndClose = () => {
        setCardToDelete('');
        dispatch(_toggleMenu({ menu: 'deleteCardModalDialog', isOpen: false }));
        dispatch(_removeFromOverlayActionStack('deleteCardModalDialog'));
    };
    const handleDeleteCard = id => {
        setCardToDelete('');

        dispatch(deleteCardMyAccount(id, t(`deleteSuccess_msg`), t(`error_msg`)));

        dispatch(_toggleMenu({ menu: 'deleteCardModalDialog', isOpen: false }));
        dispatch(_removeFromOverlayActionStack('deleteCardModalDialog'));
    };

    // Adding new card
    const handleSetAddNewCard = () => {
        dispatch(_toggleMenu({ menu: 'addCardModalDialog', isOpen: true }));
        dispatch(_pushToOverlayActionStack('addCardModalDialog'));
    };
    const handleCloseAddCard = () => {
        dispatch(_toggleMenu({ menu: 'addCardModalDialog', isOpen: false }));
        dispatch(_removeFromOverlayActionStack('addCardModalDialog'));
    };
    const handleAddCard = cardToAdd => {
        dispatch(_toggleMenu({ menu: 'addCardModalDialog', isOpen: false }));
        dispatch(_removeFromOverlayActionStack('addCardModalDialog'));

        dispatch(
            addNewCard(cardToAdd, t(`error_msg`), () => {
                dispatch(_toggleMenu({ menu: 'addCardModalDialog', isOpen: false }));
                dispatch(_removeFromOverlayActionStack('addCardModalDialog'));
            })
        );
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
                <PaymentPageHeader>
                    <button
                        onClick={() => {
                            handlePushRedirect('/account');
                        }}
                    >
                        <svg width='30' height='23' viewBox='0 0 30 23' fill='none' xmlns='http://www.w3.org/2000/svg'>
                            <path
                                d='M28.7761 9.82594H4.43679L11.7155 2.07504C12.193 1.60066 12.193 0.831427 11.7155 0.355789C11.2364 -0.118596 10.4615 -0.118596 9.98402 0.355789L0 11.0674L9.8308 21.8535C10.0702 22.091 10.3829 22.2101 10.6965 22.2101C11.0092 22.2101 11.3229 22.091 11.5623 21.8535C12.0398 21.3782 12.0398 20.6099 11.5623 20.1346L4.35814 12.2568H28.7761C29.4514 12.2568 30 11.7125 30 11.0414C30 10.3702 29.4514 9.82594 28.7761 9.82594Z'
                                fill='#141338'
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
                </PaymentPageHeader>
                <CardsComponent handleSetCardForDelete={handleSetCardForDelete} handleSetAddNewCard={handleSetAddNewCard} />
                <BillingsComponent />
            </Container>
            <Footer cities={cities} />
            {/* Overlay */}
            <Overlay />
            {/* Menus and modals */}
            <SidenavMenu />
            {/* Modals */}
            <DeleteCardModalDialog cardToDelete={cardToDelete} handleCancel={handleClearCardToDeleteAndClose} handleDeleteCard={handleDeleteCard} />
            <AddNewCardModalDialog handleCancel={handleCloseAddCard} />
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

export default PaymentPage;
