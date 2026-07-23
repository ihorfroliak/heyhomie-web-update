import { keyframes } from 'styled-components';
import tw, { css, styled, theme } from 'twin.macro';

const Input = styled.input`
    height: 0;
    width: 0;
    opacity: 0;
    z-index: -1;
`;

const popIn = keyframes`
from {
  opacity: 0;
  transform: translate(-50%, -50%) scale(1.5) ;
}
to {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1) ;
}
`;

const Label = styled.label`
    position: relative;
    display: flex;
    width: 100%;

    justify-content: flex-start;
    align-items: flex-start;
    cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
    padding-left: calc(22px + 1rem);
`;

const Indicator = styled.div`
    width: 22px;
    height: 22px;

    position: absolute;
    top: calc(50% - 11px);
    left: 0;

    border: 1px solid;
    border-radius: 1em;
    ${tw`border-2`}
    ${props => (props.checked ? tw`border-secondary-salad` : tw`border-primary-grey`)};

    &::after {
        content: '';
        position: absolute;
        display: none;
    }

    ${Input}:checked {
        ${tw`border-secondary-salad`}
    }

    ${Input}:checked + &::after {
        display: block;
        border-style: solid;
        border-radius: 50%;
        ${tw`bg-secondary-salad border-secondary-salad`}
        width: 0.7em;
        height: 0.7em;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        animation-name: ${popIn};
        animation-duration: 0.3s;
        animation-fill-mode: forwards;
    }

    ${Input}:disabled + & {
        pointer-events: none;
        opacity: 0.6;
        background: #e6e6e6;
    }
`;

export default function RadioButton({ value, onChange, name, id, label, disabled, checked }) {
    return (
        <Label htmlFor={id} disabled={disabled}>
            {label}
            <Input id={id} type='radio' role='radio' name={name} value={value} disabled={disabled} onChange={onChange} checked={checked} />
            <Indicator checked={checked} />
        </Label>
    );
}
