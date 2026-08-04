import { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';

import tw, { css, styled, theme } from 'twin.macro';

import { useDispatch, useSelector } from 'react-redux';
import { _removeFromOverlayActionStack, _toggleMenu } from '../../../../lib/slices/uiSlice';
import { signInUser, verifyPhoneNumber, _setIsLoading, _setPhoneNumberForConfirmation } from '../../../../lib/slices/userSlice';

import { TextInput, EmailInput, PhoneNumberInput } from '../widgets/Inputs';
import { PrimaryButtonFull, SecondaryButtonFull } from '../../../ui/Buttons';
import Spinner from '../../../ui/Spinner';

const StyledSidebar = styled.div`
    ${tw`bg-whiteStandard`};
    z-index: ${props => props.order + 30};

    position: fixed;
    transition: 0.3s ease-in-out;

    top: 0;

    height: 100%;
    width: 100vw;

    overflow-y: auto;

    right: ${props => (props.isOpen ? css`0` : '-100vw')};

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    @media (min-width: 1024px) {
        width: ${props => (props.customWidth ? `${props.customWidth}px` : '480px')};

        right: ${props => (props.isOpen ? (props.order === 0 ? css`0` : '480px') : '-480px')};
        box-shadow: 0px 0px 4px 2px rgba(0, 0, 0, 0.05);

        z-index: ${props => (props.order === 1 ? 28 : props.order + 30)};
    }
`;

const ContentContainer = styled.div`
    position: relative;
    padding: 40px;

    width: 100%;
    height: 100%;
`;

const BackButton = styled.button`
    position: relative;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

const StyledHeading = styled.h1`
    font-size: 40px;
    font-weight: bold;
    ${tw`text-primary-dark`}
    line-height: 48px;

    @media (max-width: 768px) {
        font-size: 36px;
    }
`;

const ConfirmationCodeForm = styled.form`
    position: relative;

    &:disabled {
        opacity: 0.5;
    }
`;

const VerifyPhoneForm = styled.form`
    position: relative;
`;

const ConfirmationCodeMenu = () => {
    const t = useTranslations('CityPage.SignInMenu');

    const dispatch = useDispatch();
    const { ui, user } = useSelector(state => state);

    const [isPhoneNumberEdited, setIsPhoneNumberEdited] = useState(false);

    const [confimationCodeInput, setConfimationCodeInput] = useState('');

    const handleConfimationCodeInput = e => {
        setConfimationCodeInput(e.target.value);
    };

    const handleSubmitPhoneVerification = async e => {
        e.preventDefault();
        await dispatch(verifyPhoneNumber(t(`phone_not_exist_toast`)));
    };

    const handleSubmitSignIn = async e => {
        e.preventDefault();
        await dispatch(
            signInUser(
                {
                    phone_number: user.phone_number_for_confirmation,
                    phone_number_verification_code: confimationCodeInput,
                },
                t(`signInSuccess_toast`),
                t(`incorrect_confirmation_code_toast`),
                t(`coupon_added_toast`),
                t(`coupon_not_valid_toast`),
                t(`coupon_duplicate_toast`),
                t(`coupon_error_generic_toast`),
                t(`coupon_has_expired`),
                t(`coupon_is_not_active_yet`),
                t(`user_already_ordered`),
                t(`user_has_referral_coupon`),
                t(`user_identical_to_sponsor`)
            )
        );
        setConfimationCodeInput('');
    };

    const isValidPhoneNumber = phoneNumber => {
        const regex = /^\+\d{6,15}$/;
        return regex.test(phoneNumber);
    };

    useEffect(() => {
        if (!ui.confirmationCodeMenuOpen) {
            setIsPhoneNumberEdited(false);
            setConfimationCodeInput('');
        }
    }, [ui.confirmationCodeMenuOpen]);

    return (
        <StyledSidebar isOpen={ui.confirmationCodeMenuOpen} order={0}>
            <ContentContainer>
                <button
                    onClick={() => {
                        dispatch(_toggleMenu({ menu: 'confirmationCodeMenuOpen', isOpen: false }));
                        dispatch(_removeFromOverlayActionStack('confirmationCodeMenuOpen'));
                    }}
                >
                    <svg width='30' height='23' viewBox='0 0 30 23' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path
                            d='M28.7761 9.82594H4.43679L11.7155 2.07504C12.193 1.60066 12.193 0.831427 11.7155 0.355789C11.2364 -0.118596 10.4615 -0.118596 9.98402 0.355789L0 11.0674L9.8308 21.8535C10.0702 22.091 10.3829 22.2101 10.6965 22.2101C11.0092 22.2101 11.3229 22.091 11.5623 21.8535C12.0398 21.3782 12.0398 20.6099 11.5623 20.1346L4.35814 12.2568H28.7761C29.4514 12.2568 30 11.7125 30 11.0414C30 10.3702 29.4514 9.82594 28.7761 9.82594Z'
                            fill='#141338'
                        />
                    </svg>
                </button>
                {!isPhoneNumberEdited ? (
                    <StyledHeading>{t(`confirm_code_menu.confirmationCode`)}</StyledHeading>
                ) : (
                    <StyledHeading>{t(`confirm_code_menu.editPhoneNumber`)}</StyledHeading>
                )}
                <ConfirmationCodeForm>
                    <p style={{ fontSize: '14px' }}>{t(`confirm_code_menu.para`)}</p>
                    {!isPhoneNumberEdited ? (
                        <TextInput
                            value={confimationCodeInput}
                            onChange={e => handleConfimationCodeInput(e)}
                            placeholder={t(`confirm_code_menu.code_placeholder`)}
                            emptyError={t(`confirm_code_menu.code_err`)}
                            type='number'
                            disabled={user && user.isSignInLoading}
                        />
                    ) : (
                        <PhoneNumberInput
                            value={user.phone_number_for_confirmation}
                            onChange={v => dispatch(_setPhoneNumberForConfirmation(v))}
                            validationError={!isValidPhoneNumber(user.phone_number_for_confirmation) ? t('confirm_code_menu.enter_valid_phone_number_err') : ''}
                            onCountryCodeChange={() => {}}
                            emptyError={t('confirm_code_menu.enter_valid_phone_number_err')}
                            placeholder={''}
                            disabled={false}
                            defaultCountry={'PL'}
                        />
                    )}
                    <PrimaryButtonFull
                        style={{
                            height: '48px',
                            width: '100%',
                            marginLeft: '0',
                            marginRight: '0',
                        }}
                        onClick={e => {
                            if (!isPhoneNumberEdited) {
                                handleSubmitSignIn(e);
                            } else {
                                setIsPhoneNumberEdited(false);
                                handleSubmitPhoneVerification(e);
                            }
                        }}
                        disabled={
                            (user && user.isSignInLoading) || isPhoneNumberEdited
                                ? !isValidPhoneNumber(user.phone_number_for_confirmation)
                                : !confimationCodeInput
                        }
                    >
                        {t(`confirm_code_menu.confirmBtn`)}
                    </PrimaryButtonFull>
                    {user && user.isSignInLoading ? (
                        <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Spinner />
                        </div>
                    ) : null}
                </ConfirmationCodeForm>
                {!isPhoneNumberEdited ? (
                    <button
                        style={{
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            display: 'block',
                        }}
                        onClick={() => setIsPhoneNumberEdited(true)}
                    >
                        {t(`confirm_code_menu.changePhoneNumberBtn`)}
                    </button>
                ) : null}
            </ContentContainer>
        </StyledSidebar>
    );
};

export default ConfirmationCodeMenu;
