import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import tw, { css, styled, theme } from 'twin.macro';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { _removeFromOverlayActionStack, _toggleMenu } from '../../../lib/slices/uiSlice';
import { PrimaryButtonFull, PrimaryButtonOutlined } from '../../ui/Buttons';

import CardSetupForm from './CardSetupForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const AddNewCardModalDialogContainer = styled.div`
    position: 'relative';

    background-color: #ffffff;
    box-shadow: 0px 0px 4px 1px rgba(0, 0, 0, 0.05);
    border-radius: 4px;

    position: fixed;
    transition: 0.2s ease-in-out;

    max-height: 95vh;
    top: 10vh;

    width: 94vw;
    left: calc(50% - 47vw);

    overflow-y: auto;

    @media (min-width: 440px) {
        width: 400px;
        left: calc(50% - 200px);
    }

    @media (min-width: 640px) {
        max-height: 85vh;

        width: 528px;
        left: calc(50% - 264px);
    }

    @media (min-width: 1110px) {
        top: 15vh;
    }

    opacity: ${props => (props.isOpen ? '1' : '0')};
    z-index: ${props => (props.isOpen ? 50 : -10)};
`;

const AddNewCardModalDialogContentContainer = styled.div`
    width: 100%;
    height: 100%;

    h2 {
        font-weight: bold;
        font-size: 28px;
        line-height: 130%;
        /* or 36px */

        text-align: center;

        color: #141338;

        margin-bottom: 16px;
    }

    padding-bottom: 16px;
    padding-top: 24px;
    padding-left: 8px;
    padding-right: 8px;

    @media (min-width: 640px) {
        padding-bottom: 40px;
        padding-top: 48px;
        padding-left: 36px;
        padding-right: 36px;
    }
`;

const CardEditorWrapper = styled.div`
    @media (min-width: 640px) {
        max-height: 40vh;
    }
`;

const AddNewCardModalDialog = ({ handleCancel }) => {
    // UI translations for the component
    const t = useTranslations('AccountPage.PaymentPage.AddNewCardModalDialog');

    // Redux state
    const { ui } = useSelector(state => state);

    return (
        <AddNewCardModalDialogContainer isOpen={ui.addCardModalDialog}>
            {ui.addCardModalDialog ? (
                <AddNewCardModalDialogContentContainer>
                    <h2>{t(`heading`)}</h2>
                    <div>{t(`para`)}</div>
                    <CardEditorWrapper>
                        <Elements
                            options={{
                                fonts: [
                                    {
                                        cssSrc: 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap',
                                    },
                                ],
                            }}
                            stripe={stripePromise}
                        >
                            <CardSetupForm handleCancel={handleCancel} />
                        </Elements>
                    </CardEditorWrapper>
                </AddNewCardModalDialogContentContainer>
            ) : null}
        </AddNewCardModalDialogContainer>
    );
};

export default AddNewCardModalDialog;
