import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import tw, { css, styled, theme } from 'twin.macro';
import { useRouter } from 'next/router';

import StyledSidebar from '../Sidebar';

import { GoBack, _pushToOverlayActionStack, _removeFromOverlayActionStack, _toggleMenu } from '../../../../lib/slices/uiSlice';
import CardOption from '../paymentmenu/CardOption';
import AddNewCardOption from '../paymentmenu/AddNewCardOption';
import { setCardDefault } from '../../../../lib/slices/cardsSlice';
import { PrimaryButtonFull } from '../../../ui/Buttons';
import { calculatePriceForOrder } from '../../../../api/endpoints/orders';
import PopupMessage from '../../../ui/PopupMessage';
import Spinner from '../../../ui/Spinner';
import { confirmOrderClearOrderState } from '../../../../lib/slices/orderSlice';
import AddCouponCode from './addCouponCode';

const ContentContainer = styled.div`
    position: relative;

    display: flex;
    flex-wrap: wrap;
    align-items: space-between;

    padding-top: 0px;
    padding-bottom: 0px;

    width: 100%;
    height: 100%;

    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
`;

const StyledHeading = styled.h1`
    padding-left: 40px;
    padding-right: 40px;

    font-size: 40px;
    font-weight: bold;
    ${tw`text-primary-dark`}
    line-height: 48px;

    @media (max-width: 768px) {
        font-size: 36px;
    }
`;

const TopContainer = styled.div`
    padding-top: 40px;

    display: flex;
    flex-direction: column;

    overflow: auto;
`;
const CardsContainer = styled.div`
    padding-left: 40px;
    padding-right: 40px;

    padding-bottom: 40px;
`;

const ServicesBilling = styled.div`
    flex-grow: 1;

    ${tw`
            text-14px
        `}
`;
const ControlsDiv = styled.div`
    display: flex;
    flex-direction: column;

    width: 100%;

    height: 50vh;
    @media (min-height: 680px) {
        height: 35vh;
    }
`;
const Separator = styled.div`
    border-top: 1px solid;

    width: 80%;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 16px;

    ${tw`
            border-secondary-grey
        `}
`;

const ValidatePaymentConfirmOrderMenu = () => {
    // Component state
    const [confirmOrderAllowed, setConfirmOrderAllowed] = useState(false);
    const [servicesBilling, setServicesBilling] = useState([]);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    // Popup
    const [isBillingPopupOpen, setIsBillingPopupOpen] = useState(false);

    // UI translations
    const t = useTranslations('CityPage.ValidatePaymentConfirmOrderMenu');

    // Redux global state
    const dispatch = useDispatch();
    const { ui, user, cards, order } = useSelector(state => state);

    // Topnav & redirect handlers
    const router = useRouter();
    const handlePushRedirect = url => {
        router.push(url);
    };
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

    // Confirm order allowed
    useEffect(() => {
        if (cards.cards.length > 0) {
            setConfirmOrderAllowed(true);
        } else {
            setConfirmOrderAllowed(false);
        }
    }, [cards]);

    return (
        <StyledSidebar isOpen={ui.validatePaymentConfirmOrderMenuOpen} order={0}>
            {ui.validatePaymentConfirmOrderMenuOpen ? (
                <ContentContainer>
                    <TopContainer>
                        <button
                            style={{
                                marginLeft: '40px',
                                marginBottom: '28px',
                                width: 'fit-content',
                            }}
                            onClick={() => {
                                dispatch(GoBack());
                            }}
                        >
                            <svg width='30' height='23' viewBox='0 0 30 23' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                <path
                                    d='M28.7761 9.82594H4.43679L11.7155 2.07504C12.193 1.60066 12.193 0.831427 11.7155 0.355789C11.2364 -0.118596 10.4615 -0.118596 9.98402 0.355789L0 11.0674L9.8308 21.8535C10.0702 22.091 10.3829 22.2101 10.6965 22.2101C11.0092 22.2101 11.3229 22.091 11.5623 21.8535C12.0398 21.3782 12.0398 20.6099 11.5623 20.1346L4.35814 12.2568H28.7761C29.4514 12.2568 30 11.7125 30 11.0414C30 10.3702 29.4514 9.82594 28.7761 9.82594Z'
                                    fill='#14133A'
                                />
                            </svg>
                        </button>
                        <StyledHeading>{t(`heading`)}</StyledHeading>
                        <p style={{ fontSize: '14px', paddingLeft: '40px', marginTop: '16px' }}>{t(`para`)}</p>
                        <CardsContainer>
                            {!cards.isCardsLoading ? (
                                cards.cards && cards.cards.length > 0 ? (
                                    cards.cards.map(card => (
                                        <CardOption
                                            key={card.id}
                                            card={card}
                                            checked={!ui[`addCardSubmenuOpen`] ? card.default : false}
                                            disabled={cards.isSetDeafultCardLoading}
                                            onSelect={cardID => {
                                                dispatch(_toggleMenu({ menu: `addCardSubmenuOpen`, isOpen: false }));
                                                dispatch(_removeFromOverlayActionStack(`addCardSubmenuOpen`));
                                                dispatch(setCardDefault(cardID));
                                            }}
                                        />
                                    ))
                                ) : null
                            ) : (
                                <div className={`flex justify-center items-center w-full h-128px`}>
                                    <Spinner />
                                </div>
                            )}
                            <AddNewCardOption
                                checked={ui[`addCardSubmenuOpen`]}
                                onSelect={() => {
                                    dispatch(_toggleMenu({ menu: `addCardSubmenuOpen`, isOpen: true }));
                                    dispatch(_pushToOverlayActionStack(`addCardSubmenuOpen`));
                                }}
                            />
                            <div className={`flex content-start items-center mt-4`}>
                                <img
                                    src='/lock-icon-hi-res.png'
                                    style={{
                                        width: `24px`,
                                        height: `24px`,
                                        marginRight: `8px`,
                                    }}
                                />
                                <div
                                    className={`
                                    text-14px text-primary-dark
                                `}
                                >
                                    {t(`paymentIsSecure`)}
                                </div>
                            </div>
                        </CardsContainer>
                    </TopContainer>
                </ContentContainer>
            ) : null}
        </StyledSidebar>
    );
};

export default ValidatePaymentConfirmOrderMenu;
