/**
 * Account shell — the dark sidebar + header frame from "HeyHomie Web · Client
 * Account v3". Every account screen renders inside it.
 *
 * Layout, spacing, radii and type sizes are taken 1:1 from the design markup. The
 * colours are NOT hardcoded from that file: #141338 / #77ECC8 / #EDEEEF etc. are
 * already the theme tokens (tailwind.config.js), which is the same brand canon the
 * design was drawn against — so they resolve through `theme` and cannot drift.
 *
 * Everything personal is real, out of the Redux user session: the greeting name,
 * the phone, the referral code. Nothing here is placeholder copy dressed as data.
 */
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import tw, { styled, theme } from 'twin.macro';

const Frame = styled.div`
    ${tw`flex w-full`}
    min-height: 100vh;
    background: ${theme`colors.surfaceGrey`};
`;

const Sidebar = styled.aside`
    ${tw`flex flex-col flex-none`}
    width: 252px;
    background: ${theme`colors.primary.dark`};
    padding: 20px 16px;

    @media (max-width: 1023px) {
        display: none;
    }
`;

const Wordmark = styled.div`
    ${tw`flex items-center cursor-pointer`}
    height: 52px;
    margin: 0 0 18px 8px;
    font-family: Montserrat, sans-serif;
    font-weight: 500;
    font-size: 22px;
    color: #fff;
`;

const NewOrder = styled.div`
    ${tw`flex items-center justify-center cursor-pointer`}
    height: 52px;
    gap: 8px;
    border-radius: 8px;
    background: ${theme`colors.secondary.salad`};
    margin-bottom: 20px;
    font-weight: 700;
    font-size: 16px;
    color: ${theme`colors.primary.dark`};
`;

const Nav = styled.nav`
    ${tw`flex flex-col`}
    gap: 2px;
`;

const NavItem = styled.div`
    ${tw`flex items-center cursor-pointer`}
    height: 44px;
    gap: 12px;
    padding: 0 12px;
    border-radius: 8px;
    font-weight: ${p => (p.$active ? 700 : 500)};
    font-size: 14px;
    color: ${p => (p.$active ? '#fff' : 'rgba(255,255,255,0.62)')};
    background: ${p => (p.$active ? 'rgba(255,255,255,0.1)' : 'transparent')};

    &:hover {
        background: rgba(255, 255, 255, 0.07);
        color: #fff;
    }
`;

const Referral = styled.div`
    ${tw`cursor-pointer`}
    margin-top: auto;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.07);
    padding: 16px;

    .title {
        font-weight: 700;
        font-size: 14px;
        color: #fff;
    }
    .body {
        font-weight: 500;
        font-size: 12px;
        line-height: 1.45;
        color: rgba(255, 255, 255, 0.55);
        margin-top: 5px;
    }
    .code {
        ${tw`flex items-center justify-between`}
        gap: 8px;
        height: 36px;
        margin-top: 12px;
        padding: 0 12px;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.1);
    }
    .code b {
        font-weight: 800;
        font-size: 13px;
        letter-spacing: 0.06em;
        color: ${theme`colors.secondary.salad`};
    }
    .code span {
        font-weight: 700;
        font-size: 11px;
        color: rgba(255, 255, 255, 0.5);
    }
`;

const Main = styled.main`
    ${tw`flex flex-col flex-1`}
    min-width: 0;
`;

const Header = styled.header`
    ${tw`flex items-center flex-none bg-white`}
    height: 76px;
    gap: 18px;
    padding: 0 32px;
    border-bottom: 1px solid ${theme`colors.borderColor`};

    @media (max-width: 767px) {
        padding: 0 16px;
        gap: 10px;
    }
`;

const Titles = styled.div`
    ${tw`flex-1`}
    min-width: 0;

    .t {
        font-weight: 700;
        font-size: 20px;
        line-height: 1.2;
        color: ${theme`colors.primary.dark`};
    }
    .s {
        font-weight: 500;
        font-size: 13px;
        color: ${theme`colors.primary.grey`};
        margin-top: 2px;
    }
`;

