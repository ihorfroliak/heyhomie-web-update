import { useTranslations } from 'next-intl';
import React, { useEffect, useRef, useState } from 'react';

import tw, { css, styled, theme } from 'twin.macro';

const StyledCancelledServiceCard = styled.div`
    min-height: 122px;

    background: #ffffff;
    box-shadow: 0px 0px 14px rgba(0, 0, 0, 0.05);
    border-radius: 8px;

    margin-bottom: 16px;

    padding: 20px;
    padding-bottom: 16px;

    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    display: grid;
    grid-template-areas:
        'serviceData serviceEdit'
        'serviceStatus serviceCancel';

    .serviceData {
        .serviceData__date {
            font-weight: bold;
            font-size: 12px;
            line-height: 14px;
            color: #727189;

            text-transform: capitalize;

            margin-bottom: 8px;
        }

        .serviceData__service {
            div:nth-child(2) {
                font-weight: bold;
                font-size: 18px;
                line-height: 22px;
                color: #141338;

                margin-left: 8px;
                margin-right: 8px;
            }
            div:nth-child(3) {
                font-size: 14px;
                line-height: 22px;
                color: #727189;
            }
        }
    }

    .serviceEdit {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        align-content: flex-start;

        div {
            width: 100%;
            text-align: right;

            font-size: 14px;
            color: #141338;
            height: 17px;
            line-height: 17px;

            .serviceEdit__comingSoon {
                color: #727189;

                opacity: 0.3;
            }
        }
    }

    .serviceStatus {
        align-self: flex-end;
    }

    .serviceCancel {
        align-self: flex-end;

        text-align: right;
    }

    @media (min-width: 768px) {
        min-height: 86px;

        padding-bottom: 20px;

        grid-template-areas: 'serviceData serviceStatus serviceEdit serviceCancel';
        grid-template-columns: 2fr 1fr 1fr 0fr;

        .serviceData {
            align-self: center;
        }
        .serviceEdit {
            height: 100%;
            align-items: center;

            align-self: center;

            div {
                height: 100%;
                line-height: 100%;
                width: initial;
                margin-left: 7px;

                display: flex;
                align-items: center;

                .serviceEdit__comingSoon {
                    display: inline-block;
                }
            }
        }
        .serviceStatus {
            align-self: center;
        }
        .serviceCancel {
            align-self: center;
        }
    }
`;

const CancelledServiceCard = ({ service, parseDateTime, serviceStatusColorSwitch }) => {
    // UI translations for the component
    const t = useTranslations('AccountPage.SubscriptionsPage.ServicesComponent');

    const [isServiceDetailsVisible, setIsServiceDetailsVisible] = useState(false);
    const [isHomieVisible, setIsHomieVisible] = useState(false);

    return (
        <div style={{ position: 'relative' }}>
            <StyledCancelledServiceCard>
                <div
                    className='serviceData'
                    style={{
                        gridArea: 'serviceData',
                    }}
                >
                    <div
                        className={`
                            w-full
                            flex
                            serviceData__service
                        `}
                    >
                        <img
                            style={{
                                height: '24px',
                                width: 'auto',
                            }}
                            src={service.service_icon_image}
                        />
                        <div>{t(`services.servicesNames.${service.type}`)}</div>
                        <div>
                            {t(`services.frequency.${service.frequency}`)}, {t(`services.weekDays.${service.frequent_mission_day}`)} {t(`services.time_at`)}{' '}
                            {`${service.frequent_mission_time}:00`}
                        </div>
                    </div>
                </div>
                <div
                    className='serviceEdit'
                    style={{
                        gridArea: 'serviceEdit',
                    }}
                ></div>
                <div
                    className='serviceStatus'
                    style={{
                        gridArea: 'serviceStatus',
                        color: serviceStatusColorSwitch(service.status),
                    }}
                >
                    <span style={{ marginRight: '8px' }}>●</span>
                    {t(`services.statuses.${service.status}`)}
                </div>
                <div
                    className='serviceCancel'
                    style={{
                        gridArea: 'serviceCancel',
                    }}
                ></div>
            </StyledCancelledServiceCard>
        </div>
    );
};

export default CancelledServiceCard;
