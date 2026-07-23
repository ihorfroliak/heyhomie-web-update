/* eslint-disable no-else-return */
/* eslint-disable no-useless-return */
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

import tw, { styled, theme } from 'twin.macro';

import { useTranslations } from 'next-intl';

import StyledSidebar from '../../Sidebar';

import { _removeFromOverlayActionStack, _toggleMenu } from '../../../../../lib/slices/uiSlice';

import DatePicker from './Datepicker';

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

const DatePickerSubmenu = ({ service, isOpen }) => {
    // UI translations for the component
    const t = useTranslations('CityPage.BookingMenu.DatePickerSubmenu');

    // Redux state
    const dispatch = useDispatch();

    // Handle outside clicks
    // Ref to track outside clicks/touches
    const node = useRef();

    const handleOutsideClick = event => {
        if (node.current.contains(event.target)) {
            return;
        } else {
            dispatch(_toggleMenu({ menu: `${service.type}DatePickerSubmenu`, isOpen: false }));
            dispatch(_removeFromOverlayActionStack(`${service.type}DatePickerSubmenu`));
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
        <StyledSidebar isOpen={isOpen} order={1} customWidth={404} ref={node}>
            {isOpen ? (
                <ContentContainer>
                    <CloseSubmenuMobile
                        onClick={() => {
                            dispatch(_toggleMenu({ menu: `${service.type}DatePickerSubmenu`, isOpen: false }));
                            dispatch(_removeFromOverlayActionStack(`${service.type}DatePickerSubmenu`));
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
                    <DatePicker service={service} available_params={service && service.available_params} />
                </ContentContainer>
            ) : null}
        </StyledSidebar>
    );
};

export default DatePickerSubmenu;
