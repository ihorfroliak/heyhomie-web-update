import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { toast } from 'react-toastify';
import tw, { css, styled, theme } from 'twin.macro';
import { fetchReferralsData, sendReminder } from '../../../../api/endpoints/user';
import { _removeFromOverlayActionStack, _toggleMenu } from '../../../../lib/slices/uiSlice';
import { PrimaryButtonFull } from '../../../ui/Buttons';
import Spinner from '../../../ui/Spinner';

const RewardsModalContainer = styled.div`
    position: 'relative';

    background-color: #ffffff;
    box-shadow: 0px 0px 4px 1px rgba(0, 0, 0, 0.05);
    border-radius: 4px;

    position: fixed;
    transition: 0.2s ease-in-out;

    min-height: 200px;
    top: calc(40% - 100px);

    width: 300px;
    left: calc(50% - 150px);

    @media (min-width: 440px) {
        width: 400px;
        left: calc(50% - 200px);
    }

    @media (min-width: 640px) {
        width: 528px;
        left: calc(50% - 264px);
    }

    opacity: ${props => (props.isOpen ? '1' : '0')};
    z-index: ${props => (props.isOpen ? 50 : -10)};
`;

const RewardsModalContentContainer = styled.div`
    width: 100%;
    height: 100%;

    h2 {
        font-weight: bold;
        font-size: 28px;
        line-height: 130%;
        /* or 36px */

        text-align: center;

        color: #141338;

        margin-bottom: 54px;

        @media (max-width: 640px) {
            margin-bottom: 64px;
        }
    }

    padding-bottom: 16px;
    padding-top: 24px;
    padding-left: 45px;
    padding-right: 45px;

    @media (min-width: 640px) {
        padding-bottom: 40px;
        padding-top: 48px;
        padding-left: 50px;
        padding-right: 50px;
    }
`;

const SelectTab = styled.div`
    width: 100%;
    border-bottom: 1px solid #e2e2eb;
`;
const SelectTabButton = styled.button`
    min-width: 80px;

    border-bottom: 1px solid transparent;
    ${props =>
        props.selected
            ? css`
                  border-bottom: 1px solid #141338;
              `
            : ``}
    &:focus {
        outline: none;
    }

    transition: 0.2s ease-in-out;
`;

const EarnedTab = styled.div`
    max-height: 150px;
    overflow-y: auto;
`;
const EarnedTabCard = styled.div`
    background: #ffffff;
    box-shadow: 0px 0px 14px rgba(0, 0, 0, 0.05);
    border-radius: 8px;

    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;

    min-height: 49px;

    margin-top: 8px;
    margin-bottom: 8px;
    padding-right: 16px;
    padding-left: 16px;

    div {
        font-weight: bold;
        font-size: 14px;
        line-height: 17px;

        @media (max-width: 640px) {
            padding-top: 8px;
            padding-bottom: 8px;
            text-align: center;
            width: 100%;
        }
    }
    @media (max-width: 640px) {
        padding-top: 8px;
        padding-bottom: 8px;

        svg {
            width: 100%;
            justify-self: flex-end;
        }
    }
`;

const PendingTab = styled.div`
    max-height: 150px;
    overflow-y: auto;
`;
const PendingTabCard = styled.div`
    background: #ffffff;
    box-shadow: 0px 0px 14px rgba(0, 0, 0, 0.05);
    border-radius: 8px;

    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;

    min-height: 49px;

    margin-top: 8px;
    margin-bottom: 8px;
    padding-right: 16px;
    padding-left: 16px;

    div {
        font-weight: bold;
        font-size: 14px;
        line-height: 17px;

        @media (max-width: 640px) {
            padding-top: 8px;
            padding-bottom: 8px;
            text-align: center;
            width: 100%;
        }
    }
    button {
        font-weight: bold;
        font-size: 14px;
        line-height: 17px;
        color: #77ecc8;

        outline: none;

        cursor: pointer;

        @media (max-width: 640px) {
            padding-bottom: 8px;
            text-align: center;
            width: 100%;
        }
    }
    button:disabled {
        opacity: 0.2;
        cursor: default;
    }
`;

