import { keyframes } from 'styled-components';
import tw, { css, styled, theme } from 'twin.macro';

import { useState } from 'react';

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

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    -moz-appearance: textfield;

    &:focus {
        outline: none;
        border-color: ${theme`colors.primary.dark`};
    }

    &::placeholder {
        color: ${theme`colors.primary.grey`};
    }
`;

export const StyledLabel = styled.label`
    position: relative;
    display: block;

    height: 48px;
    width: 100%;

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

        background-color: ${props => (props.placeholderBgColor ? props.placeholderBgColor : 'white')};

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

export const TextInput = props => {
    const [isErrorShown, setIsErrorShown] = useState(false);

    return (
        <StyledLabel
            placeholder={props.placeholder}
            placeholderBgColor={props.placeholderBgColor}
            isVisible={props.value}
            value={props.value}
            validationError={props.validationError}
            isErrorShown={isErrorShown}
            emptyError={props.emptyError}
            style={{ ...props.styleLabel }}
        >
            <StyledTextInput
                type={props.type}
                {...props}
                error={isErrorShown}
                onBlur={() => {
                    if (props.validationError) {
                        setIsErrorShown(true);
                    } else if (props.required && !props.value) {
                        setIsErrorShown(true);
                    } else {
                        setIsErrorShown(false);
                    }
                }}
                onChange={e => {
                    setIsErrorShown(false);
                    props.onChange(e);
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
        </StyledLabel>
    );
};
