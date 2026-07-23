import tw, { css, styled, theme } from 'twin.macro';

import { useTranslations } from 'next-intl';

import RadioButton from '../../../ui/Radiobutton';

const StyledCardOption = styled.div`
    height: 52px;
    min-width: 300px;

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

    @media (min-width: 640px) {
        min-width: 400px;
    }
`;

const AddNewCardOption = ({ checked, onSelect }) => {
    // UI translations for the component
    const t = useTranslations('CityPage.AddCardSubmenu');

    return (
        <StyledCardOption>
            <RadioButton label={<div>{t(`addNewCard`)}</div>} checked={checked} onChange={() => onSelect()} />
        </StyledCardOption>
    );
};

export default AddNewCardOption;
