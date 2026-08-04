import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';

import tw, { css, styled, theme } from 'twin.macro';

import StyledSidebar from '../Sidebar';

import { GoBack, _pushToOverlayActionStack, _removeFromOverlayActionStack, _toggleMenu } from '../../../../lib/slices/uiSlice';
import CardOption from './CardOption';
import { setCardDefault } from '../../../../lib/slices/cardsSlice';
import AddNewCardOption from './AddNewCardOption';
import Spinner from '../../../ui/Spinner';

const ContentContainer = styled.div`
    position: relative;
    padding-top: 40px;
    padding-bottom: 40px;

    width: 100%;
    height: 100%;

    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
`;

const BackButton = styled.button`
    position: relative;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
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

const CardsContainer = styled.div`
    overflow-y: auto;

    padding-left: 40px;
    padding-right: 40px;

    height: 480px;
`;

const PaymentMethodMenu = () => {
    const t = useTranslations('CityPage.PaymentMethodMenu');

    const dispatch = useDispatch();
    const { ui, user, cards } = useSelector(state => state);

    return (
        <StyledSidebar isOpen={ui.paymentMethodMenuOpen} order={0}>
            {ui.paymentMethodMenuOpen ? (
                <ContentContainer>
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
                                fill='#141338'
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
                    </CardsContainer>
                </ContentContainer>
            ) : null}
        </StyledSidebar>
    );
};

export default PaymentMethodMenu;
