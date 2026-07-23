import React, { useEffect, useState } from 'react';
import { useStripe, useElements, CardElement, CardNumberElement } from '@stripe/react-stripe-js';

import { useTranslations } from 'next-intl';

import { toast } from 'react-toastify';

import { useDispatch, useSelector } from 'react-redux';
import { theme } from 'twin.macro';
import { SecondaryButtonFull } from '../../../ui/Buttons';
import { TextInput } from '../../../ui/Input';

import CardSection from './CardSection';
import { addNewCard, _setIsLoading } from '../../../../lib/slices/cardsSlice';

import Spinner from '../../../ui/Spinner';
import { _removeFromOverlayActionStack, _toggleMenu } from '../../../../lib/slices/uiSlice';

export default function CardSetupForm() {
    // Redux state
    const dispatch = useDispatch();
    const { ui, user, cards } = useSelector(state => state);

    // UI translations for the component
    const t = useTranslations('CityPage.AddCardSubmenu.CardSection');

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
                    dispatch(_toggleMenu({ menu: `addCardSubmenuOpen`, isOpen: false }));
                    dispatch(_removeFromOverlayActionStack(`addCardSubmenuOpen`));
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
                    placeholderBgColor={theme`colors.surfaceGrey`}
                    value={cardHolderName}
                    onChange={e => setCardHolderName(e.target.value)}
                    disabled={cards.isAddCardLoading}
                    style={{
                        background: 'transparent',
                    }}
                />
                <CardSection onChange={handleValidate} disabled={cards.isAddCardLoading} />
                <SecondaryButtonFull
                    disabled={cards.isAddCardLoading ? true : !stripe || !cardHolderName || !isSubmitAllowed}
                    style={{
                        width: '100%',
                        height: '48px',
                        marginRight: 0,
                        marginLeft: 0,
                        marginTop: '8px',
                    }}
                >
                    {t(`saveCard`)}
                </SecondaryButtonFull>
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
