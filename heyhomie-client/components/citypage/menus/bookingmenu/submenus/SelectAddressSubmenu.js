/* eslint-disable no-unneeded-ternary */
import { useEffect, useRef, useState } from 'react';

import { useTranslations } from 'next-intl';

import { useDispatch, useSelector } from 'react-redux';

import tw, { css, styled, theme } from 'twin.macro';
import StyledSidebar from '../../Sidebar';
import Spinner from '../../../../ui/Spinner';
import AddressOption from './AddressOption';

import AddNewAddressOption from './AddNewAddressOption';

import AddressEditor from './AddressEditor';
import { PrimaryButtonFull, SecondaryButtonFull } from '../../../../ui/Buttons';
import { addNewAddress } from '../../../../../lib/slices/addressesSlice';
import { _setServiceAddress, _setServiceLoading, _updateService } from '../../../../../lib/slices/orderSlice';
import { _removeFromOverlayActionStack, _toggleMenu } from '../../../../../lib/slices/uiSlice';
import { editServiceForOrder } from '../../../../../api/endpoints/orders';

const ContentContainer = styled.div`
    position: relative;
    padding-top: 48px;
    padding-bottom: 64px;
    padding-left: 24px;
    padding-right: 24px;

    background-color: ${theme`colors.surfaceGrey`};

    width: 100%;
    height: 100%;
`;

const StyledHeading = styled.div`
    font-size: 24px;
    color: ${theme`colors.primary.dark`};
    ${tw`
            font-bold
        `};
`;

const CloseSubmenuMobile = styled.button`
    position: absolute;
    left: 24px;
    top: 24px;
    @media (min-width: 1024px) {
        display: none;
    }
`;

