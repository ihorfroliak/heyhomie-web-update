import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

import { useDispatch, useSelector, useStore } from 'react-redux';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';

import tw, { css, styled, theme } from 'twin.macro';
import { addCoupon, fetchReferralsData } from '../../../../api/endpoints/user';
import { _pushToOverlayActionStack, _toggleMenu } from '../../../../lib/slices/uiSlice';
import { synchronizeCouponData } from '../../../../lib/slices/userSlice';

import { PrimaryButtonFull, SecondaryButtonFull } from '../../../ui/Buttons';
import { TextInput } from '../../../ui/Input';
import Spinner from '../../../ui/Spinner';
import SocialShare from '../referralmenu/SocialLinksShare';

const ReferralInfo = styled.div`
    width: 100%;

    margin-top: 32px;

    background: #5465fc;
    box-shadow: 0px 0px 14px rgba(0, 0, 0, 0.05);
    border-radius: 8px;

    display: flex;
    flex-wrap: wrap;
`;
const ShareLinkDiv = styled.div`
    position: relative;

    min-height: 230px;
    width: 100%;

    margin-top: 24px;
    margin-left: 16px;
    margin-right: 16px;
    margin-bottom: 16px;

    padding-top: 24px;
    padding-left: 16px;
    padding-right: 16px;
    padding-bottom: 0px;

    background: #ffffff;
    border-radius: 8px;

    .rewardsDiv__copyDiv {
        max-width: 80%;
        @media (max-width: 440px) {
            max-width: 200px;
        }
    }

    .shareLinksButtonDiv {
        width: 100%;

        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;

        margin-top: 16px;

        @media (min-width: 640px) {
            width: 50%;
        }
    }
    .shareLinksEarningsDiv {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        align-items: center;

        margin-top: 16px;

        width: 100%;
        @media (min-width: 640px) {
            width: 50%;
        }
    }

    @media (min-width: 1100px) {
        width: 55%;
        border-radius: 8px 8px 0px 0px;
        margin-right: 8px;
        margin-bottom: 0;
    }
`;
const AddCouponContainer = styled.div`
    position: relative;
    min-height: 230px;
    width: 100%;

    margin-top: 24px;
    margin-left: 16px;
    margin-right: 16px;
    margin-bottom: 16px;

    padding-left: 16px;
    padding-right: 16px;
    padding-bottom: 24px;
    padding-top: 32px;

    background: #ffffff;
    border-radius: 8px;

    @media (min-width: 1100px) {
        width: 37%;
        border-radius: 8px 8px 0px 0px;
        margin-left: 8px;
        margin-bottom: 0;
    }
`;

const CouponDiv = styled.div`
    background: #77ecc8;
    border-radius: 8px;

    display: grid;
    grid-template-areas:
        'type amount'
        'name amount';
    align-items: center;

    width: 100%;

    margin-top: 24px;

    padding: 16px;

    .couponDiv__couponType {
        grid-area: type;
    }
    .couponDiv__couponCode {
        grid-area: name;
        font-weight: bold;
    }
    .couponDiv__couponAmount {
        grid-area: amount;
        font-weight: bold;
        text-align: right;
    }
`;

