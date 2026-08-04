import { useTranslations } from 'next-intl';
import React, { useEffect, useRef, useState } from 'react';

import tw, { css, styled, theme } from 'twin.macro';

import HomieDetailsPopup from './HomieDetailsPopup';
import MissionDataDetailsPopup from './MissionDataDetailsPopup';

const StyledPastMissionCard = styled.div`
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
        'missionData missionHomie'
        'missionStatus missionCancel';

    .missionData {
        .missionData__date {
            font-weight: bold;
            font-size: 12px;
            line-height: 14px;
            color: #727189;

            text-transform: capitalize;

            margin-bottom: 8px;
        }

        .missionData__service {
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

    .missionHomie {
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

            .missionHomie__comingSoon {
                color: #727189;

                opacity: 0.3;
            }
        }
    }

    .missionStatus {
        align-self: flex-end;
    }

    .missionCancel {
        align-self: flex-end;

        text-align: right;
    }

    @media (min-width: 768px) {
        min-height: 86px;

        padding-bottom: 20px;

        grid-template-areas: 'missionData missionStatus missionHomie missionCancel';
        grid-template-columns: 2fr 1fr 1fr 0fr;

        .missionData {
            align-self: center;
        }
        .missionHomie {
            height: 100%;
            align-items: center;
            justify-content: flex-start;

            align-self: center;

            padding-left: 8px;

            div {
                height: 100%;
                line-height: 100%;
                width: initial;
                margin-left: 7px;

                display: flex;
                align-items: center;

                .missionHomie__comingSoon {
                    display: inline-block;
                }
            }
        }
        .missionStatus {
            align-self: center;
        }
        .missionCancel {
            align-self: center;
        }
    }
`;

const PastMissionCard = ({ mission, parseDateTime, missionStatusColorSwitch }) => {
    // UI translations for the component
    const t = useTranslations('AccountPage.IndexPage.MissionsComponent');

    const [isMissionDetailsVisible, setIsMissionDetailsVisible] = useState(false);
    const [isHomieVisible, setIsHomieVisible] = useState(false);

    return (
        <div style={{ position: 'relative' }}>
            <MissionDataDetailsPopup
                isOpen={isMissionDetailsVisible}
                setIsOpen={setIsMissionDetailsVisible}
                position={{
                    bottom: '70%',
                    left: '25%',
                    zIndex: 2,
                }}
                mission={mission}
            />
            <HomieDetailsPopup
                isOpen={isHomieVisible}
                setIsOpen={setIsHomieVisible}
                position={{
                    bottom: '70%',
                    right: '5%',
                    zIndex: 2,
                }}
                homie={mission.homie ? mission.homie : ''}
            />
            <StyledPastMissionCard>
                <div
                    className='missionData'
                    style={{
                        gridArea: 'missionData',
                        cursor: 'pointer',
                    }}
                    onMouseEnter={() => setIsMissionDetailsVisible(true)}
                    onClick={() => setIsMissionDetailsVisible(true)}
                    onMouseLeave={() => setIsMissionDetailsVisible(false)}
                >
                    <div
                        className={`
                            w-full
                            missionData__date
                        `}
                    >
                        {parseDateTime(mission.meeting_date)}
                    </div>
                    <div
                        className={`
                            w-full
                            flex
                            missionData__service
                        `}
                    >
                        <img
                            style={{
                                height: '24px',
                                width: 'auto',
                            }}
                            src={mission.service.service_icon_image}
                        />
                        <div>{t(`missions.servicesNames.${mission.homie_service}`)}</div>
                        <div>{t(`missions.frequency.${mission.service.frequency}`)}</div>
                    </div>
                </div>
                <div
                    className='missionHomie'
                    style={{
                        gridArea: 'missionHomie',
                        cursor: mission.homie_name ? 'pointer' : 'default',
                    }}
                    onMouseEnter={() => {
                        if (mission.homie_name) {
                            setIsHomieVisible(true);
                        } else {
                            return;
                        }
                    }}
                    onClick={() => {
                        if (mission.homie_name) {
                            setIsHomieVisible(true);
                        } else {
                            return;
                        }
                    }}
                    onMouseLeave={() => setIsHomieVisible(false)}
                >
                    {mission.homie ? (
                        <img
                            style={{
                                height: '24px',
                                width: '24px',
                            }}
                            src={mission.homie.profile_picture}
                        />
                    ) : (
                        <div></div>
                    )}
                    <div>
                        {mission.homie ? (
                            <span
                                style={{
                                    textDecoration: isHomieVisible ? 'underline' : 'none',
                                    transition: '.2s ease-in-out',
                                }}
                            >
                                {mission.homie.first_name}
                            </span>
                        ) : (
                            <span className='missionHomie__comingSoon'>{` `}</span>
                        )}
                    </div>
                </div>
                <div
                    className='missionStatus'
                    style={{
                        gridArea: 'missionStatus',
                        color: missionStatusColorSwitch(mission.status),
                    }}
                >
                    <span style={{ marginRight: '8px' }}>●</span>
                    {t(`missions.statuses.${mission.status}`)}
                </div>
                <div
                    className='missionCancel'
                    style={{
                        gridArea: 'missionCancel',
                    }}
                ></div>
            </StyledPastMissionCard>
        </div>
    );
};

export default PastMissionCard;
