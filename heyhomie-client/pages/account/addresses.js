/* eslint-disable no-useless-return */
/* eslint-disable no-lonely-if */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import { useTranslations } from 'next-intl';

import { useDispatch, useSelector, useStore } from 'react-redux';

import tw, { css, styled, theme } from 'twin.macro';

import { ToastContainer } from 'react-toastify';
import { initAccountSession, setHeaders } from '../../lib/slices/userSlice';
import { BASE_URL } from '../../api/url';
import 'react-toastify/dist/ReactToastify.css';

import Topnav from '../../components/utilpages/topnav/Topnav';
import Footer from '../../components/utilpages/footer/Footer';

import AddressesComponent from '../../components/myaccount/addresses/AddressesComponent';

import Overlay from '../../components/citypage/menus/Overlay';
import SidenavMenu from '../../components/myaccount/sidenav/SidenavMenu';
import DeleteAddressModalDialog from '../../components/myaccount/addresses/DeleteAddressModalDialog';
import EditAddressModalDialog from '../../components/myaccount/addresses/EditAddressModalDialog';
import AddNewAddressModalDialog from '../../components/myaccount/addresses/AddAddressModalDialog';
import { ClearAllMenusAndModals, _pushToOverlayActionStack, _removeFromOverlayActionStack, _toggleMenu } from '../../lib/slices/uiSlice';
import { addNewAddressMyAccount, deleteAddressThunk, updateAddress } from '../../lib/slices/addressesSlice';

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
const AddressesPageHeader = styled.div`
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

function AddressesPage({ cities }) {
    // UI translations for the component
    const t = useTranslations('AccountPage.AddressesPage');

    // Redux state
    const dispatch = useDispatch();
    const { user, ui, order, addresses } = useSelector(state => state);

    // Topnav & redirect handlers
    const router = useRouter();
    const changeLocale = lang => {
        // set preffered language here
        router.push(router.pathname, router.asPath, { locale: lang });
    };
    const handlePushRedirect = url => {
        router.push(url);
    };

    // Deleting address
    const [addressToDelete, setAddressToDelete] = useState('');
    const handleSetAddressForDelete = address => {
        setAddressToDelete(address);
        dispatch(_toggleMenu({ menu: 'deleteAddressModalDialog', isOpen: true }));
        dispatch(_pushToOverlayActionStack('deleteAddressModalDialog'));
    };
    const handleClearAddressToDeleteAndClose = () => {
        setAddressToDelete('');
        dispatch(_toggleMenu({ menu: 'deleteAddressModalDialog', isOpen: false }));
        dispatch(_removeFromOverlayActionStack('deleteAddressModalDialog'));
    };
    const handleDeleteAddress = id => {
        setAddressToDelete('');

        dispatch(deleteAddressThunk(id, t(`deleteSuccess_msg`), t(`error_msg`)));

        dispatch(_toggleMenu({ menu: 'deleteAddressModalDialog', isOpen: false }));
        dispatch(_removeFromOverlayActionStack('deleteAddressModalDialog'));
    };

    // Editing address
    const [addressForEdit, setAddressForEdit] = useState('');
    const handleSetAddressForEdit = address => {
        setAddressForEdit(address);
        dispatch(_toggleMenu({ menu: 'editAddressModalDialog', isOpen: true }));
        dispatch(_pushToOverlayActionStack('editAddressModalDialog'));
    };
    const handleClearAddressToEditAndClose = () => {
        setAddressForEdit('');
        dispatch(_toggleMenu({ menu: 'editAddressModalDialog', isOpen: false }));
        dispatch(_removeFromOverlayActionStack('editAddressModalDialog'));
    };
    const handleUpdateAddress = (addressID, updatedData) => {
        setAddressForEdit('');

        dispatch(updateAddress(addressID, updatedData, t(`editSuccess_msg`), t(`error_msg`)));

        dispatch(_toggleMenu({ menu: 'editAddressModalDialog', isOpen: false }));
        dispatch(_removeFromOverlayActionStack('editAddressModalDialog'));
    };

    // Adding new address
    const handleSetAddNewAddress = () => {
        dispatch(_toggleMenu({ menu: 'addAddressModalDialog', isOpen: true }));
        dispatch(_pushToOverlayActionStack('addAddressModalDialog'));
    };
    const handleCloseAddAddress = () => {
        dispatch(_toggleMenu({ menu: 'addAddressModalDialog', isOpen: false }));
        dispatch(_removeFromOverlayActionStack('addAddressModalDialog'));
    };
    const handleAddAddress = addressToAdd => {
        dispatch(_toggleMenu({ menu: 'addAddressModalDialog', isOpen: false }));
        dispatch(_removeFromOverlayActionStack('addAddressModalDialog'));

        dispatch(addNewAddressMyAccount(addressToAdd, t(`addSuccess_msg`), t(`error_msg`)));
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
                <AddressesPageHeader>
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
                </AddressesPageHeader>
                <AddressesComponent
                    handleSetAddressForDelete={handleSetAddressForDelete}
                    handleSetAddressForEdit={handleSetAddressForEdit}
                    handleSetAddNewAddress={handleSetAddNewAddress}
                />
            </Container>
            <Footer cities={cities} />
            {/* Overlay */}
            <Overlay />
            {/* Menus and modals */}
            {/* Menus */}
            <SidenavMenu />
            {/* Modals */}
            <DeleteAddressModalDialog
                addressToDelete={addressToDelete}
                handleCancel={handleClearAddressToDeleteAndClose}
                handleDeleteAddress={handleDeleteAddress}
            />
            <EditAddressModalDialog address={addressForEdit} handleCancel={handleClearAddressToEditAndClose} handleValidateAddress={handleUpdateAddress} />
            <AddNewAddressModalDialog cities={cities} handleCancel={handleCloseAddAddress} handleValidateAddress={handleAddAddress} />
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

export default AddressesPage;
