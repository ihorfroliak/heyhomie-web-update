import React, { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/router';

import { useTranslations } from 'next-intl';

import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import tw, { css, styled, theme } from 'twin.macro';

import Spinner from '../../ui/Spinner';

import AddressCard from './AddressCard';
import AddNewAddressCard from './AddNewAddressCard';

const AddressesContainer = styled.div`
    width: 100%;
`;

const LoadingDiv = styled.div`
    height: 300px;

    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;

    margin-top: 32px;

    background: #ffffff;
    box-shadow: 0px 0px 14px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
`;

const AddressesWrapper = styled.div`
    width: 100%;

    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(296px, 1fr));
    grid-template-rows: auto;
    grid-column-gap: 16px;
    grid-row-gap: 16px;
    align-items: start;
    justify-items: start;
    justify-content: start;
    place-content: start;

    margin-top: 48px;

    @media (max-width: 768px) {
        justify-items: center;
        padding-left: 24px;
        padding-right: 24px;
    }

    ${props =>
        props.isLoading
            ? css`
                  opacity: 0.5;
              `
            : ``}
`;

const AddressesComponent = ({ handleSetAddressForDelete, handleSetAddressForEdit, handleSetAddNewAddress }) => {
    // UI translations for the component
    const t = useTranslations('AccountPage.AddressesPage');

    // Redux state
    const dispatch = useDispatch();
    const { user, ui, order, addresses } = useSelector(state => state);

    return (
        <AddressesContainer>
            {!ui.isAddressesLoading ? (
                <AddressesWrapper isLoading={ui.isAddressesLoading || ui.isEditAddressLoading || ui.isDeleteAddressLoading}>
                    {addresses.addresses &&
                        addresses.addresses.length > 0 &&
                        addresses.addresses.map(address => (
                            <AddressCard
                                key={address.id}
                                address={address}
                                handleSetAddressForDelete={handleSetAddressForDelete}
                                handleSetAddressForEdit={handleSetAddressForEdit}
                            />
                        ))}
                    <AddNewAddressCard handleSetAddNewAddress={handleSetAddNewAddress} />
                </AddressesWrapper>
            ) : (
                <LoadingDiv>
                    <Spinner />
                </LoadingDiv>
            )}
        </AddressesContainer>
    );
};

export default AddressesComponent;
