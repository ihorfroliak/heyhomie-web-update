import { useTranslations } from 'next-intl';
import React, { useEffect, useRef, useState } from 'react';

import tw, { css, styled, theme } from 'twin.macro';

const StyledActiveServiceCard = styled.div`
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

            display: flex;
            flex-wrap: wrap;
        }

        .serviceData__service {
            .serviceData__service__heading {
                font-weight: bold;
                font-size: 18px;
                line-height: 22px;
                color: #14133a;

                margin-left: 8px;
                margin-right: 8px;
            }
            .serviceData__service__date {
                font-size: 14px;
                line-height: 22px;
                color: #727189;
            }
        }
    }

    .serviceEdit {
        align-self: flex-end;

        text-align: right;

        height: 100%;

        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        justify-content: flex-end;
        gap: 0.5rem;

        button {
            display: block;

            font-weight: bold;
            font-size: 16px;
            color: #14133a;

            outline: none;
        }
    }

    .serviceStatus {
        align-self: flex-end;
    }
    .serviceStatus::before {
    }

    .serviceCancel {
        align-self: flex-end;

        text-align: right;

        button {
            font-weight: bold;
            font-size: 16px;
            color: #14133a;

            outline: none;
        }
    }

    @media (min-width: 768px) {
        min-height: 86px;

        padding-bottom: 20px;

        grid-template-areas: 'serviceData serviceStatus serviceEdit serviceCancel';
        grid-template-columns: 2fr 1fr 1fr min-content;

        .serviceData {
            align-self: center;
        }
        .serviceEdit {
            align-self: center;
            align-items: center;
            justify-content: center;

            gap: 1rem;
        }
        .serviceStatus {
            align-self: center;
        }
        .serviceCancel {
            align-self: center;
            margin-left: 1rem;
        }
    }

    @media (min-width: 1039px) {
        .serviceEdit {
            justify-content: flex-end;
        }
    }
`;

const ActiveServiceCard = ({
    service,
    serviceStatusColorSwitch,
    activeServicesLoading,
    cancelledServicesLoading,
    handleSetServiceForCancel,
    handleSetServiceForEdit,
    handleSetServiceForEditComment,
}) => {
    // UI translations for the component
    const t = useTranslations('AccountPage.SubscriptionsPage.ServicesComponent');

    const [isServiceDetailsVisible, setIsServiceDetailsVisible] = useState(false);
    const [isHomieVisible, setIsHomieVisible] = useState(false);

    return (
        <div style={{ position: 'relative' }}>
            <StyledActiveServiceCard>
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
                            flex-wrap
                            serviceData__service
                        `}
                    >
                        <div
                            className={`
                                flex
                            `}
                        >
                            <img
                                style={{
                                    height: '24px',
                                    width: 'auto',
                                }}
                                src={service.service_icon_image}
                            />
                            <div className='serviceData__service__heading'>{t(`services.servicesNames.${service.type}`)}</div>
                        </div>
                        <div className='serviceData__service__date'>
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
                >
                    <button
                        onClick={() => {
                            handleSetServiceForEdit(service);
                        }}
                        disabled={activeServicesLoading || cancelledServicesLoading}
                    >
                        {t(`services.editService_btn`)}
                    </button>
                    <button
                        onClick={() => {
                            handleSetServiceForEditComment(service);
                        }}
                        disabled={activeServicesLoading || cancelledServicesLoading}
                    >
                        {t(`services.editServiceComment_btn`)}
                    </button>
                </div>
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
                >
                    {service.status !== 'canceled' ? (
                        <button
                            onClick={() => {
                                handleSetServiceForCancel(service.id);
                            }}
                            disabled={activeServicesLoading || cancelledServicesLoading}
                        >
                            {t(`services.cancelService_btn`)}
                        </button>
                    ) : null}
                </div>
            </StyledActiveServiceCard>
        </div>
    );
};

export default ActiveServiceCard;
