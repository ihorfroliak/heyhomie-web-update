import React, { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/router';

import { useTranslations } from 'next-intl';

import { useDispatch, useSelector, useStore } from 'react-redux';
import { toast } from 'react-toastify';

import tw, { css, styled, theme } from 'twin.macro';

import Spinner from '../../ui/Spinner';

import { fetchPayments } from '../../../api/endpoints/cards';

const BillingsContainer = styled.div`
    width: 100%;

    h2 {
        font-weight: bold;
        font-size: 28px;
        line-height: 34px;
        color: #141338;

        margin-top: 40px;
        margin-bottom: 24px;

        padding-left: 24px;

        @media (min-width: 678px) {
            padding-left: 0px;
        }
    }
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

const BillingsWrapper = styled.div`
    width: 100%;

    overflow-y: auto;
    max-height: 400px;

    margin-bottom: 92px;

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

    @media(min-width: 640px) {
        max-height: 256px;
    }
`;

const BillingDiv = styled.div`
    min-height: 88px;
    background: #ffffff;
    box-shadow: 0px 0px 4px 2px rgba(0, 0, 0, 0.05);
    border-radius: 4px;

    padding-left: 24px;
    padding-right: 24px;

    margin-bottom: 16px;

    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    grid-template-areas:
        'billingService billingAmount billingDate'
        'downloadInvoice downloadInvoice downloadInvoice';

    .billingService {
        grid-area: billingService;

        font-weight: bold;
        font-size: 18px;
        color: #141338;
    }

    .billingDate {
        grid-area: billingDate;
        font-size: 12px;

        display: flex;
        justify-content: flex-end;
        align-items: center;

        color: #727189;

        @media (min-width: 640px) {
            font-size: 14px;
            justify-content: flex-start;
        }
    }

    .billingAmount {
        grid-area: billingAmount;
        font-size: 14px;
        color: #141338;

        display: flex;
        justify-content: flex-start;
        align-items: center;

        padding-left: 16px;

        @media (min-width: 640px) {
            justify-content: flex-end;
        }
    }

    .downloadInvoice {
        grid-area: downloadInvoice;

        display: flex;
        flex-wrap: wrap;
        justify-content: center;

        cursor: pointer;

        div {
            text-decoration: none;
            font-weight: bold;
            font-size: 16px;
            color: #141338;
        }

        @media (min-width: 640px) {
            justify-content: flex-end;
            align-items: center;
        }
    }

    @media (min-width: 640px) {
        min-width: 400px;
        min-height: 52px;

        grid-template-areas: 'billingService billingDate billingAmount downloadInvoice';
        grid-template-columns: 2fr 2fr 1fr 3fr;
        grid-template-rows: 1fr;
    }
`;

const BillingsComponent = () => {
    // UI translations for the component
    const t = useTranslations('AccountPage.PaymentPage.BillingsComponent');

    // Redux state
    const dispatch = useDispatch();
    const { user, ui, order, cards } = useSelector(state => state);

    // Components state
    const [isLoading, setIsLoading] = useState(false);
    const [billings, setBillings] = useState([]);

    const router = useRouter();
    // Utils
    function parseDateTime(date_timeObject) {
        const { locale } = router;
        let month = new Date(date_timeObject * 1000).toLocaleString(locale, { month: 'long' });
        month = month.charAt(0).toUpperCase() + month.slice(1);

        const day = new Date(date_timeObject * 1000).getUTCDate();

        const year = new Date(date_timeObject * 1000).getUTCFullYear();

        const time = new Date(date_timeObject * 1000).getUTCHours();

        const string = `${month} ${day}, ${year} - ${time}:00`;
        return string;
    }

    useEffect(() => {
        async function fetchBillings() {
            setIsLoading(true);
            try {
                const { payments } = await fetchPayments(user.headers, user.x_token_user);

                if (payments) {
                    setBillings(billings => [...payments]);
                }
                setIsLoading(false);
            } catch (err) {
                setIsLoading(false);
                console.log(err);
            }
        }

        fetchBillings();
    }, []);

    return (
        <BillingsContainer>
            <h2>{t(`heading`)}</h2>
            {!isLoading ? (
                <BillingsWrapper isLoading={isLoading}>
                    {billings && billings.length > 0 ? (
                        billings.map((billing, index) => (
                            <BillingDiv key={billing.id}>
                                <div className='billingService flex justify-start items-center'>
                                    <img
                                        src={billing.mission.icon_image}
                                        style={{
                                            height: '24px',
                                            width: 'auto',
                                            marginRight: '8px',
                                        }}
                                    />
                                    <div>{t(`servicesNames.${billing.mission.type}`)}</div>
                                </div>
                                <div className='billingDate'>{parseDateTime(billing.mission.meeting_date)}</div>
                                <div className='billingAmount'>{billing.amount}zł</div>
                                {billing.status === 'failed' ? (
                                    <div
                                        className='downloadInvoice'
                                        style={{
                                            cursor: 'default',
                                        }}
                                    >
                                        <span className='text-primary-maroon'>{t(`paymentFailed_msg`)}</span>
                                    </div>
                                ) : (
                                    <a className='downloadInvoice' target='blank' href={billing.stripe_receipt_url}>
                                        <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                            <path
                                                d='M18.9333 18.8667H5.06667C4.47756 18.8667 4 19.3443 4 19.9334C4 20.5225 4.47756 21 5.06667 21H18.9333C19.5224 21 20 20.5225 20 19.9334C20 19.3443 19.5224 18.8667 18.9333 18.8667Z'
                                                fill='#141338'
                                            />
                                            <path
                                                fillRule='evenodd'
                                                clipRule='evenodd'
                                                d='M9.05062 11.6998C8.60658 11.257 7.88769 11.2573 7.44407 11.6998C7.00035 12.1423 7.00047 12.8596 7.44411 13.302L11.4641 17.312C11.7602 17.6073 12.2403 17.6071 12.5362 17.312L16.5562 13.302C17.0002 12.8592 16.9999 12.1422 16.5563 11.6998C16.1125 11.2572 15.3934 11.2573 14.9497 11.6998L13.1258 13.5196V6.22141C13.1258 5.59638 12.6172 5.08894 11.9898 5.08894C11.3623 5.08894 10.8538 5.59596 10.8538 6.22141V13.4989L9.05062 11.6998Z'
                                                fill='#141338'
                                            />
                                        </svg>
                                        <div>{t(`downloadInvoice_btn`)}</div>
                                    </a>
                                )}
                            </BillingDiv>
                        ))
                    ) : (
                        <div className='w-full py-2 font-bold'>{t(`noBillings_msg`)}</div>
                    )}
                </BillingsWrapper>
            ) : (
                <LoadingDiv>
                    <Spinner />
                </LoadingDiv>
            )}
        </BillingsContainer>
    );
};

export default BillingsComponent;
