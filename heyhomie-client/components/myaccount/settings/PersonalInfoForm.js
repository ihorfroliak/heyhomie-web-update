/* eslint-disable no-use-before-define */
import { useState, useEffect } from 'react';

import { useTranslations } from 'next-intl';

import tw, { css, styled, theme } from 'twin.macro';
import { keyframes } from 'styled-components';

import validator from 'validator';

import PhoneInput from 'react-phone-number-input';
import { EmailInput, TextInput } from '../../citypage/menus/widgets/Inputs';
import { PrimaryButtonFull } from '../../ui/Buttons';

const InfoForm = styled.form`
    position: relative;

    width: 100%;

    padding-left: 24px;
    padding-right: 24px;

    &:disabled {
        opacity: 0.5;
    }

    @media (min-width: 640px) {
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 24px;

        padding-left: 0px;
        padding-right: 0px;
    }
`;

const FormHeading = styled.h2`
    font-weight: bold;
    font-size: 28px;
    color: #14133a;
    margin-top: 40px;
    margin-bottom: 24px;

    @media (min-width: 640px) {
        grid-column: span 2;
    }
`;

const StyledLabelPhoneInput = styled.label`
    position: relative;
    display: block;

    height: 48px;
    width: 100%;

    margin-top: 16px;
    margin-bottom: 16px;

    &::before {
        content: '${props => props.placeholder}';
        position: absolute;
        left: 16px;
        top: -8px;
        z-index: 5;

        min-width: 1.5rem;
        padding-right: 0.5rem;
        font-size: 10px;

        background-color: white;

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
    }

    &::after {
        content: '${props => (props.validationError && props.value ? props.validationError : props.emptyError)}';
        position: absolute;
        right: 16px;
        top: 8px;
        z-index: 6;

        min-width: 1.5rem;
        padding-right: 0.5rem;
        font-size: 10px;

        background-color: white;

        color: red;

        animation-duration: 0.3s;
        animation-fill-mode: forwards;
        ${props =>
            props.isErrorShown
                ? css`
                      animation-name: ${popIn};
                  `
                : css`
                      animation-name: ${popOut};
                  `};
    }

    div.PhoneInput {
        position: relative;
        div.PhoneInputCountry {
            position: absolute;
            top: 16px;
            left: 1.25rem;
            z-index: 15;
            select {
                z-index: 16;
            }
            div.PhoneInputCountryIcon {
            }
            div.PhoneInputCountrySelectArrow {
                z-index: 17;
            }
        }
        input {
            position: relative;
            display: block;

            height: 48px;
            width: 100%;

            padding-left: 4rem;

            font-size: 16px;

            border-style: solid;
            border-radius: 4px;
            border-width: 1px;
            border-color: ${props => (props.error === true ? theme`colors.secondary.pink` : theme`colors.primary.grey`)};

            &:focus {
                outline: none;
                ${tw`border-primary-dark`};
            }
        }
    }
`;

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

export const PhoneNumberInput = props => {
    const [isErrorShown, setIsErrorShown] = useState(false);

    return (
        <StyledLabelPhoneInput
            placeholder={props.placeholder}
            isVisible={props.value}
            value={props.value}
            validationError={props.validationError}
            emptyError={props.emptyError}
            isErrorShown={isErrorShown}
            error={isErrorShown}
            style={props.style}
        >
            <PhoneInput
                placeholder={props.placeholder}
                defaultCountry={props.defaultCountry}
                international={true}
                countryCallingCodeEditable={false}
                value={props.value}
                onChange={v => {
                    setIsErrorShown(false);
                    props.onChange(v);
                }}
                onBlur={() => {
                    if (props.validationError || !props.value) {
                        setIsErrorShown(true);
                    } else {
                        setIsErrorShown(false);
                    }
                }}
                withCountryCallingCode={true}
                style={{
                    height: '48px',
                    fontSize: '16px',
                }}
                disabled={props.disabled}
            />
            {props.locked ? (
                <div
                    style={{
                        position: 'absolute',
                        top: '12px',
                        right: '16px',
                    }}
                >
                    <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path
                            d='M16.6126 10.6852V7.63442C16.6126 6.40529 16.1243 5.22651 15.2552 4.35739C14.3861 3.48827 13.2073 3 11.9782 3C10.7491 3 9.57029 3.48827 8.70117 4.35739C7.83204 5.22651 7.34378 6.40529 7.34378 7.63442V10.6852C6.886 10.691 6.44894 10.8769 6.12724 11.2026C5.80553 11.5283 5.6251 11.9677 5.625 12.4255L5.62502 19.5317C5.62502 21.4894 18.3314 21.4894 18.3314 19.5317L18.3314 12.4255C18.3313 11.9677 18.1508 11.5284 17.8291 11.2026C17.5074 10.8769 17.0704 10.691 16.6126 10.6852ZM9.45766 10.6841V7.63442C9.45766 6.96593 9.72321 6.32482 10.1959 5.85213C10.6686 5.37944 11.3097 5.11388 11.9782 5.11388C12.6467 5.11388 13.2878 5.37944 13.7605 5.85213C14.2332 6.32482 14.4987 6.96593 14.4987 7.63442V10.6841H9.45766Z'
                            fill='#14133A'
                        />
                    </svg>
                </div>
            ) : null}
        </StyledLabelPhoneInput>
    );
};

