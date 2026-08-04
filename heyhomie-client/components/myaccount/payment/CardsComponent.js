import React, { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/router';

import { useTranslations } from 'next-intl';

import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import tw, { css, styled, theme } from 'twin.macro';

import Spinner from '../../ui/Spinner';

import CardOption from './CardOption';
import AddNewCardOption from './AddNewCardOption';
import { setCardDefault } from '../../../lib/slices/cardsSlice';

const CardsContainer = styled.div`
    width: 100%;

    h2 {
        font-weight: bold;
        font-size: 28px;
        line-height: 34px;
        color: #141338;

        margin-top: 40px;
        margin-bottom: 24px;

        padding-left: 24px;

        @media (min-width: 678px) {
            padding-left: 0px;
        }
    }
`;

const LoadingDiv = styled.div`
    height: 300px;

    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;

    margin-top: 32px;

    background: #ffffff;
    box-shadow: 0px 0px 14px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
`;

const CardsWrapper = styled.div`
    width: 100%;

    @media (max-width: 768px) {
        justify-items: center;
        padding-left: 24px;
        padding-right: 24px;
    }

    ${props =>
        props.isLoading
            ? css`
                  opacity: 0.5;
              `
            : ``}
`;

const CardsComponent = ({ handleSetCardForDelete, handleSetAddNewCard }) => {
    // UI translations for the component
    const t = useTranslations('AccountPage.PaymentPage');

    // Redux state
    const dispatch = useDispatch();
    const { user, ui, order, cards } = useSelector(state => state);

    return (
        <CardsContainer>
            <h2>{t(`CardsComponent.heading`)}</h2>
            {!ui.isCardsLoading ? (
                <CardsWrapper isLoading={ui.isCardsLoading || ui.isEditCardLoading || ui.isDeleteCardLoading}>
                    {cards.cards &&
                        cards.cards.length > 0 &&
                        cards.cards.map(card => (
                            <CardOption
                                key={card.id}
                                card={card}
                                handleSetCardForDelete={handleSetCardForDelete}
                                handleSetCardDefault={cardID => {
                                    dispatch(setCardDefault(cardID));
                                }}
                            />
                        ))}
                    <AddNewCardOption handleSetAddNewCard={handleSetAddNewCard} />
                    <div
                        className={`
                    flex justify-start items-center
                `}
                        style={{
                            marginTop: '16px',
                        }}
                    >
                        <svg
                            style={{
                                marginRight: '8px',
                            }}
                            width='20'
                            height='20'
                            viewBox='0 0 20 20'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                        >
                            <path
                                d='M13.8438 8.90437V6.36201C13.8438 5.33774 13.437 4.35543 12.7127 3.63116C11.9884 2.90689 11.0061 2.5 9.98183 2.5C8.95756 2.5 7.97524 2.90689 7.25097 3.63116C6.5267 4.35543 6.11981 5.33774 6.11981 6.36201V8.90437C5.73834 8.90918 5.37412 9.06409 5.10603 9.33552C4.83794 9.60696 4.68758 9.97308 4.6875 10.3546L4.68752 16.2764C4.68752 17.9079 15.2762 17.9079 15.2762 16.2764L15.2761 10.3546C15.2761 9.97308 15.1257 9.60697 14.8576 9.33553C14.5895 9.0641 14.2253 8.90919 13.8438 8.90437ZM7.88138 8.90341V6.36201C7.88138 5.80494 8.10268 5.27068 8.49659 4.87678C8.8905 4.48287 9.42475 4.26157 9.98183 4.26157C10.5389 4.26157 11.0732 4.48287 11.4671 4.87678C11.861 5.27068 12.0823 5.80494 12.0823 6.36201V8.90341H7.88138Z'
                                fill='#141338'
                            />
                        </svg>
                        <div>
                            <span
                                style={{
                                    marginRight: '8px',
                                    fontWeight: 'bold',
                                    color: '#141338',
                                }}
                            >
                                {t(`AddNewCardModalDialog.securityFirstHeading`)}
                            </span>
                            <span className={`text-14px`}>{t(`AddNewCardModalDialog.securityFirstCaption`)}</span>
                        </div>
                    </div>
                </CardsWrapper>
            ) : (
                <LoadingDiv>
                    <Spinner />
                </LoadingDiv>
            )}
        </CardsContainer>
    );
};

export default CardsComponent;
