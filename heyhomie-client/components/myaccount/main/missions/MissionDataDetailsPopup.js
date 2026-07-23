import { useTranslations } from 'next-intl';
import { useState, useEffect, useRef } from 'react';

import tw, { css, styled, theme } from 'twin.macro';
import MissionDataDetailsSwitch from './MissionDataDetailsSwitch';

const StyledMissionDataDetailsPopup = styled.div`
    width: 176px;
    min-height: 140px;

    position: absolute;
    opacity: 0;
    visibility: hidden;

    background: #ffffff;
    box-shadow: 0px 0px 4px 2px rgba(0, 0, 0, 0.04);
    border-radius: 4px;

    ${tw`
            py-8px px-24px
            font-normal
        `}
    color: ${theme`colors.primary.dark`};

    cursor: default;

    ${props =>
        props.isOpen
            ? css`
                  animation: fadeIn forwards linear 0.2s;
              `
            : css`
                  opacity: 0;
                  visibility: hidden;
              `};

    transition: 0.2s ease-in-out;

    @keyframes fadeIn {
        0% {
            opacity: 0;

            visibility: hidden;
        }
        1% {
            opacity: 0;

            visibility: visible;
        }
        100% {
            opacity: 1;

            visibility: visible;
        }
    }

    @keyframes fadeOut {
        0% {
            opacity: 1;

            visibility: hidden;
        }
        99% {
            opacity: 0;

            visibility: hidden;
        }
        100% {
            opacity: 0;

            visibility: hidden;
        }
    }
`;

const MissionDataDetailsPopupContent = styled.div`
    .missionDetails__heading {
        display: flex;
        align-items: center;

        padding-bottom: 16px;

        border-bottom: 1px solid #e2e2eb;

        margin-bottom: 8px;
        div {
            margin-left: 8px;

            font-weight: bold;
            font-size: 18px;
            color: #14133a;
        }
    }
`;

const PriceSectionHeading = styled.div`
    font-size: 10px;
    line-height: 10px;
    color: #14133a;

    text-transform: uppercase;

    margin-bottom: 4px;
`;
const PriceSectionBody = styled.div`
    font-weight: bold;
    font-size: 12px;
    line-height: 14px;
    color: #14133a;

    margin-bottom: 8px;
`;

const MissionDataDetailsPopup = ({ mission, position, isOpen, setIsOpen }) => {
    // UI translations for the component
    const t = useTranslations('AccountPage.IndexPage.MissionsComponent.missions');

    // Ref to track outside clicks/touches
    const node = useRef();

    const handleOutsideClick = event => {
        if (node.current.contains(event.target)) {
            return;
        } else {
            setIsOpen(false);
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
        <StyledMissionDataDetailsPopup
            ref={node}
            isOpen={isOpen}
            style={{ ...position }}
            onMouseLeave={() => setIsOpen(false)}
            onClick={() => setIsOpen(false)}
        >
            {mission ? (
                <MissionDataDetailsPopupContent>
                    <div className='missionDetails__heading'>
                        <img
                            src={mission.service.service_icon_image}
                            style={{
                                height: 24,
                                width: 24,
                            }}
                        />
                        <div>{t(`servicesNames.${mission.homie_service}`)}</div>
                    </div>
                    {mission.price ? (
                        <div>
                            <PriceSectionHeading>{t(`serviceConfigDetails.price`)}</PriceSectionHeading>
                            <PriceSectionBody>{mission.price}&nbsp;zł</PriceSectionBody>
                        </div>
                    ) : null}
                    <MissionDataDetailsSwitch service={mission.service} service_type={mission.homie_service} />
                </MissionDataDetailsPopupContent>
            ) : null}
        </StyledMissionDataDetailsPopup>
    );
};

export default MissionDataDetailsPopup;
