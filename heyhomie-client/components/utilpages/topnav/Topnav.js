import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import useWindowSize from '../../../hooks/useWindowResize';
import { LogoContainer, TopnavButtonsContainer } from './styledComponents';
import ChangeLanguageWidget from './ChangeLanguageWidget';
import ContactInformationDropdown from './ContactInformation';
import LinksDropdown from './LinksDropdown';
import ChangeCityWidget from './ChangeCityWidget';
import { _pushToOverlayActionStack, _toggleMenu } from '../../../lib/slices/uiSlice';

const Topnav = ({ handleChangeLanguage, handlePushCustom, cities, handleChangeCity, promptChangeCityResetOrderMenu, extraButtons, isAccount }) => {
    const dispatch = useDispatch();
    const { user, order } = useSelector(state => state);
    const t = useTranslations('CityPage.Topnav');
    const router = useRouter();

    const handlePush = handlePushCustom || router.push;
    const [isEnoughSpace, setIsEnoughSpace] = useState();
    const windowSize = typeof window === 'undefined' ? { height: '', width: '' } : useWindowSize();

    useEffect(() => {
        setIsEnoughSpace(windowSize.width >= 700);
    }, [windowSize]);

    //* User account button related code

    const handleUserAccountClick = () => {
        if (user && user.isAuthenticated) {
            handlePush('/account');
        } else {
            dispatch(_toggleMenu({ menu: 'signUpMenuOpen', isOpen: true }));
            dispatch(_pushToOverlayActionStack('signUpMenuOpen'));
            handlePush('/');
        }
    };

    //* Order button related code
    const activeOrdersCount = order?.services.filter(s => s.statusLocal !== 'staging').length || 0;
    const isOrderActive = activeOrdersCount > 0;
    const accountButtonClass = `p-2 focus:outline-none flex align-center`;
    const orderButtonClass = `px-2 focus:outline-none ${isOrderActive ? 'block cursor-pointer' : 'hidden cursor-default'}`;

    const openOrderMenu = () => {
        dispatch(_toggleMenu({ menu: 'bookingMenuOpen', isOpen: true }));
        dispatch(_pushToOverlayActionStack('bookingMenuOpen'));
    };

    const handleOrderClick = () => {
        if (!isOrderActive) {
            handlePush('/');
        } else if (extraButtons) {
            openOrderMenu();
        } else {
            handlePush('/');
            setTimeout(() => {
                openOrderMenu();
            }, 1000);
        }
    };

    return (
        <nav className='absolute w-full z-20'>
            <div className={`flex items-top justify-between ${cities ? 'py-3 pl-3' : 'p-3'} lg:px-10`}>
                {/* Logo */}
                <LogoContainer onClick={() => handlePush('/')}>
                    <Image src='/icons/logo.svg' width={75} height={55} />
                </LogoContainer>

                <TopnavButtonsContainer between={cities}>
                    {/* Contact Information Dropdown */}
                    <ContactInformationDropdown isEnoughSpace={isEnoughSpace} />

                    {/* Extra Buttons for specific pages */}
                    {isEnoughSpace && extraButtons && (
                        <div>
                            <button
                                className={`
                                    hidden
                                    transition ease-in-out duration-300
                                    sm:flex flex-wrap justify-center items-center
                                    p-2
                                    px-12px md:px-16px
                                    bg-transparent
                                    hover:bg-secondary-saladLight
                                    focus:outline-none focus:backgroundColor focus:bg-secondary-saladLight
                                `}
                                style={{
                                    borderRadius: '20px',
                                }}
                                onClick={() => {
                                    handlePush('/about');
                                }}
                            >
                                {t(`aboutLink`)}
                            </button>
                        </div>
                    )}

                    {/* Links Dropdown */}
                    {isEnoughSpace && <LinksDropdown handlePush={handlePush} />}

                    {/* Change City Widget for [city].js */}
                    {cities && (
                        <ChangeCityWidget
                            cities={cities}
                            handleChangeCity={handleChangeCity}
                            promptChangeCityResetOrderMenu={promptChangeCityResetOrderMenu}
                            isEnoughSpace={isEnoughSpace}
                        />
                    )}

                    {/* Change Language Widget */}
                    <ChangeLanguageWidget handleChangeLanguage={handleChangeLanguage} isEnoughSpace={isEnoughSpace} />

                    {/* User Account Button */}
                    <button className={accountButtonClass} onClick={handleUserAccountClick} style={{ height: '40px', minWidth: '40px' }}>
                        <Image src='/icons/account.svg' width={24} height={24} />
                        {isEnoughSpace && <span className='pl-0.5'>{t('myAccount')}</span>}
                    </button>

                    {/* Show mobile menu button on account page and hide order button */}
                    {isAccount ? (
                        <button
                            // p-2
                            className={`
                                focus:outline-none
                                md:hidden
                            `}
                            onClick={() => {
                                dispatch(_toggleMenu({ menu: 'accountSidenavMenuOpen', isOpen: true }));
                                dispatch(_pushToOverlayActionStack('accountSidenavMenuOpen'));
                            }}
                        >
                            <Image src='/icons/menu.svg' width={32} height={32} />
                        </button>
                    ) : (
                        <button className={orderButtonClass} onClick={handleOrderClick} disabled={!isOrderActive}>
                            <div
                                className='bg-secondary-salad font-bold text-14px'
                                style={{ borderRadius: '50%', width: '26px', height: '26px', verticalAlign: 'middle', lineHeight: '26px' }}
                            >
                                {activeOrdersCount}
                            </div>
                        </button>
                    )}
                </TopnavButtonsContainer>
            </div>
        </nav>
    );
};

export default Topnav;