const Who = styled.div`
    ${tw`flex items-center cursor-pointer`}
    gap: 10px;
    padding-left: 16px;
    border-left: 1px solid ${theme`colors.borderColor`};

    .avatar {
        ${tw`flex items-center justify-center flex-none`}
        width: 38px;
        height: 38px;
        border-radius: 19px;
        background: #c8cff0;
        font-weight: 800;
        font-size: 13px;
        color: ${theme`colors.primary.dark`};
    }
    .name {
        font-weight: 700;
        font-size: 13.5px;
        line-height: 1.2;
        color: ${theme`colors.primary.dark`};
    }
    .phone {
        font-weight: 500;
        font-size: 12px;
        color: ${theme`colors.primary.grey`};
    }

    @media (max-width: 767px) {
        .name,
        .phone {
            display: none;
        }
    }
`;

const Scroll = styled.div`
    ${tw`flex-1`}
    overflow-y: auto;
`;

/** Routes that already exist get linked; the rest land as this build ports them. */
export const ACCOUNT_NAV = [
    { key: 'overview', label: 'Overview', href: '/account' },
    { key: 'missions', label: 'Missions', href: '/account/missions' },
    { key: 'services', label: 'Services', href: '/account/services' },
    { key: 'homes', label: 'Homes', href: '/account/addresses' },
    { key: 'billings', label: 'Billings', href: '/account/payment' },
    { key: 'rewards', label: 'Rewards', href: '/account/rewards' },
    { key: 'settings', label: 'Settings', href: '/account/settings' },
];

const initialsOf = (first, last) => `${(first || '').charAt(0)}${(last || '').charAt(0)}`.toUpperCase() || 'HH';

export default function AccountShell({ active, title, subtitle, children }) {
    const router = useRouter();
    const user = useSelector(state => state.user);
    const [copied, setCopied] = useState(false);

    const copyReferral = e => {
        e.stopPropagation();
        if (!user.referral_code || typeof navigator === 'undefined' || !navigator.clipboard) return;
        navigator.clipboard.writeText(user.referral_code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <Frame>
            <Sidebar>
                <Wordmark onClick={() => router.push('/account')}>homie</Wordmark>

                <NewOrder onClick={() => router.push('/cleaning')}>
                    <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke={theme`colors.primary.dark`} strokeWidth='2' strokeLinecap='round'>
                        <line x1='12' y1='5' x2='12' y2='19' />
                        <line x1='5' y1='12' x2='19' y2='12' />
                    </svg>
                    <span>Create new order</span>
                </NewOrder>

                <Nav>
                    {ACCOUNT_NAV.map(n => (
                        <NavItem key={n.key} $active={n.key === active} onClick={() => router.push(n.href)}>
                            {n.label}
                        </NavItem>
                    ))}
                </Nav>

                {/* The code is the account's real `referral_code`; the card is hidden
                    rather than showing an empty box when the session has none yet. */}
                {user.referral_code ? (
                    <Referral onClick={() => router.push('/account/rewards')}>
                        <div className='title'>Invite a friend</div>
                        <div className='body'>They get a discount on their first order, and you earn credit for every order they make.</div>
                        <div className='code' onClick={copyReferral}>
                            <b>{user.referral_code}</b>
                            <span>{copied ? 'copied' : 'copy'}</span>
                        </div>
                    </Referral>
                ) : null}
            </Sidebar>

            <Main>
                <Header>
                    <Titles>
                        <div className='t'>{title}</div>
                        {subtitle ? <div className='s'>{subtitle}</div> : null}
                    </Titles>
                    <Who onClick={() => router.push('/account/settings')}>
                        <div className='avatar'>{initialsOf(user.first_name, user.last_name)}</div>
                        <div>
                            <div className='name'>{user.first_name ? `Hey ${user.first_name} 👋` : 'Your account'}</div>
                            {user.phone_number ? <div className='phone'>{user.phone_number}</div> : null}
                        </div>
                    </Who>
                </Header>
                <Scroll>{children}</Scroll>
            </Main>
        </Frame>
    );
}
