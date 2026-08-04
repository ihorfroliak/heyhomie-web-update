import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import tw, { css, styled, theme } from 'twin.macro';
import { useTranslations } from 'next-intl';

import Image from 'next/image';
import { useRouter } from 'next/router';
import StyledSidebar from '../Sidebar';

import { _pushToOverlayActionStack, _removeFromOverlayActionStack, _toggleMenu } from '../../../../lib/slices/uiSlice';
import ServiceCardBooking from './ServiceCard';
import { PrimaryButtonFull, PrimaryButtonOutlined } from '../../../ui/Buttons';
import { calculatePriceForOrder } from '../../../../api/endpoints/orders';
import PopupMessage from '../../../ui/PopupMessage';
import stylesShaking from '../../../../styles/ShakingText.module.css';
import AddCouponCode from './addCouponCode';
import { confirmOrderClearOrderState } from '../../../../lib/slices/orderSlice';

const ContentContainer = styled.div`
    position: relative;
    padding-top: 0px;
    padding-bottom: 0px;

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    width: 100%;
    height: 100%;

    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
`;

const StyledHeading = styled.h1`
    margin-left: 24px;
    margin-right: 40px;

    font-size: 40px;
    font-weight: bold;
    ${tw`text-primary-dark`}
    line-height: 48px;

    @media (max-width: 768px) {
        font-size: 36px;
    }
`;
const CurrentCityDiv = styled.div`
    padding-left: 27px;
    padding-right: 47px;

    ${tw`
        w-full flex flex-row items-center justify-start
        text-primary-grey
    `}

    svg {
        position: relative;
        top: 2px;
    }

    span {
        margin-left: 8px;
    }
`;

const ServicesContainer = styled.div`
    ${properties =>
        properties.services > 1
            ? css`
                  height: 410px;
              `
            : css`
                  height: 360px;
              `};
    width: 100%;

    padding: 16px;
    padding-top: 28px;

    display: flex;
    flex-direction: column;
`;

const Separator = styled.div`
    border-top: 1px solid;

    width: 100%;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 16px;

    ${tw`
            border-secondary-grey
        `}
`;
const ControlsDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    width: 100%;

    padding-left: 40px;
    padding-right: 40px;

    padding-top: 0px;
`;

const ServicesBilling = styled.div`
    flex-grow: 1;

    ${tw`
            text-14px
        `}
`;

const UserContainer = styled.div`
    width: 100%;

    padding: 0 40px;
