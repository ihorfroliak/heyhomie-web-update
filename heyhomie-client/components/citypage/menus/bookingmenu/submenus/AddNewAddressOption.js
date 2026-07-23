import { useTranslations } from 'next-intl';
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

const AddNewAddressOption = ({ checked, onSelect }) => {
    // UI translations for the component
    const t = useTranslations('CityPage.BookingMenu.SelectAddressSubmenu');

    return (
        <StyledAddressOption>
            <RadioButton label={<div>{t(`addNewAddressOption`)}</div>} checked={checked} onChange={() => onSelect()} />
        </StyledAddressOption>
    );
};

export default AddNewAddressOption;
