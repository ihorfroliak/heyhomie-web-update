import tw, { css, styled, theme } from 'twin.macro';

import { useTranslations } from 'next-intl';

const StyledCardOption = styled.button`
    height: 52px;
    width: 100%;

    background-color: #ffffff;
    font-weight: bold;

    border-radius: 4px;
    ${tw`
            shadow-surface1
        `}

    padding-left: 16px;
    padding-right: 16px;

    display: flex;
    justify-content: space-between;
    align-items: center;

    margin-top: 8px;

    &:focus {
        outline: none;
    }
`;

const AddNewCardOption = ({ handleSetAddNewCard }) => {
    // UI translations for the component
    const t = useTranslations('AccountPage.PaymentPage.CardsComponent');

    return (
        <StyledCardOption onClick={() => handleSetAddNewCard()}>
            <div>{t(`addCard_btn`)}</div>
            <div
                className={`
                    flex justify-end items-center
                `}
            >
                <img
                    src='/american-express-brand.png'
                    style={{
                        height: '32px',
                        width: 'auto',
                        marginLeft: '16px',
                    }}
                />
                <img
                    src='/mastercard-card-brand.png'
                    style={{
                        height: '32px',
                        width: 'auto',
                        marginLeft: '16px',
                    }}
                />
                <img
                    src='/visa-card-brand.png'
                    style={{
                        height: '32px',
                        width: 'auto',
                        marginLeft: '16px',
                    }}
                />
            </div>
        </StyledCardOption>
    );
};

export default AddNewCardOption;