`;

// Always fall back to the first payment option (Pay Later / Cash) so a card is never required
// and `defaultCard` is never undefined (which would crash on defaultCard.brand).
const resolveDefaultCard = list => (list || []).find(card => card.default === true) || (list || [])[0];

const BookingMenu = () => {
    // Popup
    const [isBillingPopupOpen, setIsBillingPopupOpen] = useState(false);

    // Redux state
    const dispatch = useDispatch();
    const { ui, order, user, cards } = useSelector(state => state);

    // UI translations for the component
    const t = useTranslations('CityPage.BookingMenu');

    // Component state
    const [bookingAllowed, setBookingAllowed] = useState(false);
    const [servicesBilling, setServicesBilling] = useState([]);
    const [defaultCard, setDefaultCard] = useState(resolveDefaultCard(cards.cards));

    const router = useRouter();
    const [isAnimating, setIsAnimating] = useState(false);

    const handleClick = () => {
        setIsAnimating(true);
        // After a certain duration, reset the animation
        setTimeout(() => {
            setIsAnimating(false);
        }, 700); // Adjust the duration as needed
    };

    const redirectCallback = () => {
        router
            .push(
                {
                    pathname: window && window.location.pathname,
                },
                undefined,
                {
                    shallow: true,
                }
            )
            .then(() => {
                router.push('/account');
            });
    };

    const isAddressOrTimeEdited = ui.overlayActionsStack.some(
        stackItem => stackItem.includes('SelectAddressSubmenuOpen') || stackItem.includes('DatePickerSubmenu') || stackItem.includes('AddCommentSubmenuOpen')
    );

    // Calculate prices
    useEffect(() => {
        async function calculatePrices() {
            try {
                const { service_prices } = await calculatePriceForOrder(user.headers, user.x_token_user, user.x_token_visitor, order.id);
                setServicesBilling(servicesBilling => [...service_prices]);
            } catch (err) {
                console.log(err);
                setServicesBilling(servicesBilling => []);
            }
        }

        if (!order.confirmOrderLoading && order.id && order.services.filter(s => s.statusLocal === 'added').length > 0) {
            calculatePrices();
        } else {
            setServicesBilling(servicesBilling => []);
        }
    }, [order.services]);

    useEffect(() => {
        function checkBookingAllowed() {
            if (order.services.length > 0) {
                let allowed = true;
                for (let i = 0; i < order.services.length; i++) {
                    if (!order.services[i].address.address_id || !order.services[i].date_time.mission_date) {
                        allowed = false;
                        break;
                    }
                }

                if (!user.isAuthenticated) {
                    allowed = false;
                }

                if (cards.cards.length > 0) {
                    setDefaultCard(resolveDefaultCard(cards.cards));
                } else {
                    allowed = false;
                }

                setBookingAllowed(allowed);
            } else {
                dispatch(_toggleMenu({ menu: 'bookingMenuOpen', isOpen: false }));
                dispatch(_removeFromOverlayActionStack('bookingMenuOpen'));
            }
        }

        checkBookingAllowed();
    }, [order.services, user.isAuthenticated, cards.cards]);

    return (
        <StyledSidebar isOpen={ui.bookingMenuOpen} order={0}>
            <ContentContainer>
                {/* Upper container */}
                <ServicesContainer services={order.services.length}>
                    <StyledHeading>{t(`heading`)}</StyledHeading>
                    <CurrentCityDiv>
                        <svg width='12' height='16' viewBox='0 0 12 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
                            <path
                                d='M5.98672 15.8408C5.64446 15.8408 5.33796 15.6633 5.16689 15.3659C5.16509 15.3628 5.16334 15.3596 5.16159 15.3565L1.27339 8.23968C0.345265 6.54088 0.371878 4.5245 1.34459 2.84589C2.2962 1.20365 3.98645 0.200349 5.86603 0.162007C5.94633 0.160353 6.02706 0.160353 6.10729 0.162007C7.9869 0.200349 9.67716 1.20365 10.6288 2.84589C11.6015 4.5245 11.6281 6.54085 10.7 8.23968L6.81179 15.3565C6.81005 15.3596 6.8083 15.3628 6.80649 15.3659C6.63545 15.6632 6.32899 15.8408 5.98672 15.8408ZM5.98669 1.14078C5.95304 1.14078 5.91947 1.14112 5.88597 1.14179C4.35169 1.17309 2.97093 1.99381 2.19247 3.33723C1.39295 4.71704 1.37083 6.37407 2.13337 7.76977L5.98669 14.8227L9.83999 7.7698C10.6025 6.37407 10.5804 4.71704 9.78085 3.33723C9.0024 1.99384 7.62164 1.17309 6.08736 1.14179C6.05395 1.14112 6.02035 1.14078 5.98669 1.14078Z'
                                fill='#727189'
                            />
                            <path
                                d='M5.99015 7.26607C4.77431 7.26607 3.78516 6.27692 3.78516 5.06108C3.78516 3.84523 4.77431 2.85608 5.99015 2.85608C7.206 2.85608 8.19515 3.84523 8.19515 5.06108C8.19515 6.27692 7.20603 7.26607 5.99015 7.26607ZM5.99015 3.83608C5.31469 3.83608 4.76516 4.38561 4.76516 5.06108C4.76516 5.73654 5.31469 6.28607 5.99015 6.28607C6.66562 6.28607 7.21515 5.73654 7.21515 5.06108C7.21515 4.38561 6.66562 3.83608 5.99015 3.83608Z'
                                fill='#727189'
                            />
                            <path
                                fillRule='evenodd'
                                clipRule='evenodd'
                                d='M5.99203 7.3449C4.732 7.3449 3.70703 6.31992 3.70703 5.0599C3.70703 3.79988 4.732 2.7749 5.99203 2.7749C7.25205 2.7749 8.27702 3.79988 8.27702 5.0599C8.27702 6.31992 7.25208 7.3449 5.99203 7.3449ZM5.99203 3.9149C5.36075 3.9149 4.84703 4.42862 4.84703 5.0599C4.84703 5.69118 5.36075 6.2049 5.99203 6.2049C6.62331 6.2049 7.13703 5.69118 7.13703 5.0599C7.13703 4.42862 6.62331 3.9149 5.99203 3.9149ZM3.78703 5.0599C3.78703 6.27574 4.77619 7.2649 5.99203 7.2649C7.2079 7.2649 8.19702 6.27574 8.19702 5.0599C8.19702 3.84406 7.20787 2.8549 5.99203 2.8549C4.77619 2.8549 3.78703 3.84406 3.78703 5.0599ZM4.76703 5.0599C4.76703 4.38444 5.31656 3.8349 5.99203 3.8349C6.66749 3.8349 7.21703 4.38444 7.21703 5.0599C7.21703 5.73536 6.66749 6.2849 5.99203 6.2849C5.31656 6.2849 4.76703 5.73536 4.76703 5.0599Z'
                                fill='#727189'
                            />
                        </svg>
                        <span>
                            {/* Translation */}
                            {t(user.selectedCity ? `cityNames.${user.selectedCity}` : `cityNames.default`)}
                        </span>
                    </CurrentCityDiv>
                    <div className='flex flex-row relative mb-2 px-7'>
                        <p className='text-sm underline italic text-primary-dark '>{t('heading_instruction')}</p>
                        <span className='text-md text-primary-maroon pl-0.5 no-underline'>*</span>
                    </div>
                    <div className={`overflow-y-scroll ${order.services.length > 1 && 'h-full'} p-1.5`}>
                        {order &&
                            order.services
                                .filter(s => s.statusLocal !== 'staging')
                                .map(service => (
                                    <ServiceCardBooking
                                        key={service.homie_service_id}
                                        service={service}
                                        isAddressOrTimeEdited={isAddressOrTimeEdited}
                                        isAnimating={isAnimating}
                                    />
                                ))}
                    </div>
                </ServicesContainer>
                {/* Middle container */}
                <UserContainer>
                    <Separator />
                    <p className={`text-24px font-bold text-primary-dark relative mb-2`}>{t('PersonalInformation.heading')}</p>
                    <button
                        className='flex gap-x-2 ml-3 mb-3'
                        onClick={() => {
                            if (!user.isAuthenticated) {
                                dispatch(_toggleMenu({ menu: `signUpMenuOpen`, isOpen: true }));
                                dispatch(_pushToOverlayActionStack(`signUpMenuOpen`));
                            }
                        }}
                    >
                        <Image src='/icons/account.svg' width={25} height={25} />
                        <div className={`flex ${isAnimating && !user.isAuthenticated ? stylesShaking.animating : ''}`}>
                            <p>{user.isAuthenticated ? `${user.first_name} ${user.last_name}` : `${t('PersonalInformation.account')}`}</p>
                            <span className='text-md text-primary-maroon pl-0.5'>*</span>
                        </div>
                    </button>
                    <button
                        className='flex gap-x-2 ml-3'
                        onClick={() => {
                            if (user.isAuthenticated) {
                                dispatch(_toggleMenu({ menu: `validatePaymentConfirmOrderMenuOpen`, isOpen: true }));
                                dispatch(_pushToOverlayActionStack(`validatePaymentConfirmOrderMenuOpen`));
                            }
                        }}
                    >
                        <Image src='/icons/payment.svg' width={25} height={25} />
                        <div className={`flex ${isAnimating && defaultCard === null ? stylesShaking.animating : ''}`}>
                            <p>
                                {defaultCard ? `${defaultCard.brand}` : ''} {defaultCard && defaultCard.last4 && `***-${defaultCard.last4}`}
                            </p>
                            <span className='text-md text-primary-maroon pl-0.5'>*</span>
                        </div>
                    </button>
                </UserContainer>

                {/* Bottom container */}
                <ControlsDiv>
                    <AddCouponCode />
                    <Separator />
                    <div className={`text-18px font-bold text-primary-dark relative mb-2`}>
                        <PopupMessage
                            message={t(`servicesBilling.billing_msg`)}
                            position={{ bottom: '2rem', left: '20px' }}
                            isOpen={isBillingPopupOpen}
                            setIsOpen={setIsBillingPopupOpen}
                        />
                        {t(`servicesBilling.billing_heading`)}
                        <button
                            style={{
                                position: 'relative',
                                left: '8px',
                                top: '-.35rem',
                                width: '12px',
                                height: '12px',
                                outline: 'none',
                            }}
                            onMouseEnter={() => setIsBillingPopupOpen(true)}
                            onMouseLeave={() => setIsBillingPopupOpen(false)}
                            onClick={() => setIsBillingPopupOpen(!isBillingPopupOpen)}
                        >
                            <svg
                                style={{ position: 'absolute', top: 0 }}
                                width='12'
                                height='12'
                                viewBox='0 0 12 12'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <circle cx='6' cy='6' r='5.5' fill='#141338' stroke='#141338' />
                            </svg>
                            <span style={{ position: 'absolute', left: '4px', top: '0', color: 'white', fontSize: '8px' }}>
                                <em>i</em>
                            </span>
                        </button>
                    </div>
                    <ServicesBilling>
                        {servicesBilling.length > 0 &&
                            servicesBilling.map(service => (
                                <div
                                    key={service.type}
                                    className={`
                                        flex justify-between
                                    `}
                                >
                                    <div>
                                        <span>{t(`servicesBilling.servicesNames.${service.type}`)}</span>
                                        <span>&nbsp;({t(`servicesBilling.${service.frequency === 'once' ? 'oneTime' : 'recurrent'}`)})</span>
                                    </div>
                                    <div
                                        className={`
                                            font-bold
                                            text-right
                                        `}
                                    >
                                        {service.price}zł {t(`servicesBilling.${service.frequency === 'once' ? 'afterTheMission' : 'afterEachMission'}`)}
                                    </div>
                                </div>
                            ))}
                    </ServicesBilling>
                    <PrimaryButtonOutlined
                        style={{
                            height: '48px',
                            width: '100%',
                            marginLeft: 0,
                            marginRight: 0,
                            justifySelf: 'end',
                        }}
                        onClick={() => {
                            dispatch(_toggleMenu({ menu: 'bookingMenuOpen', isOpen: false }));
                            dispatch(_removeFromOverlayActionStack('bookingMenuOpen'));
                        }}
                    >
                        {t(`buttons.addNewService`)}
                    </PrimaryButtonOutlined>
                    <PrimaryButtonFull
                        style={{
                            height: '48px',
                            width: '100%',
                            marginLeft: 0,
                            marginRight: 0,
                            marginTop: 0,
                            marginBottom: '16px',
                            justifySelf: 'end',
                        }}
                        disabled={order.confirmOrderLoading}
                        onClick={() => {
                            if (user.isAuthenticated && (bookingAllowed || isAddressOrTimeEdited)) {
                                dispatch(confirmOrderClearOrderState(t(`order_success_toast`), t(`error_occured_toast`), redirectCallback));
                            } else {
                                handleClick();
                            }
                        }}
                    >
                        {t(`buttons.letsBook`)}
                    </PrimaryButtonFull>
                </ControlsDiv>
            </ContentContainer>
        </StyledSidebar>
    );
};

export default BookingMenu;
