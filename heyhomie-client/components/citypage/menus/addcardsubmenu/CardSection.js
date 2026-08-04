import React, { useMemo, useState } from 'react';
import { CardCvcElement, CardElement, CardExpiryElement, CardNumberElement } from '@stripe/react-stripe-js';

import tw, { css, styled, theme } from 'twin.macro';
import { keyframes } from 'styled-components';

import { useTranslations } from 'next-intl';

const popIn = keyframes`
from {
  opacity: 0;
  transform: scale(.5) ;
}
to {
  opacity: 1;
  transform:  scale(1) ;
}
`;

const popOut = keyframes`
from {
  opacity: 1;
  transform: scale(1) ;
}
to {
  opacity: 0;
  transform:  scale(.5) ;
}
`;

const PlaceholderPopUp = styled.div`
    position: absolute;
    left: 16px;
    top: -8px;
    z-index: 5;

    min-width: 1.5rem;
    padding-right: 0.5rem;
    font-size: 10px;

    background-color: ${theme`colors.surfaceGrey`};

    animation-duration: 0.3s;
    animation-fill-mode: forwards;
    ${props =>
        props.isVisible
            ? css`
                  animation-name: ${popIn};
              `
            : css`
                  animation-name: ${popOut};
              `};
`;

function CardSection({ onChange, disabled }) {
    // Component state
    const [cardNumberInputPlaceholderVisible, setcardNumberInputPlaceHolderVisible] = useState(false);
    const [cardDateInputPlaceholderVisible, setCardDateInputPlaceHolderVisible] = useState(false);
    const [cardCVCInputPlaceholderVisible, setCardCVCInputPlaceHolderVisible] = useState(false);
    // UI translations for the component
    const t = useTranslations('CityPage.AddCardSubmenu.CardSection');

    const CARD_NUMBER_OPTIONS = {
        style: {
            base: {
                'color': theme`colors.primary.dark`,
                'fontFamily': 'Manrope',
                'fontSmoothing': 'antialiased',
                'fontSize': '16px',
                '::placeholder': {
                    color: theme`colors.primary.grey`,
                    fontFamily: 'Manrope',
                },
                'lineHeight': '48px',
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a',
            },
        },
        placeholder: t(`cardNumberPlaceholder`),
        disabled,
    };

    const CARD_EXPIRY_OPTIONS = {
        style: {
            base: {
                'color': theme`colors.primary.dark`,
                'fontFamily': 'Manrope',
                'fontSmoothing': 'antialiased',
                'fontSize': '16px',
                '::placeholder': {
                    color: theme`colors.primary.grey`,
                    fontFamily: 'Manrope',
                },
                'lineHeight': '48px',
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a',
            },
        },
        placeholder: t(`cardExpiryPlaceholder`),
        disabled,
    };

    const CARD_CVC_OPTIONS = {
        style: {
            base: {
                'color': theme`colors.primary.dark`,
                'fontFamily': 'Manrope',
                'fontSmoothing': 'antialiased',
                'fontSize': '16px',
                '::placeholder': {
                    color: theme`colors.primary.grey`,
                    fontFamily: 'Manrope',
                },
                'lineHeight': '48px',
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a',
            },
        },
        placeholder: t(`cardCVCPlaceholder`),
        disabled,
    };

    return (
        <label
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
            }}
        >
            <div
                style={{
                    position: 'relative',
                    border: '1px solid black',
                    borderColor: theme`colors.primary.grey`,
                    borderRadius: '4px',
                    width: '100%',
                    paddingLeft: '1rem',
                    marginBottom: '16px',
                    fontFamily: 'Manrope',
                }}
            >
                <PlaceholderPopUp isVisible={cardNumberInputPlaceholderVisible}>{t(`cardNumberPlaceholder`)}</PlaceholderPopUp>
                <CardNumberElement
                    options={CARD_NUMBER_OPTIONS}
                    onChange={e => {
                        if (!e.empty) {
                            setcardNumberInputPlaceHolderVisible(true);
                        } else {
                            setcardNumberInputPlaceHolderVisible(false);
                        }
                        onChange(e);
                    }}
                />
            </div>
            <div
                style={{
                    position: 'relative',
                    border: '1px solid black',
                    borderColor: theme`colors.primary.grey`,
                    borderRadius: '4px',
                    width: '45%',
                    paddingLeft: '1rem',
                    marginBottom: '16px',
                    fontFamily: 'Manrope',
                }}
            >
                <PlaceholderPopUp isVisible={cardDateInputPlaceholderVisible}>{t(`cardExpiryPlaceholder`)}</PlaceholderPopUp>
                <CardExpiryElement
                    options={CARD_EXPIRY_OPTIONS}
                    placeholder={`Expiration date`}
                    onChange={e => {
                        if (!e.empty) {
                            setCardDateInputPlaceHolderVisible(true);
                        } else {
                            setCardDateInputPlaceHolderVisible(false);
                        }
                        onChange(e);
                    }}
                />
            </div>

            <div
                style={{
                    position: 'relative',
                    border: '1px solid',
                    borderColor: theme`colors.primary.grey`,
                    borderRadius: '4px',
                    width: '45%',
                    paddingLeft: '1rem',
                    marginBottom: '16px',
                    fontFamily: 'Manrope',
                }}
            >
                <PlaceholderPopUp isVisible={cardCVCInputPlaceholderVisible}>{t(`cardCVCPlaceholder`)}</PlaceholderPopUp>
                <CardCvcElement
                    options={CARD_CVC_OPTIONS}
                    onChange={e => {
                        if (!e.empty) {
                            setCardCVCInputPlaceHolderVisible(true);
                        } else {
                            setCardCVCInputPlaceHolderVisible(false);
                        }
                        onChange(e);
                    }}
                />
            </div>
        </label>
    );
}

export default CardSection;
