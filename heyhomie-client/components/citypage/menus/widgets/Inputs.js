import { useSpring } from 'react-spring';
import { keyframes } from 'styled-components';
import tw, { css, styled, theme } from 'twin.macro';

import { useEffect, useState } from 'react';
import PhoneInput from 'react-phone-number-input';
import { getCountryCallingCode } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

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

const StyledTextInput = styled.input.attrs(props => ({
    type: props.type ? props.type : 'text',
}))`
    position: relative;
    display: block;

    height: 48px;
    width: 100%;

    padding-left: 1rem;

    font-size: 16px;

    border-style: solid;
    border-radius: 4px;
    border-width: 1px;
    border-color: ${props => (props.error === true ? theme`colors.secondary.pink` : theme`colors.primary.grey`)};

    &:focus {
        outline: none;
        ${tw`border-primary-dark`};
    }

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
`;

const StyledEmailInput = styled.input.attrs({ type: 'email' })`
    position: relative;
    display: block;

    height: 48px;
    width: 100%;

    padding-left: 1rem;

    font-size: 16px;

    border-style: solid;
    border-radius: 4px;
    border-width: 1px;
    border-color: ${props => (props.error === true ? theme`colors.secondary.pink` : theme`colors.primary.grey`)};

    &:focus {
        outline: none;
        ${tw`border-primary-dark`};
    }
`;

export const StyledLabel = styled.label`
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

export const TextInput = props => {
    const [isErrorShown, setIsErrorShown] = useState(false);

    return (
        <StyledLabel
            placeholder={props.placeholder}
            isVisible={props.value}
            value={props.value}
            validationError={props.validationError}
            emptyError={props.emptyError}
            isErrorShown={isErrorShown}
            style={props.style}
        >
            <StyledTextInput
                {...props}
                error={isErrorShown}
                onBlur={() => {
                    if (props.validationError || !props.value) {
                        setIsErrorShown(true);
                    } else {
                        setIsErrorShown(false);
                    }
                }}
                onChange={e => {
                    setIsErrorShown(false);
                    props.onChange(e);
                }}
            />
        </StyledLabel>
    );
};

export const EmailInput = props => {
    const [isErrorShown, setIsErrorShown] = useState(false);

    return (
        <StyledLabel
            placeholder={props.placeholder}
            isVisible={props.value}
            value={props.value}
            validationError={props.validationError}
            isErrorShown={isErrorShown}
            emptyError={props.emptyError}
            style={props.style}
        >
            <StyledEmailInput
                {...props}
                error={isErrorShown}
                onBlur={() => {
                    if (props.validationError || !props.value) {
                        setIsErrorShown(true);
                    } else {
                        setIsErrorShown(false);
                    }
                }}
                onChange={e => {
                    setIsErrorShown(false);
                    props.onChange(e);
                }}
            />
        </StyledLabel>
    );
};

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
                onCountryChange={v => {
                    props.onCountryCodeChange(v);
                }}
                withCountryCallingCode={true}
                style={{
                    height: '48px',
                    fontSize: '16px',
                }}
                disabled={props.disabled}
            />
        </StyledLabelPhoneInput>
    );
};
