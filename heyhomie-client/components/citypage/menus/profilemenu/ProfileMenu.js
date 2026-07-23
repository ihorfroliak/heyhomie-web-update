import Link from 'next/link';

import { useTranslations } from 'next-intl';

import tw, { css, styled, theme } from 'twin.macro';

import { useDispatch, useSelector } from 'react-redux';
import { _pushToOverlayActionStack, _removeFromOverlayActionStack, _toggleMenu } from '../../../../lib/slices/uiSlice';
import { signOutUser } from '../../../../lib/slices/userSlice';

import { PrimaryButtonFull, PrimaryButtonOutlined } from '../../../ui/Buttons';
import Spinner from '../../../ui/Spinner';

const StyledSidebarTest = styled.div`
    ${tw`bg-whiteStandard`};
    z-index: ${props => props.order + 30};

    position: fixed;
    transition: 0.3s ease-in-out;

    top: 0;

    height: 100%;
    width: 100vw;

    overflow-y: auto;

    right: ${props => (props.isOpen ? css`0` : '-100vw')};

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    @media (min-width: 1024px) {
        width: ${props => (props.customWidth ? `${props.customWidth}px` : '480px')};

        right: ${props => (props.isOpen ? (props.order === 0 ? css`0` : '480px') : '-480px')};
        box-shadow: ${props => (props.order === 0 ? 'none' : '0px 0px 4px 1px rgba(0, 0, 0, 0.05)')};

        z-index: ${props => (props.order === 1 ? 28 : props.order + 30)};
    }
`;

const ContentContainerProfileMenu = styled.section`
    position: relative;
    padding: 40px;

    width: 100%;
    height: 100%;
`;

const BackButton = styled.button`
    position: relative;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

const StyledHeading = styled.h1`
    font-size: 40px;
    font-weight: bold;
    ${tw`text-primary-dark`}
    line-height: 48px;

    @media (max-width: 768px) {
        font-size: 36px;
    }
`;

export const StyledLink = styled.a`
    ${tw`
        rounded-lg bg-primary-dark border-2 border-primary-dark border-solid
        m-4
        text-white font-bold
    `};
    text-decoration: none;
    cursor: pointer;
    &:disabled {
        opacity: 0.2;
        cursor: default;
    }
    &:hover {
        opacity: 0.9;
    }
    &:focus {
        outline: none;
        opacity: 0.9;
    }
`;

const ProfileMenu = () => {
    const t = useTranslations('CityPage.ProfileMenu');

    const dispatch = useDispatch();
    const { ui, user } = useSelector(state => state);

    return (
        <StyledSidebarTest isOpen={ui.profileMenuOpen} order={0}>
            <ContentContainerProfileMenu>
                <button
                    onClick={() => {
                        dispatch(_toggleMenu({ menu: 'profileMenuOpen', isOpen: false }));
                        dispatch(_removeFromOverlayActionStack('profileMenuOpen'));
                    }}
                >
                    <svg width='30' height='23' viewBox='0 0 30 23' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path
                            d='M28.7761 9.82594H4.43679L11.7155 2.07504C12.193 1.60066 12.193 0.831427 11.7155 0.355789C11.2364 -0.118596 10.4615 -0.118596 9.98402 0.355789L0 11.0674L9.8308 21.8535C10.0702 22.091 10.3829 22.2101 10.6965 22.2101C11.0092 22.2101 11.3229 22.091 11.5623 21.8535C12.0398 21.3782 12.0398 20.6099 11.5623 20.1346L4.35814 12.2568H28.7761C29.4514 12.2568 30 11.7125 30 11.0414C30 10.3702 29.4514 9.82594 28.7761 9.82594Z'
                            fill='#14133A'
                        />
                    </svg>
                </button>
                <StyledHeading>
                    {user && user.first_name}, {t(`welcome`)}
                </StyledHeading>
                <PrimaryButtonFull
                    style={{
                        height: '48px',
                        width: '100%',
                        marginLeft: '0',
                        marginRight: '0',
                        marginTop: '64px',
                    }}
                    onClick={() => {
                        dispatch(_toggleMenu({ menu: 'paymentMethodMenuOpen', isOpen: true }));
                        dispatch(_pushToOverlayActionStack('paymentMethodMenuOpen'));
                    }}
                >
                    {/* {t(`sign_up_form.confirmBtn`)} */}
                    Payment method
                </PrimaryButtonFull>
                <Link href='/account'>
                    <StyledLink
                        style={{
                            display: 'block',
                            height: '48px',
                            lineHeight: '48px',
                            textAlign: 'center',
                            width: '100%',
                            marginLeft: '0',
                            marginRight: '0',
                        }}
                    >
                        {t(`profile_link`)}
                    </StyledLink>
                </Link>
                <PrimaryButtonOutlined
                    style={{
                        position: 'absolute',
                        bottom: '64px',
                        left: 'calc(50% - 62px)',
                        height: '48px',
                        width: '124px',
                        marginLeft: '0',
                        marginRight: '0',
                        marginTop: '20%',
                    }}
                    disabled={ui.isSignOutLoading}
                    onClick={() => {
                        dispatch(signOutUser());
                    }}
                >
                    {t(`signout_btn`)}
                    {ui.isSignOutLoading ? (
                        <div style={{ position: 'absolute', right: '10px', top: '10px' }}>
                            <Spinner />
                        </div>
                    ) : null}
                </PrimaryButtonOutlined>
            </ContentContainerProfileMenu>
        </StyledSidebarTest>
    );
};

export default ProfileMenu;
