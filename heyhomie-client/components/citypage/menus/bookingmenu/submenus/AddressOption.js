import tw, { css, styled, theme } from 'twin.macro';
import RadioButton from '../../../../ui/Radiobutton';

const StyledAddressOption = styled.div`
    height: 52px;
    background-color: #ffffff;
    font-weight: bold;

    border-radius: 4px;
    ${tw`
            shadow-surface1
        `}

    padding-left: 16px;

    display: flex;
    justify-content: flex-start;
    align-items: center;

    margin-top: 8px;
`;

const AddressOption = ({ address, checked, onSelect }) => {
    return (
        <StyledAddressOption>
            <RadioButton
                label={
                    <div>
                        {address.name}
                        <span
                            className={`text-primary-grey font-normal`}
                            style={{
                                paddingLeft: '8px',
                                opacity: '0.4',
                            }}
                        >
                            {`${address.line1} ${address.line2 ? address.line2 : ''} ${address.street_number}...`}
                        </span>
                    </div>
                }
                checked={checked}
                onChange={() => onSelect(address)}
            />
        </StyledAddressOption>
    );
};

export default AddressOption;
