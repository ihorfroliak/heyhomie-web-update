import tw, { styled, theme } from 'twin.macro';

const CheckboxContainer = styled.div`
    display: inline-block;
    vertical-align: middle;
    cursor: pointer;
`;

const Icon = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;
const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
    border: 0;
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    white-space: nowrap;
    width: 1px;

    -webkit-appearance: none;

    &:focus {
        outline: none;
    }
`;

const StyledCheckbox = styled.div`
    display: inline-block;
    width: 22px;
    height: 22px;
    ${tw`border-2 rounded-sm`}
    ${props => (props.checked ? tw`bg-secondary-salad border-secondary-salad` : tw`bg-white border-primary-grey`)};
    ${props => (props.checked ? tw`` : tw``)};
    border-radius: 3px;
    transition: all 150ms;

    ${HiddenCheckbox}:disabled + & {
        opacity: 0.5;
        cursor: default;
    }

    ${HiddenCheckbox}:checked + & {
        background-color: ${theme`colors.secondary.salad`};
    }

    ${Icon} {
        visibility: ${props => (props.checked ? 'visible' : 'hidden')};
    }
`;

const Checkbox = ({ className, checked, ...props }) => {
    return (
        <CheckboxContainer className={className}>
            <HiddenCheckbox checked={checked} {...props} />
            <StyledCheckbox checked={checked}>
                <Icon>
                    <svg width='18' height='15' viewBox='0 0 18 15' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path
                            d='M15.8802 0.430719C17.7688 0.383505 18.7131 2.64978 17.3675 3.97177L7.73578 13.6034C7.14561 14.1936 6.15411 14.1936 5.56393 13.6034L0.677275 8.69318C-1.35293 6.7574 1.64518 3.75931 3.58095 5.78952L6.29576 8.50432C6.48462 8.69318 6.81511 8.69318 7.02757 8.50432L14.4638 1.06811C14.8415 0.666788 15.3373 0.454326 15.8802 0.430719Z'
                            fill='white'
                        />
                    </svg>
                </Icon>
            </StyledCheckbox>
        </CheckboxContainer>
    );
};

export default Checkbox;
