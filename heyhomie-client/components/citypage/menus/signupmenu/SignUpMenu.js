import { useEffect, useState } from 'react';
import Link from 'next/link';

import { useTranslations } from 'next-intl';

import { useDispatch, useSelector } from 'react-redux';
import tw, { css, styled, theme } from 'twin.macro';
import validator from 'validator';
import { _pushToOverlayActionStack, _removeFromOverlayActionStack, _toggleMenu } from '../../../../lib/slices/uiSlice';
import { signUpUser, verifyPhoneNumber, _setIsLoading, _setPhoneNumberForConfirmation } from '../../../../lib/slices/userSlice';

import { TextInput, EmailInput, PhoneNumberInput } from '../widgets/Inputs';
import { PrimaryButtonFull, SecondaryButtonFull } from '../../../ui/Buttons';
import Checkbox from '../../../ui/Checkbox';
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

const SignUpForm = styled.form`
    position: relative;

    &:disabled {
        opacity: 0.5;
    }
`;

const VerifyPhoneForm = styled.form`
    position: relative;
`;

const SignUpMenu = () => {
    const t = useTranslations('CityPage.SignInMenu');

    const dispatch = useDispatch();
    const { ui, user } = useSelector(state => state);

    // Sign in existing user
    const handleSubmitPhoneVerification = async e => {
        e.preventDefault();
        try {
            await dispatch(verifyPhoneNumber(t(`phone_not_exist_toast`)));
        } catch (err) {
            console.error(err);
        }
    };

    // Sign up a new user
    const [firstNameInput, setFirstNameInput] = useState('');
    const [lastNameInput, setLastNameInput] = useState('');
    const [phoneNubmerSignUpInput, setPhoneNubmerSignUpInput] = useState();
    const [phoneNubmerCountryCodeSignUpInput, setPhoneNubmerCountryCodeSignUpInput] = useState('PL');
    const [emailInput, setEmailInput] = useState('');

    const [agreedToTerms_1, setAgreedToTerms_1] = useState(true);
    const [agreedToTerms_2, setAgreedToTerms_2] = useState(true);

    const initialSignUpValidationErrors = {
        firstNameInput: '',
        lastNameInput: '',
        phoneNubmerSignUpInput: '',
        phoneNubmerCountryCodeSignUpInput: '',
        emailInput: '',
        agreedToTerms_1: '',
        agreedToTerms_2: '',
    };
    const [signUpValidationErrors, setSignUpValidationErrors] = useState(initialSignUpValidationErrors);
    const [isSignUpAllowed, setIsSignUpAllowed] = useState(false);

    const handleSetSignUpValidationError = (type, error) => {
        const workingObject = { ...signUpValidationErrors };
        workingObject[type] = error;
        setSignUpValidationErrors(workingObject);
    };

    const handleFirstNameInput = e => {
        setFirstNameInput(e.target.value);
        if (!e.target.value) {
            handleSetSignUpValidationError('firstNameInput', t(`sign_up_form.first_name_err`));
        } else {
            handleSetSignUpValidationError('firstNameInput', '');
        }
    };

    const handleLastNameInput = e => {
        setLastNameInput(e.target.value);
        if (!e.target.value) {
            handleSetSignUpValidationError('lastNameInput', t(`sign_up_form.last_name_err`));
        } else {
            handleSetSignUpValidationError('lastNameInput', '');
        }
    };

    const isValidPhoneNumber = phoneNumber => {
        const regex = /^\+\d{6,15}$/;
        return regex.test(phoneNumber);
    };

    const handlePhoneNubmerSignUpInput = value => {
        setPhoneNubmerSignUpInput(value);
        if (!isValidPhoneNumber(value)) {
            handleSetSignUpValidationError('phoneNubmerSignUpInput', t(`sign_up_form.phone_number_err`));
        } else {
            handleSetSignUpValidationError('phoneNubmerSignUpInput', '');
        }
    };

    const handlePhoneNubmerCountryCodeSignUpInput = value => {
        setPhoneNubmerCountryCodeSignUpInput(value);
        if (!value) {
            handleSetSignUpValidationError('phoneNubmerCountryCodeSignUpInput', 'Select country code');
        } else {
            handleSetSignUpValidationError('phoneNubmerCountryCodeSignUpInput', '');
        }
    };

    const handleEmailInput = e => {
        setEmailInput(e.target.value);
        if (!validator.isEmail(e.target.value)) {
            handleSetSignUpValidationError('emailInput', t(`sign_up_form.email_err`));
        } else {
            handleSetSignUpValidationError('emailInput', '');
        }
    };

    const handleResetForm = () => {
        setFirstNameInput('');
        setLastNameInput('');
        setPhoneNubmerSignUpInput('');
        setPhoneNubmerCountryCodeSignUpInput('PL');
        setEmailInput('');
        setSignUpValidationErrors(initialSignUpValidationErrors);
        setIsSignUpAllowed(false);
    };

    const handleSubmitSignUp = async e => {
        e.preventDefault();
        try {
            const user = {
                first_name: firstNameInput,
                last_name: lastNameInput,
                email: emailInput,
                phone_number: phoneNubmerSignUpInput,
                phone_number_country_code: phoneNubmerCountryCodeSignUpInput,
            };

            await dispatch(signUpUser(user, handleResetForm, t(`error_occured_toast`), t(`already_exists_toast`)));
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (Object.values(signUpValidationErrors).some(x => x !== null && x !== '')) {
            setIsSignUpAllowed(false);
        } else if (
            signUpValidationErrors &&
            firstNameInput &&
            lastNameInput &&
            phoneNubmerSignUpInput &&
            phoneNubmerCountryCodeSignUpInput &&
            emailInput &&
            agreedToTerms_1 &&
            agreedToTerms_2
        ) {
            setIsSignUpAllowed(true);
        }
    }, [
        signUpValidationErrors,
        firstNameInput,
        lastNameInput,
        phoneNubmerSignUpInput,
        phoneNubmerCountryCodeSignUpInput,
        emailInput,
        agreedToTerms_1,
        agreedToTerms_2,
    ]);

    return (
        <StyledSidebar isOpen={ui.signUpMenuOpen} order={0}>
            {ui.signUpMenuOpen ? (
                <ContentContainer>
                    <button
                        onClick={() => {
                            dispatch(_toggleMenu({ menu: 'signUpMenuOpen', isOpen: false }));
                            dispatch(_removeFromOverlayActionStack('signUpMenuOpen'));
                        }}
                    >
                        <svg width='30' height='23' viewBox='0 0 30 23' fill='none' xmlns='http://www.w3.org/2000/svg'>
                            <path
                                d='M28.7761 9.82594H4.43679L11.7155 2.07504C12.193 1.60066 12.193 0.831427 11.7155 0.355789C11.2364 -0.118596 10.4615 -0.118596 9.98402 0.355789L0 11.0674L9.8308 21.8535C10.0702 22.091 10.3829 22.2101 10.6965 22.2101C11.0092 22.2101 11.3229 22.091 11.5623 21.8535C12.0398 21.3782 12.0398 20.6099 11.5623 20.1346L4.35814 12.2568H28.7761C29.4514 12.2568 30 11.7125 30 11.0414C30 10.3702 29.4514 9.82594 28.7761 9.82594Z'
                                fill='#141338'
                            />
                        </svg>
                    </button>
                    <StyledHeading>{t(`sign_up`)}</StyledHeading>
                    <SignUpForm>
                        <p style={{ fontSize: '14px' }}>{t(`sign_up_form.para1`)}</p>
                        <TextInput
                            value={firstNameInput}
                            onChange={e => handleFirstNameInput(e)}
                            validationError={signUpValidationErrors.firstNameInput}
                            emptyError={t(`sign_up_form.first_name_err`)}
                            placeholder={t(`sign_up_form.first_name`)}
                            disabled={user && user.isSignUpLoading}
                        />
                        <TextInput
                            value={lastNameInput}
                            onChange={e => handleLastNameInput(e)}
                            validationError={signUpValidationErrors.lastNameInput}
                            emptyError={t(`sign_up_form.last_name_err`)}
                            placeholder={t(`sign_up_form.last_name`)}
                            disabled={user && user.isSignUpLoading}
                        />
                        <PhoneNumberInput
                            value={phoneNubmerSignUpInput}
                            onChange={handlePhoneNubmerSignUpInput}
                            validationError={signUpValidationErrors.phoneNubmerSignUpInput}
                            onCountryCodeChange={handlePhoneNubmerCountryCodeSignUpInput}
                            placeholder={t(`sign_up_form.phone_number`)}
                            emptyError={t(`sign_up_form.phone_number_err`)}
                            disabled={user && user.isSignUpLoading}
                            defaultCountry={'PL'}
                        />
                        <EmailInput
                            value={emailInput}
                            onChange={e => handleEmailInput(e)}
                            validationError={signUpValidationErrors.emailInput}
                            emptyError={t(`sign_up_form.email_err`)}
                            placeholder={t(`sign_up_form.email`)}
                            disabled={user && user.isSignUpLoading}
                        />
                        <label
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                marginBottom: '10px',
                                marginTop: '10px',
                                fontSize: '14px',
                            }}
                            className={`${agreedToTerms_1 ? `text-primary-dark` : `text-primary-grey`}`}
                        >
                            <Checkbox
                                checked={agreedToTerms_1}
                                onChange={e => {
                                    setAgreedToTerms_1(e.target.checked);
                                    if (!e.target.checked) {
                                        handleSetSignUpValidationError('agreedToTerms_1', 'You need to agree to terms');
                                    } else {
                                        handleSetSignUpValidationError('agreedToTerms_1', '');
                                    }
                                }}
                                disabled={user && user.isSignUpLoading}
                            />
                            <div style={{ marginLeft: '1rem', userSelect: 'none' }}>
                                {t(`sign_up_form.terms_checkbox_1`)}
                                <Link href='/terms_conditions'>
                                    <a style={{ color: theme`colors.secondary.blue` }}>{t(`sign_up_form.terms_checkbox_1_Link`)}</a>
                                </Link>
                            </div>
                        </label>
                        <label
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                marginBottom: '10px',
                                marginTop: '10px',
                                fontSize: '14px',
                            }}
                            className={`${agreedToTerms_2 ? `text-primary-dark` : `text-primary-grey`}`}
                        >
                            <Checkbox
                                checked={agreedToTerms_2}
                                onChange={e => {
                                    setAgreedToTerms_2(e.target.checked);
                                    if (!e.target.checked) {
                                        handleSetSignUpValidationError('agreedToTerms_1', 'You need to agree to terms');
                                    } else {
                                        handleSetSignUpValidationError('agreedToTerms_1', '');
                                    }
                                }}
                                disabled={user && user.isSignUpLoading}
                            />
                            <span style={{ marginLeft: '1rem', userSelect: 'none' }}>
                                {t(`sign_up_form.terms_checkbox_2`)}
                                <Link href='/privacy'>
                                    <a style={{ color: theme`colors.secondary.blue` }}>{t(`sign_up_form.terms_checkbox_2_Link`)}</a>
                                </Link>
                            </span>
                        </label>
                        <PrimaryButtonFull
                            style={{
                                height: '48px',
                                width: '100%',
                                marginLeft: '0',
                                marginRight: '0',
                            }}
                            onClick={e => handleSubmitSignUp(e)}
                            disabled={user && user.isSignUpLoading ? true : !isSignUpAllowed}
                        >
                            {t(`sign_up_form.confirmBtn`)}
                        </PrimaryButtonFull>
                        {user && user.isSignUpLoading ? (
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
                    </SignUpForm>
                    <div style={{ width: '100%', borderBottom: '1px solid #E2E2EB', height: '26px', marginBottom: '24px' }} />
                    <VerifyPhoneForm>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>{t(`sign_in_form.h3`)}</h3>
                        <p style={{ fontSize: '14px' }}>{t(`sign_in_form.para`)}</p>
                        <PhoneNumberInput
                            value={user && user.phone_number_for_confirmation}
                            onChange={v => dispatch(_setPhoneNumberForConfirmation(v))}
                            validationError={!isValidPhoneNumber(user.phone_number_for_confirmation) ? t(`sign_in_form.phone_number_err`) : ''}
                            onCountryCodeChange={() => {}}
                            placeholder={t(`sign_in_form.phone_number`)}
                            emptyError={t(`sign_in_form.phone_number_err`)}
                            disabled={user && user.isPhoneVerificationLoading}
                            defaultCountry={'PL'}
                        />
                        <SecondaryButtonFull
                            style={{
                                height: '48px',
                                width: '100%',
                                marginLeft: '0',
                                marginRight: '0',
                            }}
                            onClick={e => handleSubmitPhoneVerification(e)}
                            disabled={(user && user.isPhoneVerificationLoading) || !isValidPhoneNumber(user.phone_number_for_confirmation)}
                        >
                            {t(`sign_in_form.confirmBtn`)}
                        </SecondaryButtonFull>
                        {user && user.isPhoneVerificationLoading ? (
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
                    </VerifyPhoneForm>
                </ContentContainer>
            ) : (
                <ContentContainer></ContentContainer>
            )}
        </StyledSidebar>
    );
};

export default SignUpMenu;