const PendingItem = ({ item }) => {
    // UI translations for the component
    const t = useTranslations('AccountPage.IndexPage.RewardsModal');

    // Redux state
    const { ui, user } = useSelector(state => state);

    // Component state
    const [isLoading, setIsLoading] = useState(false);
    const [hasSent, setHasSent] = useState(false);

    const handleSendReminder = async id => {
        setIsLoading(true);
        try {
            const res = await sendReminder(user.headers, user.x_token_user, item.user.id);

            if (res) {
                toast.success(t(`sendSuccess_toast`));
                setIsLoading(false);
                setHasSent(true);
            }
        } catch (err) {
            toast.error(t(`sendError_toast`));
            setIsLoading(false);
        }
    };

    return (
        <PendingTabCard>
            <div>{item.user.name}</div>
            <button onClick={() => handleSendReminder(item.user.id)} disabled={isLoading || hasSent}>
                {t(`resendPending_btn`)}
            </button>
        </PendingTabCard>
    );
};

const RewardsModal = () => {
    // Component state
    const [openedTab, setOpenedTab] = useState('earned');

    // Referrrals
    const [isLoading, setIsLoading] = useState(false);
    const [earnedItems, setEarnedItems] = useState([]);
    const [pendingItems, setPendingItems] = useState([]);

    // UI translations for the component
    const t = useTranslations('AccountPage.IndexPage.RewardsModal');

    // Redux state
    const dispatch = useDispatch();
    const { ui, user } = useSelector(state => state);

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            try {
                const { referrals } = await fetchReferralsData(user.headers, user.x_token_user);

                if (referrals && referrals.length > 0) {
                    const workingActive = referrals.filter(ref => ref.status !== 'pending');
                    const workingPending = referrals.filter(ref => ref.status === 'pending');

                    setEarnedItems(earnedItems => [...workingActive]);
                    setPendingItems(pendingItems => [...workingPending]);
                }

                setIsLoading(false);
            } catch (err) {
                setIsLoading(false);
                console.log(err);
            }
        }

        fetchData();
    }, []);

    return (
        <RewardsModalContainer isOpen={ui.rewardsModalOpen}>
            <svg
                width='100'
                height='100'
                viewBox='0 0 100 100'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                style={{
                    position: 'absolute',
                    left: '0px',
                    top: '30px',
                }}
            >
                <g clipPath='url(#clip0)'>
                    <path
                        d='M82.7383 64.9445C82.7401 64.1894 82.5315 63.45 82.135 62.807L78.2911 56.619C77.812 55.6674 77.5637 54.6161 77.5671 53.5508V34.4864C77.5671 22.1101 67.5351 12.0781 55.1587 12.0781H44.8164C32.4401 12.0781 22.4081 22.1101 22.4081 34.4864V53.5508C22.4116 54.6161 22.1634 55.6676 21.6841 56.619L17.8401 62.807C17.4437 63.45 17.2351 64.1894 17.2368 64.9445C17.2454 67.1596 19.0382 68.9521 21.253 68.9607H78.7217C80.937 68.9521 82.7297 67.1594 82.7383 64.9445Z'
                        fill='#77ECC8'
                    />
                    <path d='M55.1591 12.0782L63.7776 0.012207H36.1982L44.8168 12.0782V15.5256H55.1591V12.0782Z' fill='#77ECC8' />
                    <path
                        d='M82.1352 62.8071L78.2912 56.6191C77.8121 55.6675 77.5639 54.6162 77.5672 53.5509V34.4866C77.5793 29.4946 75.9229 24.6407 72.8616 20.6968C68.2592 46.0527 52.0564 60.6698 36.8359 68.9608H78.7223C80.9492 68.9694 82.7627 67.1716 82.7713 64.9429C82.7748 64.1878 82.5662 63.4484 82.1697 62.8071H82.1352Z'
                        fill='#31D6B1'
                    />
                    <path
                        d='M58.6063 37.9341V36.831C58.5977 33.6369 56.0087 31.048 52.8145 31.0392H51.7114V27.5918H48.264V31.0392H47.1609C43.9616 31.0289 41.3605 33.6127 41.3501 36.8119C41.3415 39.2406 42.8497 41.416 45.1269 42.2605L48.264 43.4326V49.9999H47.1609C45.8663 49.9999 44.8165 48.9501 44.8165 47.6556V46.5525H41.3691V47.6556C41.3777 50.8497 43.9667 53.4386 47.1609 53.4474H52.8147C56.0139 53.4577 58.6151 50.8739 58.6255 47.6747C58.634 45.246 57.1258 43.0706 54.8487 42.2261L51.7116 41.0541V34.4867H52.8147C54.1093 34.4867 55.1591 35.5365 55.1591 36.831V37.9341H58.6063ZM53.6421 45.4495C54.5522 45.8029 55.1538 46.6786 55.1589 47.656C55.1589 48.9505 54.1091 50.0003 52.8145 50.0003H51.7114V44.7257L53.6421 45.4495ZM48.2642 39.7613L46.3335 39.0373C45.4234 38.6839 44.8218 37.8082 44.8167 36.8308C44.8167 35.5363 45.8665 34.4865 47.161 34.4865H48.2642V39.7613Z'
                        fill='white'
                    />
                    <path
                        d='M84.4618 17.2493C83.8757 13.7122 81.104 10.9405 77.5669 10.3544C81.104 9.76824 83.8757 6.99657 84.4618 3.45947C85.0479 6.99657 87.8196 9.76824 91.3567 10.3544C87.8196 10.9405 85.0479 13.7124 84.4618 17.2493Z'
                        fill='#F9A736'
                    />
                    <path
                        d='M6.89489 51.7234C6.30876 48.1865 3.5371 45.4147 0 44.8287C3.5371 44.2426 6.30876 41.4709 6.89489 37.9338C7.48103 41.4709 10.2527 44.2426 13.7898 44.8287C10.2527 45.4147 7.48083 48.1865 6.89489 51.7234Z'
                        fill='#F9A736'
                    />
                    <path
                        d='M99.2343 60.1527C97.8191 57.7705 94.7785 56.9277 92.3394 58.2394L67.88 68.6851C67.4491 68.8677 66.9854 68.9626 66.5182 68.9609H36.198C34.2934 68.9609 32.7506 67.4181 32.7506 65.5134C32.7506 63.6087 34.2934 62.066 36.198 62.066H49.9878C55.7003 62.066 60.3302 57.4361 60.3302 51.7236H31.6475C26.8934 51.7271 22.3981 53.8904 19.4264 57.6015L8.61865 70.6845L20.7881 92.9893L67.6216 81.7335C69.6452 81.2663 71.6034 80.5493 73.4477 79.596L97.5797 67.2369C99.9808 65.7289 100.719 62.5693 99.2343 60.1527Z'
                        fill='#FEC9A3'
                    />
                    <path
                        d='M16.9097 85.8877L20.788 92.9894L67.6214 81.7336C69.645 81.2664 71.6032 80.5494 73.4475 79.5961L86.4961 72.8909C64.8116 79.5272 36.0256 83.6641 16.9097 85.8877Z'
                        fill='#F7BB8F'
                    />
                    <path d='M0 68.9609V99.9877H22.4083L27.5794 94.8166L6.89489 63.7898L0 68.9609Z' fill='#5465FC' />
                    <path d='M0 99.9878H22.4083L27.5794 94.8167L23.7872 89.1284C16.1203 92.2931 8.14977 94.6667 0 96.213V99.9878Z' fill='#4453D2' />
                    <path
                        d='M15.5134 94.8217C17.4173 94.8217 18.9608 93.2782 18.9608 91.3742C18.9608 89.4702 17.4173 87.9268 15.5134 87.9268C13.6094 87.9268 12.0659 89.4702 12.0659 91.3742C12.0659 93.2782 13.6094 94.8217 15.5134 94.8217Z'
                        fill='#E2E2EB'
                    />
                </g>
                <defs>
                    <clipPath id='clip0'>
                        <rect width='100' height='100' fill='white' />
                    </clipPath>
                </defs>
            </svg>
            {ui.rewardsModalOpen ? (
                <RewardsModalContentContainer>
                    <h2>{t(`heading`)}</h2>
                    <SelectTab>
                        <SelectTabButton
                            onClick={() => {
                                setOpenedTab(`earned`);
                            }}
                            selected={openedTab === `earned`}
                        >
                            {t(`earned_tab`)}
                        </SelectTabButton>
                        <SelectTabButton
                            onClick={() => {
                                setOpenedTab(`pending`);
                            }}
                            selected={openedTab === `pending`}
                        >
                            {t(`pending_tab`)}
                        </SelectTabButton>
                    </SelectTab>
                    {!isLoading ? (
                        openedTab === 'earned' ? (
                            <EarnedTab>
                                {earnedItems && earnedItems.length > 0 ? (
                                    earnedItems.map(item => (
                                        <EarnedTabCard key={item.user.id}>
                                            <div>{item.user.name}</div>
                                            <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                                <rect x='1' y='1' width='18' height='18' rx='9' fill='#77ECC8' stroke='#77ECC8' strokeWidth='2' />
                                                <path
                                                    d='M13.3764 6.35072C14.3725 6.32582 14.8706 7.52142 14.1609 8.21885L9.08041 13.3002C8.76911 13.6115 8.24612 13.6115 7.93482 13.3002L5.35724 10.7097C4.28637 9.68845 5.86778 8.10676 6.88885 9.17782L8.32084 10.6101C8.42046 10.7097 8.59478 10.7097 8.70685 10.6101L12.6293 6.68699C12.8285 6.47527 13.09 6.36318 13.3764 6.35072Z'
                                                    fill='white'
                                                />
                                            </svg>
                                        </EarnedTabCard>
                                    ))
                                ) : (
                                    <div
                                        style={{
                                            fontWeight: 'bold',
                                            textAlign: 'center',
                                            marginTop: '8px',
                                        }}
                                    >
                                        {t(`noEarned__msg`)}
                                    </div>
                                )}
                            </EarnedTab>
                        ) : (
                            <PendingTab>
                                {pendingItems && pendingItems.length > 0 ? (
                                    pendingItems.map(item => <PendingItem key={item.user.id} item={item} />)
                                ) : (
                                    <div
                                        style={{
                                            fontWeight: 'bold',
                                            textAlign: 'center',
                                            marginTop: '8px',
                                        }}
                                    >
                                        {t(`noPending__msg`)}
                                    </div>
                                )}
                            </PendingTab>
                        )
                    ) : (
                        <div
                            className={`
                                flex justify-center items-center
                                h-24
                            `}
                        >
                            <Spinner />
                        </div>
                    )}
                    <PrimaryButtonFull
                        onClick={() => {
                            dispatch(_toggleMenu({ menu: 'rewardsModalOpen', isOpen: false }));
                            dispatch(_removeFromOverlayActionStack('rewardsModalOpen'));
                        }}
                        style={{
                            display: 'block',
                            height: '48px',
                            width: '220px',
                            marginBottom: 0,
                            marginTop: 40,
                            marginLeft: 'auto',
                            marginRight: 'auto',
                        }}
                    >
                        {t(`close_btn`)}
                    </PrimaryButtonFull>
                </RewardsModalContentContainer>
            ) : null}
        </RewardsModalContainer>
    );
};

export default RewardsModal;