const SelectAddressSubmenu = ({ service, isOpen }) => {
    // UI translations for the component
    const t = useTranslations('CityPage.BookingMenu.SelectAddressSubmenu');

    // Redux state
    const dispatch = useDispatch();
    const { ui, order, user, addresses } = useSelector(state => state);

    // Component state
    const [selectedAddress, setSelectedAddress] = useState({ ...service.address });
    const [isAddingNewAddress, setIsAddingNewAddress] = useState(
        addresses && addresses.addresses.filter(a => a.city === user.selectedCity).length === 0 ? true : false
    );

    const handleSelectAddNewAddress = () => {
        setSelectedAddress({
            address_id: '',
            address_name: '',
        });
        setIsAddingNewAddress(true);
    };

    const handleSelectAddress = address => {
        setSelectedAddress({
            address_id: address.id,
            address_name: address.name,
        });

        setIsAddingNewAddress(false);
    };

    const handleSubmitAddNewAddress = address => {
        dispatch(addNewAddress(address, setSelectedAddress));
        setIsAddingNewAddress(false);
    };

    const handleValidateSelectedAddress = async () => {
        try {
            const payload = {
                service: {
                    id: service.id,
                    address_id: selectedAddress.address_id,
                    address_name: selectedAddress.address_name,
                },
            };

            dispatch(
                _setServiceLoading({
                    homie_service_id: service.homie_service_id,
                    isLoading: true,
                })
            );

            const data = await editServiceForOrder(user.headers, user.x_token_user, user.x_token_visitor, order.id, payload);

            const configFromAPI = {};
            Object.keys(data.service).forEach(key => {
                if (
                    key !== 'id' &&
                    key !== 'type' &&
                    key !== 'status' &&
                    key !== 'city_id' &&
                    key !== 'address_id' &&
                    key !== 'address_name' &&
                    key !== 'mission_date' &&
                    key !== 'frequent_mission_day' &&
                    key !== 'frequent_mission_time'
                ) {
                    configFromAPI[key] = data.service[key];
                }
            });

            const updatedData = {
                status: data.service.status,
                config: { ...configFromAPI },
                address: {
                    address_id: data.service.address_id,
                    address_name: data.service.address_name,
                },
                date_time: {
                    mission_date: data.service.mission_date,
                    frequent_mission_day: data.service.frequent_mission_day,
                    frequent_mission_time: data.service.frequent_mission_time,
                },
                user_comment: data.service.user_comment,
            };

            dispatch(
                _updateService({
                    serviceID: service.id,
                    updatedData,
                })
            );

            dispatch(
                _setServiceLoading({
                    homie_service_id: service.homie_service_id,
                    isLoading: false,
                })
            );

            dispatch(_toggleMenu({ menu: `${service.type}SelectAddressSubmenuOpen`, isOpen: false }));
            dispatch(_removeFromOverlayActionStack(`${service.type}SelectAddressSubmenuOpen`));
        } catch (err) {
            console.log(err);
            dispatch(
                _setServiceLoading({
                    homie_service_id: service.homie_service_id,
                    isLoading: false,
                })
            );
        }
    };

    useEffect(() => {
        if (!isOpen) {
            setSelectedAddress({ selectedAddress });
            setIsAddingNewAddress(false);
        } else {
            setSelectedAddress({ ...service.address });
            setIsAddingNewAddress(addresses && addresses.addresses.filter(a => a.city === user.selectedCity).length === 0 ? true : false);
        }
    }, [isOpen]);

    // Handle outside clicks
    // Ref to track outside clicks/touches
    const node = useRef();

    const handleOutsideClick = event => {
        if (node.current.contains(event.target)) {
            return;
        } else {
            dispatch(_toggleMenu({ menu: `${service.type}SelectAddressSubmenuOpen`, isOpen: false }));
            dispatch(_removeFromOverlayActionStack(`${service.type}SelectAddressSubmenuOpen`));
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isOpen]);

    return (
        <StyledSidebar isOpen={isOpen} order={1} ref={node}>
            {isOpen ? (
                <ContentContainer>
                    <CloseSubmenuMobile
                        onClick={() => {
                            dispatch(_toggleMenu({ menu: `${service.type}SelectAddressSubmenuOpen`, isOpen: false }));
                            dispatch(_removeFromOverlayActionStack(`${service.type}SelectAddressSubmenuOpen`));
                        }}
                    >
                        <svg width='30' height='23' viewBox='0 0 30 23' fill='none' xmlns='http://www.w3.org/2000/svg'>
                            <path
                                d='M28.7761 9.82594H4.43679L11.7155 2.07504C12.193 1.60066 12.193 0.831427 11.7155 0.355789C11.2364 -0.118596 10.4615 -0.118596 9.98402 0.355789L0 11.0674L9.8308 21.8535C10.0702 22.091 10.3829 22.2101 10.6965 22.2101C11.0092 22.2101 11.3229 22.091 11.5623 21.8535C12.0398 21.3782 12.0398 20.6099 11.5623 20.1346L4.35814 12.2568H28.7761C29.4514 12.2568 30 11.7125 30 11.0414C30 10.3702 29.4514 9.82594 28.7761 9.82594Z'
                                fill='#14133A'
                            />
                        </svg>
                    </CloseSubmenuMobile>
                    <StyledHeading>{t(`heading`)}</StyledHeading>
                    {!addresses.isAddressesLoading ? (
                        <>
                            {addresses.addresses.filter(a => a.city === user.selectedCity).length > 0
                                ? addresses.addresses
                                      .filter(a => a.city === user.selectedCity)
                                      .map(address => (
                                          <AddressOption
                                              key={address.id}
                                              address={address}
                                              checked={selectedAddress.address_id === address.id}
                                              onSelect={address => handleSelectAddress(address)}
                                          />
                                      ))
                                : null}
                            <AddNewAddressOption checked={isAddingNewAddress} onSelect={handleSelectAddNewAddress} />
                            {isAddingNewAddress ? (
                                <>
                                    <div
                                        className={`
                            text-14px
                            mb-4 mt-8
                        `}
                                    >
                                        {t(`addNewAddressCaption`)}
                                    </div>
                                    <AddressEditor handleSubmit={handleSubmitAddNewAddress} />
                                </>
                            ) : null}
                        </>
                    ) : (
                        <div
                            className={`
                            flex justify-center items-center
                            w-full h-128px
                        `}
                        >
                            <Spinner />
                        </div>
                    )}
                    {!isAddingNewAddress ? (
                        <SecondaryButtonFull
                            style={{
                                marginLeft: '0',
                                marginRight: '0',
                                width: '100%',
                                height: '48px',
                            }}
                            disabled={!selectedAddress.address_id || !selectedAddress.address_name || service.isLoading ? true : false}
                            onClick={() => handleValidateSelectedAddress()}
                        >
                            {t(`validate`)}
                        </SecondaryButtonFull>
                    ) : null}
                </ContentContainer>
            ) : null}
        </StyledSidebar>
    );
};

export default SelectAddressSubmenu;
