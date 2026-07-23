/* eslint-disable default-case */
/* eslint-disable consistent-return */
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import tw, { css, styled, theme } from 'twin.macro';
import { PrimaryButtonFull, SecondaryButtonFull } from '../../../../ui/Buttons';
import { TextInput } from '../../../../ui/Input';

const AddressEditorContainer = styled.form`
    width: 100%;

    display: flex;
    flex-wrap: wrap;

    justify-content: space-between;
`;

const defaultNewAddressObject = {
    name: '',
    line1: '',
    line2: '',
    street_number: '',
    house_number: '',
    zip_code: '',
    city: '',
    state: '',
    country: 'Polska',
    country_code: 'PL',
    additional_information: '',
};

const AddressEditor = ({ address, handleSubmit }) => {
    // Redux state
    const dispatch = useDispatch();
    const { ui, order, user, addresses } = useSelector(state => state);

    // UI translations for the component
    const t = useTranslations('CityPage.BookingMenu.SelectAddressSubmenu.AddressEditor');

    // Component's state
    const [isSubmitAllowed, setIsSubmitAllowed] = useState(false);
    const [addressInEdit, setAddressInEdit] = useState(
        address
            ? { ...address }
            : {
                  ...defaultNewAddressObject,
                  city: user.selectedCity,
              }
    );

    const connector = targetName => {
        switch (targetName) {
            case 'address-name': {
                return 'name';
            }
            case 'address-line1': {
                return 'line1';
            }
            case 'address-street_number': {
                return 'street_number';
            }
            case 'address-house_number': {
                return 'house_number';
            }
            case 'address-zip': {
                return 'zip_code';
            }
            case 'address-additional_information': {
                return 'additional_information';
            }
        }
    };

    const handleChange = e => {
        const workingObject = { ...addressInEdit };

        workingObject[connector(e.target.name)] = e.target.value;

        setAddressInEdit({ ...workingObject });
    };

    const submitForm = async e => {
        e.preventDefault();
        handleSubmit(addressInEdit);
        setAddressInEdit({ ...defaultNewAddressObject });
    };

    useEffect(() => {
        if (!addressInEdit.name || !addressInEdit.line1 || !addressInEdit.street_number || !addressInEdit.zip_code || !addressInEdit.city) {
            setIsSubmitAllowed(false);
        } else {
            setIsSubmitAllowed(true);
        }
    }, [addressInEdit]);

    return (
        <AddressEditorContainer autoComplete='on'>
            <TextInput
                value={addressInEdit && addressInEdit.name}
                name='address-name'
                autoComplete='address name'
                placeholder={t(`addressName`)}
                styleLabel={{
                    width: '100%',
                }}
                onChange={e => handleChange(e)}
                disabled={ui.isAddAddressLoading}
                style={{
                    background: 'transparent',
                }}
                placeholderBgColor={theme`colors.surfaceGrey`}
                required={true}
            />
            <TextInput
                value={addressInEdit && addressInEdit.line1}
                name='address-line1'
                autoComplete='address address-line1'
                placeholder={t(`addressLine1`)}
                styleLabel={{
                    width: '100%',
                }}
                onChange={e => handleChange(e)}
                disabled={ui.isAddAddressLoading}
                style={{
                    background: 'transparent',
                }}
                placeholderBgColor={theme`colors.surfaceGrey`}
                required={true}
            />
            <TextInput
                value={addressInEdit && addressInEdit.street_number}
                name='address-street_number'
                autoComplete='address street_number'
                type='text'
                placeholder={t(`streetNumber`)}
                styleLabel={{
                    width: '48%',
                }}
                onChange={e => handleChange(e)}
                disabled={ui.isAddAddressLoading}
                style={{
                    background: 'transparent',
                }}
                placeholderBgColor={theme`colors.surfaceGrey`}
                required={true}
            />
            <TextInput
                value={addressInEdit && addressInEdit.house_number}
                name='address-house_number'
                autoComplete='address house_number'
                type='number'
                placeholder={t(`houseNumber`)}
                styleLabel={{
                    width: '48%',
                }}
                onChange={e => handleChange(e)}
                disabled={ui.isAddAddressLoading}
                style={{
                    background: 'transparent',
                }}
                placeholderBgColor={theme`colors.surfaceGrey`}
            />
            <TextInput
                value={addressInEdit && addressInEdit.zip_code}
                name='address-zip'
                autoComplete='address postal-code'
                type='text'
                placeholder={t(`zipcode`)}
                styleLabel={{
                    width: '48%',
                }}
                onChange={e => handleChange(e)}
                disabled={ui.isAddAddressLoading}
                style={{
                    background: 'transparent',
                }}
                placeholderBgColor={theme`colors.surfaceGrey`}
                required={true}
            />
            <TextInput
                value={addressInEdit && t(`cityNames.${addressInEdit.city}`)}
                name='city'
                placeholder={t(`city`)}
                styleLabel={{
                    width: '48%',
                }}
                disabled={true}
                locked={true}
                onChange={e => handleChange(e)}
                style={{
                    background: 'transparent',
                }}
                placeholderBgColor={theme`colors.surfaceGrey`}
            />
            <TextInput
                value={addressInEdit && addressInEdit.additional_information}
                name='address-additional_information'
                placeholder={t(`additionalInformation`)}
                styleLabel={{
                    width: '100%',
                }}
                onChange={e => handleChange(e)}
                disabled={ui.isAddAddressLoading}
                style={{
                    background: 'transparent',
                }}
                placeholderBgColor={theme`colors.surfaceGrey`}
            />
            <SecondaryButtonFull
                style={{
                    height: '48px',
                    width: '100%',
                    margin: '0',
                }}
                onClick={e => submitForm(e)}
                disabled={ui.isAddAddressLoading || !isSubmitAllowed}
            >
                {t(`add`)}
            </SecondaryButtonFull>
        </AddressEditorContainer>
    );
};

export default AddressEditor;
