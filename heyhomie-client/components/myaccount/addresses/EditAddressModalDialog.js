import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import tw, { css, styled, theme } from 'twin.macro';
import { _removeFromOverlayActionStack, _toggleMenu } from '../../../lib/slices/uiSlice';
import { PrimaryButtonFull, PrimaryButtonOutlined } from '../../ui/Buttons';
import AddressEditor from './AddressEditor';

const EditAddressModalDialogContainer = styled.div`
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

const EditAddressModalDialogContentContainer = styled.div`
    width: 100%;
    height: 100%;

    h2 {
        font-weight: bold;
        font-size: 28px;
        line-height: 130%;
        /* or 36px */

        text-align: center;

        color: #141338;

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

const EditAddressModalDialog = ({ address, handleValidateAddress, handleCancel }) => {
    // UI translations for the component
    const t = useTranslations('AccountPage.AddressesPage.EditAddressModalDialog');

    // Redux state
    const { ui } = useSelector(state => state);

    // Component state
    const [addressInEdit, setAddressInEdit] = useState(address);
    const [isSubmitAllowed, setIsSubmitAllowed] = useState(false);

    useEffect(() => {
        setAddressInEdit(address);
    }, [address]);

    return (
        <EditAddressModalDialogContainer isOpen={ui.editAddressModalDialog}>
            {ui.editAddressModalDialog && addressInEdit ? (
                <EditAddressModalDialogContentContainer>
                    <h2>{t(`heading`, { address_name: address.name })}</h2>
                    <AddressEditorWrapper>
                        <AddressEditor
                            cityLocked={true}
                            addressInEdit={addressInEdit}
                            setAddressInEdit={setAddressInEdit}
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
                                handleValidateAddress(address.id, addressInEdit);
                            }}
                        >
                            {t(`validate_btn`)}
                        </PrimaryButtonFull>
                    </div>
                </EditAddressModalDialogContentContainer>
            ) : null}
        </EditAddressModalDialogContainer>
    );
};

export default EditAddressModalDialog;
