import { useTranslations } from 'next-intl';
import tw, { css, styled, theme } from 'twin.macro';

const AddressCardStyled = styled.div`
    position: relative;

    width: 296px;
    height: 168px;
    background: #ffffff;
    box-shadow: 0px 0px 14px rgba(0, 0, 0, 0.05);
    border-radius: 8px;

    padding: 24px;

    h2 {
        font-weight: bold;
        font-size: 18px;
        line-height: 22px;
        color: #141338;
        margin-bottom: 4px;
    }
    div {
        font-size: 14px;
        line-height: 17px;
        color: #727189;
        margin-bottom: 4px;
    }

    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
`;
const ButtonsContainer = styled.div`
    position: absolute;
    bottom: 16px;
    right: 16px;

    display: flex;
    justify-content: flex-end;

    button {
        font-weight: bold;
        font-size: 16px;
        line-height: 19px;
    }
    button:focus {
        outline: none;
    }
`;

const AddressCard = ({ address, handleSetAddressForDelete, handleSetAddressForEdit }) => {
    // UI translations for the component
    const t = useTranslations('AccountPage.AddressesPage');

    return (
        <AddressCardStyled>
            <h2>{address.name}</h2>
            <div>
                {address.line1} {address.house_number}
            </div>
            <div>
                {address.zip_code} {t(`AddressEditor.cityNames.${address.city}`)}
            </div>
            {address.additional_information ? <div>{address.additional_information}</div> : null}
            <ButtonsContainer>
                <button
                    onClick={() => handleSetAddressForEdit(address)}
                    style={{
                        color: '#141338',
                        marginRight: '16px',
                    }}
                >
                    {t(`AddressesComponent.editAddress_btn`)}
                </button>
                <button
                    onClick={() => handleSetAddressForDelete(address)}
                    style={{
                        color: '#B31E50',
                    }}
                >
                    {t(`AddressesComponent.deleteAddress_btn`)}
                </button>
            </ButtonsContainer>
        </AddressCardStyled>
    );
};

export default AddressCard;