const PersonalInfoForm = ({ user, isLoading, handleSave }) => {
    // UI translations for the component
    const t = useTranslations('AccountPage.SettingsPage');

    const [firstNameInput, setFirstNameInput] = useState(user.first_name);
    const [lastNameInput, setLastNameInput] = useState(user.last_name);
    const [emailInput, setEmailInput] = useState(user.email);

    const initialSignUpValidationErrors = {
        firstNameInput: '',
        lastNameInput: '',
        emailInput: '',
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
            handleSetSignUpValidationError('firstNameInput', t(`first_name_err`));
        } else {
            handleSetSignUpValidationError('firstNameInput', '');
        }
    };

    const handleLastNameInput = e => {
        setLastNameInput(e.target.value);
        if (!e.target.value) {
            handleSetSignUpValidationError('lastNameInput', t(`last_name_err`));
        } else {
            handleSetSignUpValidationError('lastNameInput', '');
        }
    };

    const handleEmailInput = e => {
        setEmailInput(e.target.value);
        if (!validator.isEmail(e.target.value)) {
            handleSetSignUpValidationError('emailInput', t(`email_err`));
        } else {
            handleSetSignUpValidationError('emailInput', '');
        }
    };

    useEffect(() => {
        if (Object.values(signUpValidationErrors).some(x => x !== null && x !== '')) {
            setIsSignUpAllowed(false);
        } else if (signUpValidationErrors && firstNameInput && lastNameInput && emailInput) {
            setIsSignUpAllowed(true);
        }
    }, [signUpValidationErrors, firstNameInput, lastNameInput, emailInput]);

    return (
        <InfoForm>
            <FormHeading>{t(`personalInfo`)}</FormHeading>
            <TextInput
                value={firstNameInput}
                onChange={e => handleFirstNameInput(e)}
                validationError={signUpValidationErrors.firstNameInput}
                emptyError={t(`first_name_err`)}
                placeholder={t(`first_name`)}
                disabled={user && user.isSignUpLoading}
                style={{
                    marginTop: 0,
                    marginBottom: 16,
                }}
            />
            <TextInput
                value={lastNameInput}
                onChange={e => handleLastNameInput(e)}
                validationError={signUpValidationErrors.lastNameInput}
                emptyError={t(`last_name_err`)}
                placeholder={t(`last_name`)}
                disabled={user && user.isSignUpLoading}
                style={{
                    marginTop: 0,
                    marginBottom: 16,
                }}
            />
            <PhoneNumberInput
                disabled={true}
                value={user.phone_number}
                validationError={signUpValidationErrors.phoneNubmerSignUpInput}
                placeholder={t(`phone_number`)}
                emptyError={t(`phone_number_err`)}
                locked={true}
                style={{
                    marginTop: 0,
                    marginBottom: 16,
                }}
            />
            <EmailInput
                value={emailInput}
                onChange={e => handleEmailInput(e)}
                validationError={signUpValidationErrors.emailInput}
                emptyError={t(`email_err`)}
                placeholder={t(`email`)}
                disabled={user && user.isSignUpLoading}
                style={{
                    marginTop: 0,
                    marginBottom: 16,
                }}
            />
            <PrimaryButtonFull
                style={{
                    height: '48px',
                    width: '100%',
                    marginTop: '0',
                    marginBottom: '0',
                    marginRight: '0',
                    marginLeft: '0',
                }}
                onClick={e => {
                    e.preventDefault();
                    handleSave({
                        first_name: firstNameInput,
                        last_name: lastNameInput,
                        email: emailInput,
                    });
                }}
                disabled={user && user.isSignUpLoading ? true : !isSignUpAllowed}
            >
                {t(`confirmBtn`)}
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
        </InfoForm>
    );
};

export default PersonalInfoForm;