const ReferralSection = () => {
    // UI translations for the component
    const t = useTranslations('AccountPage.IndexPage.ReferralDiv');

    // Router
    const router = useRouter();

    // Redux state
    const dispatch = useDispatch();
    const { user, ui, order } = useSelector(state => state);

    // Copy refferal link to clipboard
    const handleCopyRefLinkToClipBoard = () => {
        navigator && navigator.clipboard.writeText(user.referral_code).catch(err => console.log(err));

        toast.success(t(`copied_msg`));
    };

    const [shareLinks, setShareLinks] = useState(false);
    const [shareURL, setShareURL] = useState(``);

    // Add coupon
    const [couponInput, setCouponInput] = useState('');
    const [isAddCouponLoading, setIsAddCouponLoading] = useState(false);

    const handleAddCoupon = async () => {
        setIsAddCouponLoading(true);
        try {
            const res = await addCoupon(user.headers, user.x_token_user, couponInput);

            toast.success(t(`coupon_added_toast`));
            setIsAddCouponLoading(false);
            setCouponInput('');
            dispatch(synchronizeCouponData());
        } catch (err) {
            setIsAddCouponLoading(false);
            if (err.response && err.response.data && err.response.data.errors[0].code) {
                switch (err.response.data.errors[0].code) {
                    case 'coupon_is_duplicate': {
                        toast.warning(t(`coupon_duplicate_toast`));
                        break;
                    }
                    case 'not_found': {
                        toast.error(t(`coupon_not_valid_toast`));
                        break;
                    }
                    case 'coupon_has_expired': {
                        toast.error(t(`coupon_has_expired`));
                        break;
                    }
                    case 'coupon_is_not_active_yet': {
                        toast.warning(t(`coupon_is_not_active_yet`));
                        break;
                    }
                    case 'user_already_ordered': {
                        toast.error(t(`user_already_ordered`));
                        break;
                    }
                    case 'user_has_referral_coupon': {
                        toast.error(t(`user_has_referral_coupon`));
                        break;
                    }
                    case 'user_identical_to_sponsor': {
                        toast.error(t(`user_identical_to_sponsor`));
                        break;
                    }
                    default: {
                        toast.error(t(`coupon_error_generic_toast`));
                        break;
                    }
                }
            }
            dispatch(synchronizeCouponData());
        }
    };

    useEffect(() => {
        setShareURL(
            `${window && window.location && window.location.origin}${router.locale !== 'pl' ? `/${router.locale}` : ``}?referral=${user.referral_code}`
        );
    }, [router.locale]);

    return (
        <div className='w-full'>
            <ReferralInfo>
                <ShareLinkDiv>
                    <svg
                        style={{
                            position: 'absolute',
                            right: '0',
                        }}
                        width='101'
                        height='100'
                        viewBox='0 0 101 100'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                    >
                        <path
                            d='M17.4343 64.9445C17.4325 64.1895 17.6432 63.45 18.0437 62.807L21.926 56.619C22.4099 55.6674 22.6606 54.6161 22.6573 53.5508V34.4864C22.6573 22.1101 32.7896 12.0781 45.2897 12.0781H55.7354C68.2355 12.0781 78.3678 22.1101 78.3678 34.4864V53.5508C78.3643 54.6161 78.615 55.6676 79.0991 56.619L82.9815 62.807C83.3819 63.45 83.5926 64.1895 83.5908 64.9445C83.5821 67.1596 81.7714 68.9521 79.5345 68.9607H21.4911C19.2537 68.9521 17.443 67.1594 17.4343 64.9445Z'
                            fill='#77ECC8'
                        />
                        <path d='M45.2895 12.0782L36.5848 0.012207H64.4399L55.7352 12.0782V15.5256H45.2895V12.0782Z' fill='#77ECC8' />
                        <path
                            d='M18.0437 62.8071L21.9261 56.6191C22.41 55.6675 22.6607 54.6162 22.6573 53.5509V34.4866C22.6451 29.4946 24.3181 24.6407 27.41 20.6968C32.0584 46.0527 48.4233 60.6698 63.7959 68.9608H21.4907C19.2415 68.9694 17.4099 67.1716 17.4012 64.9429C17.3976 64.1878 17.6083 63.4484 18.0088 62.8071H18.0437Z'
                            fill='#31D6B1'
                        />
                        <path
                            d='M59.4306 38.0001V36.9335C59.422 33.8451 56.8067 31.3419 53.5803 31.3334H52.466V28H48.9838V31.3334H47.8695C44.6379 31.3234 42.0105 33.8216 42 36.915C41.9914 39.2633 43.5148 41.3667 45.815 42.1833L48.9838 43.3166V49.6666H47.8695C46.5619 49.6666 45.5015 48.6515 45.5015 47.3999V46.3332H42.0192V47.3999C42.0279 50.4883 44.6431 52.9915 47.8695 53H53.5805C56.8121 53.01 59.4395 50.5117 59.45 47.4184C59.4586 45.07 57.9352 42.9666 55.635 42.1501L52.4662 41.0168V34.6667H53.5805C54.8881 34.6667 55.9485 35.6818 55.9485 36.9335V38.0001H59.4306ZM54.4162 45.2668C55.3356 45.6084 55.9432 46.4552 55.9483 47.4002C55.9483 48.6519 54.8879 49.667 53.5803 49.667H52.466V44.5669L54.4162 45.2668ZM48.984 39.7668L47.0338 39.0667C46.1144 38.7251 45.5068 37.8783 45.5017 36.9333C45.5017 35.6816 46.5621 34.6665 47.8697 34.6665H48.984V39.7668Z'
                            fill='white'
                        />
                        <path
                            d='M15.6934 17.2493C16.2854 13.7122 19.0848 10.9405 22.6572 10.3544C19.0848 9.76824 16.2854 6.99657 15.6934 3.45947C15.1014 6.99657 12.302 9.76824 8.72955 10.3544C12.302 10.9405 15.1014 13.7124 15.6934 17.2493Z'
                            fill='#F9A736'
                        />
                        <path
                            d='M94.0362 51.7237C94.6281 48.1868 97.4275 45.4149 101 44.829C97.4275 44.2428 94.6281 41.4712 94.0362 37.9341C93.4442 41.4712 90.6448 44.2428 87.0723 44.829C90.6448 45.4149 93.4444 48.1868 94.0362 51.7237Z'
                            fill='#F9A736'
                        />
                        <path
                            d='M0.773338 60.1527C2.20272 57.7705 5.27374 56.9277 7.73718 58.2394L32.4413 68.6851C32.8764 68.8677 33.3447 68.9626 33.8166 68.9609H64.44C66.3637 68.9609 67.9219 67.4181 67.9219 65.5134C67.9219 63.6087 66.3637 62.066 64.44 62.066H50.5123C44.7427 62.066 40.0665 57.4361 40.0665 51.7236H69.0361C73.8377 51.7271 78.3779 53.8904 81.3793 57.6015L92.2952 70.6845L80.004 92.9893L32.7022 81.7335C30.6584 81.2663 28.6806 80.5493 26.8178 79.596L2.44456 67.2369C0.0193939 65.7289 -0.725677 62.5693 0.773338 60.1527Z'
                            fill='#FEC9A3'
                        />
                        <path
                            d='M83.9211 85.8879L80.0041 92.9897L32.7023 81.7339C30.6584 81.2667 28.6807 80.5497 26.8179 79.5964L13.6388 72.8911C35.5402 79.5274 64.614 83.6643 83.9211 85.8879Z'
                            fill='#F7BB8F'
                        />
                        <path d='M101 68.9606V99.9874H78.3676L73.1448 94.8164L94.0362 63.7896L101 68.9606Z' fill='#5465FC' />
                        <path d='M101 99.9878H78.3676L73.1448 94.8167L76.9749 89.1284C84.7185 92.2931 92.7687 94.6667 101 96.213V99.9878Z' fill='#4453D2' />
                        <path
                            d='M85.3316 94.8217C83.4085 94.8217 81.8496 93.2782 81.8496 91.3742C81.8496 89.4702 83.4085 87.9268 85.3316 87.9268C87.2546 87.9268 88.8135 89.4702 88.8135 91.3742C88.8135 93.2782 87.2546 94.8217 85.3316 94.8217Z'
                            fill='#E2E2EB'
                        />
                    </svg>
                    <div className='rewardsDiv__copyDiv'>
                        <h2
                            style={{
                                fontWeight: 'bold',
                                fontSize: '28px',
                                color: '#000000',
                            }}
                        >
                            {t(`rewardsHeading`)}
                        </h2>
                        <div>
                            <span
                                style={{
                                    fontWeight: 'bold',
                                    fontSize: '18px',
                                }}
                            >
                                {t(`rewardsPara_1`)}&nbsp;
                            </span>
                            <button
                                style={{
                                    color: 'purple',
                                    fontWeight: 'bold',
                                    fontSize: '22px',
                                    outline: 'none',
                                }}
                                onClick={() => handleCopyRefLinkToClipBoard()}
                            >
                                {user.referral_code}
                            </button>
                        </div>
                        <div>{t(`rewardsPara_2`)}</div>
                    </div>
                    <div
                        className={`
                        flex flex-wrap items-center
                        py-16px
                    `}
                    >
                        <div className='shareLinksButtonDiv'>
                            {!shareLinks ? (
                                <PrimaryButtonFull
                                    style={{
                                        display: 'block',
                                        height: '48px',
                                        width: '100%',
                                        marginTop: 0,
                                        marginBottom: 0,
                                        marginLeft: 0,
                                        marginRight: 0,
                                    }}
                                    onClick={() => setShareLinks(true)}
                                >
                                    {t(`shareLink_btn`)}
                                </PrimaryButtonFull>
                            ) : (
                                <SocialShare url={shareURL} title={t(`socialShareTitle`)} />
                            )}
                        </div>
                        <div className='shareLinksEarningsDiv'>
                            <div
                                style={{
                                    width: '50%',
                                    textAlign: 'right',
                                    paddingRight: '24px',
                                    borderRight: '1px solid #E2E2EB',
                                }}
                            >
                                <div
                                    style={{
                                        fontWeight: 'bold',
                                        fontSize: '12px',
                                        lineHeight: '14px',
                                    }}
                                >
                                    {t(`earned`)}
                                </div>
                                <div
                                    style={{
                                        fontSize: '28px',
                                        lineHeight: '34px',
                                        color: theme`colors.secondary.salad`,
                                    }}
                                >
                                    {user.earned_amount}zł
                                </div>
                            </div>
                            <div
                                style={{
                                    width: '50%',
                                    paddingLeft: '24px',
                                    textAlign: 'left',
                                }}
                            >
                                <div
                                    style={{
                                        fontWeight: 'bold',
                                        fontSize: '12px',
                                        lineHeight: '14px',
                                    }}
                                >
                                    {t(`pending`)}
                                </div>
                                <div
                                    style={{
                                        fontSize: '28px',
                                        lineHeight: '34px',
                                        color: theme`colors.primary.dark`,
                                    }}
                                >
                                    {user.pending_amount}zł
                                </div>
                            </div>
                            <div className='flex justify-center w-full mt-16px'>
                                <button
                                    style={{
                                        display: 'block',
                                        outline: 'none',
                                    }}
                                    onClick={() => {
                                        dispatch(_toggleMenu({ menu: 'rewardsModalOpen', isOpen: true }));
                                        dispatch(_pushToOverlayActionStack('rewardsModalOpen'));
                                    }}
                                >
                                    {t(`seeDetails_btn`)}
                                </button>
                            </div>
                        </div>
                    </div>
                </ShareLinkDiv>
                <AddCouponContainer>
                    <div
                        className={`
                        w-full font-bold text-center
                    `}
                    >
                        {t(`addCouponPara_1`)}
                    </div>
                    <div
                        className={`
                        w-full text-center
                    `}
                    >
                        {t(`addCouponPara_2`)}
                    </div>
                    <TextInput
                        style={{
                            marginTop: '20px',
                        }}
                        value={couponInput}
                        onChange={e => setCouponInput(e.target.value)}
                        placeholder={t(`addCoupon_placeholder`)}
                    />
                    <SecondaryButtonFull
                        style={{
                            display: 'block',
                            height: '48px',
                            width: '100%',
                            marginTop: 0,
                            marginBottom: 0,
                            marginLeft: 0,
                            marginRight: 0,
                        }}
                        onClick={() => handleAddCoupon()}
                        disabled={isAddCouponLoading || !couponInput}
                    >
                        {t(`addCoupon_btn`)}
                    </SecondaryButtonFull>
                </AddCouponContainer>
            </ReferralInfo>
            {user.coupon ? (
                <CouponDiv>
                    <div className='couponDiv__couponType'>{t(`${user.coupon.type}`)}</div>
                    <div className='couponDiv__couponCode'>{user.coupon.code_name}</div>
                    <div className='couponDiv__couponAmount'>{user.coupon.discount}%</div>
                </CouponDiv>
            ) : null}
        </div>
    );
};

export default ReferralSection;
