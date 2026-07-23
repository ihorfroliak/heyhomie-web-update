import React, { useEffect, useState } from 'react';
import { useStripe, useElements, CardElement, CardNumberElement } from '@stripe/react-stripe-js';

import { useTranslations } from 'next-intl';

import { toast } from 'react-toastify';

import { useDispatch, useSelector } from 'react-redux';
import { theme } from 'twin.macro';
import { PrimaryButtonFull, PrimaryButtonOutlined } from '../../ui/Buttons';
import { TextInput } from '../../ui/Input';

import CardSection from './CardSection';
import { _setIsLoading, addNewCard } from '../../../lib/slices/cardsSlice';

import Spinner from '../../ui/Spinner';
import { _removeFromOverlayActionStack, _toggleMenu } from '../../../lib/slices/uiSlice';

export default function CardSetupForm({ handleCancel }) {
    // Redux state
    const dispatch = useDispatch();
    const { ui, user, cards } = useSelector(state => state);

    // UI translations for the component
    const t = useTranslations('AccountPage.PaymentPage.AddNewCardModalDialog');

    // Local state
    const [cardHolderName, setCardHolderName] = useState('');
    const [isSubmitAllowed, setIsSubmitAllowed] = useState(false);

    // Stripe hooks
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async event => {
        // We don't want to let default form submission happen here,
        // which would refresh the page.
        event.preventDefault();

        dispatch(
            _setIsLoading({
                loadingAction: 'isAddCardLoading',
                isLoading: true,
            })
        );

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        const card = elements.getElement(CardNumberElement);

        const result = await stripe.createToken(card, {
            name: cardHolderName,
        });

        if (result.error) {
            toast.error(result.error.message ? result.error.message : 'An error occured');
            dispatch(
                _setIsLoading({
                    loadingAction: 'isAddCardLoading',
                    isLoading: false,
                })
            );
        } else {
            dispatch(
                addNewCard(result.token.id, t(`error_occured_toast`), () => {
                    dispatch(_toggleMenu({ menu: 'addCardModalDialog', isOpen: false }));
                    dispatch(_removeFromOverlayActionStack('addCardModalDialog'));
                })
            );
        }
    };

    const handleValidate = event => {
        if (event.error || event.empty) {
            setIsSubmitAllowed(false);
        } else if (event.complete) {
            setIsSubmitAllowed(true);
        }
    };

    return (
        <>
            <form
                onSubmit={handleSubmit}
                style={{
                    marginTop: '24px',
                    opacity: ui.isAddCardLoading ? '0.5' : '1',
                }}
            >
                <TextInput
                    placeholder={t(`placeHolderName`)}
                    placeholderBgColor={`#FFFFFF`}
                    value={cardHolderName}
                    onChange={e => setCardHolderName(e.target.value)}
                    disabled={cards.isAddCardLoading}
                    style={{
                        background: 'transparent',
                    }}
                />
                <CardSection onChange={handleValidate} disabled={cards.isAddCardLoading} />
                <div
                    className={`
              flex items-start
          `}
                >
                    <svg
                        width='48'
                        height='48'
                        viewBox='0 0 48 48'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                        style={{
                            marginRight: '24px',
                        }}
                    >
                        <path
                            d='M33.2252 21.3705V15.2688C33.2252 12.8106 32.2487 10.453 30.5104 8.71478C28.7722 6.97654 26.4146 6 23.9564 6C21.4981 6 19.1406 6.97654 17.4023 8.71478C15.6641 10.453 14.6876 12.8106 14.6876 15.2688V21.3705C13.772 21.382 12.8979 21.7538 12.2545 22.4053C11.6111 23.0567 11.2502 23.9354 11.25 24.851L11.25 39.0633C11.25 42.9789 36.6628 42.9789 36.6628 39.0633L36.6627 24.851C36.6625 23.9354 36.3017 23.0567 35.6583 22.4053C35.0149 21.7538 34.1408 21.3821 33.2252 21.3705ZM18.9153 21.3682V15.2688C18.9153 13.9319 19.4464 12.6496 20.3918 11.7043C21.3372 10.7589 22.6194 10.2278 23.9564 10.2278C25.2934 10.2278 26.5756 10.7589 27.521 11.7043C28.4663 12.6496 28.9975 13.9319 28.9975 15.2688V21.3682H18.9153Z'
                            fill='#14133A'
                        />
                    </svg>
                    <div>
                        <div
                            style={{
                                fontWeight: 'bold',
                                color: '#14133A',
                            }}
                        >
                            {t(`securityFirstHeading`)}
                        </div>
                        <div className={`text-14px`}>{t(`securityFirstCaption`)}</div>
                    </div>
                </div>
                <div
                    className={`
              flex justify-around flex-wrap
          `}
                >
                    <PrimaryButtonOutlined
                        style={{
                            display: 'block',
                            height: '48px',
                            width: '220px',
                            marginTop: '24px',
                            marginLeft: 0,
                            marginRight: 0,
                            marginBottom: 0,
                        }}
                        onClick={e => {
                            e.preventDefault();
                            handleCancel();
                        }}
                    >
                        {t(`cancel_btn`)}
                    </PrimaryButtonOutlined>
                    <PrimaryButtonFull
                        style={{
                            display: 'block',
                            height: '48px',
                            width: '220px',
                            marginTop: '24px',
                            marginLeft: 0,
                            marginRight: 0,
                            marginBottom: 0,
                        }}
                        disabled={cards.isAddCardLoading ? true : !stripe || !cardHolderName || !isSubmitAllowed}
                    >
                        {t(`validate_btn`)}
                    </PrimaryButtonFull>
                </div>
            </form>
            {cards.isAddCardLoading ? (
                <div
                    style={{
                        position: 'absolute',
                        top: '25%',
                        left: 'calc(50% - 12px)',
                    }}
                >
                    <Spinner />
                </div>
            ) : null}
        </>
    );
}
