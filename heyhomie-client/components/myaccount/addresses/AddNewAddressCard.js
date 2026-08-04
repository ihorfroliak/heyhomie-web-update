import { useTranslations } from 'next-intl';
import tw, { css, styled, theme } from 'twin.macro';

const AddressCardStyled = styled.button`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    width: 296px;
    height: 168px;

    background: transparent;
    border-radius: 8px;

    padding-top: 44px;
    padding-bottom: 44px;

    cursor: pointer;
    transition: 0.3s ease-in-out;

    &:hover {
        background: #f5fbff;
        box-shadow: 0px 0px 14px rgba(0, 0, 0, 0.05);
    }
    &:focus {
        outline: none;
    }

    div {
        margin-top: 8px;

        font-weight: bold;
        font-size: 18px;
        line-height: 22px;
        color: #141338;
    }

    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
`;

const AddNewAddressCard = ({ handleSetAddNewAddress }) => {
    // UI translations for the component
    const t = useTranslations('AccountPage.AddressesPage');

    return (
        <AddressCardStyled
            onClick={() => {
                handleSetAddNewAddress();
            }}
        >
            <svg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                    d='M20 0C8.95192 0 0 8.95192 0 20C0 31.0481 8.95192 40 20 40C31.0481 40 40 31.0481 40 20C40 8.95192 31.0481 0 20 0ZM28.7019 21.5385H21.5385V28.7019C21.5385 29.5481 20.8462 30.2404 20 30.2404C19.5769 30.2404 19.1923 30.0673 18.9135 29.7885C18.6346 29.5096 18.4615 29.125 18.4615 28.7019V21.5385H11.2981C10.875 21.5385 10.4904 21.3654 10.2115 21.0865C9.93269 20.8077 9.75962 20.4231 9.75962 20C9.75962 19.1538 10.4519 18.4615 11.2981 18.4615H18.4615V11.2981C18.4615 10.4519 19.1538 9.75962 20 9.75962C20.8462 9.75962 21.5385 10.4519 21.5385 11.2981V18.4615H28.7019C29.5481 18.4615 30.2404 19.1538 30.2404 20C30.2404 20.8462 29.5481 21.5385 28.7019 21.5385Z'
                    fill='#77ECC8'
                />
            </svg>
            <div>{t(`AddressesComponent.addAddress_btn`)}</div>
        </AddressCardStyled>
    );
};

export default AddNewAddressCard;
