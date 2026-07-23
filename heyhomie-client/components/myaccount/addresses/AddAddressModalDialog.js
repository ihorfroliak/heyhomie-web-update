import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import tw, { css, styled, theme } from 'twin.macro';
import { _removeFromOverlayActionStack, _toggleMenu } from '../../../lib/slices/uiSlice';
import { PrimaryButtonFull, PrimaryButtonOutlined } from '../../ui/Buttons';

import AddressEditor from './AddressEditor';

const AddNewAddressModalDialogContainer = styled.div`
    position: 'relative';

    background-color: #ffffff;
    box-shadow: 0px 0px 4px 1px rgba(0, 0, 0, 0.05);
    border-radius: 4px;

    position: fixed;
    transition: 0.2s ease-in-out;

    max-height: 95vh;
    top: 5vh;

    width: 94vw;
    left: calc(50% - 47vw);

    @media (min-width: 440px) {
        width: 400px;
        left: calc(50% - 200px);
    }

    @media (min-width: 640px) {
        top: 10vh;
        max-height: 85vh;

        width: 528px;
        left: calc(50% - 264px);
    }

    @media (min-width: 1110px) {
        top: 15vh;
    }

    opacity: ${props => (props.isOpen ? '1' : '0')};
    z-index: ${props => (props.isOpen ? 50 : -10)};
`;

const AddNewAddressModalDialogContentContainer = styled.div`
    width: 100%;
    height: 100%;

    h2 {
        font-weight: bold;
        font-size: 28px;
        line-height: 130%;
        /* or 36px */

        text-align: center;

        color: #14133a;

        margin-bottom: 16px;
    }

    padding-bottom: 16px;
    padding-top: 24px;
    padding-left: 8px;
    padding-right: 8px;

    @media (min-width: 640px) {
        padding-bottom: 40px;
        padding-top: 48px;
        padding-left: 36px;
        padding-right: 36px;
    }
`;

const AddressEditorWrapper = styled.div`
    overflow-y: auto;

    max-height: 336px;

    padding-top: 16px;

    @media (min-width: 640px) {
        max-height: 40vh;
    }
`;

const defaultNewAddressObject = {
    name: '',
    line1: '',
    line2: '',
    street_number: '',
    house_number: '',
    zip_code: '',
    city: 'krakow',
    state: '',
    country: 'Polska',
    country_code: 'PL',
    additional_information: '',
};

const AddNewAddressModalDialog = ({ cities, handleValidateAddress, handleCancel }) => {
    // UI translations for the component
    const t = useTranslations('AccountPage.AddressesPage.AddNewAddressModalDialog');

    // Redux state
    const { ui } = useSelector(state => state);

    // Component state
    const [addressInEdit, setAddressInEdit] = useState(defaultNewAddressObject);
    const [isSubmitAllowed, setIsSubmitAllowed] = useState(false);

    useEffect(() => {
        if (!ui.addAddressModalDialog) {
            setAddressInEdit('');
        } else {
            setAddressInEdit(defaultNewAddressObject);
        }
    }, [ui.addAddressModalDialog]);

    return (
        <AddNewAddressModalDialogContainer isOpen={ui.addAddressModalDialog}>
            {ui.addAddressModalDialog && addressInEdit ? (
                <AddNewAddressModalDialogContentContainer>
                    <h2>{t(`heading`)}</h2>
                    <AddressEditorWrapper>
                        <AddressEditor
                            addressInEdit={addressInEdit}
                            setAddressInEdit={setAddressInEdit}
                            cityLocked={false}
                            cities={cities}
                            isSubmitAllowed={isSubmitAllowed}
                            setIsSubmitAllowed={setIsSubmitAllowed}
                        />
                    </AddressEditorWrapper>
                    <div
                        className={`
                            flex justify-around flex-wrap
                        `}
                    >
                        <PrimaryButtonOutlined
                            style={{
                                display: 'block',
                                height: '48px',
                                width: '220px',
                                marginTop: '24px',
                                marginLeft: 0,
                                marginRight: 0,
                                marginBottom: 0,
                            }}
                            onClick={() => {
                                handleCancel();
                            }}
                        >
                            {t(`cancel_btn`)}
                        </PrimaryButtonOutlined>
                        <PrimaryButtonFull
                            style={{
                                display: 'block',
                                height: '48px',
                                width: '220px',
                                marginTop: '24px',
                                marginLeft: 0,
                                marginRight: 0,
                                marginBottom: 0,
                            }}
                            disabled={ui.isAddAddressLoading || !isSubmitAllowed}
                            onClick={() => {
                                handleValidateAddress(addressInEdit);
                            }}
                        >
                            {t(`validate_btn`)}
                        </PrimaryButtonFull>
                    </div>
                </AddNewAddressModalDialogContentContainer>
            ) : null}
        </AddNewAddressModalDialogContainer>
    );
};

export default AddNewAddressModalDialog;
