import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import tw, { css, styled, theme } from 'twin.macro';
import { _removeFromOverlayActionStack, _toggleMenu } from '../../../../lib/slices/uiSlice';
import { PrimaryButtonFull, PrimaryButtonOutlined } from '../../../ui/Buttons';

const CancelMissionModalDialogContainer = styled.div`
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

const CancelMissionModalDialogContentContainer = styled.div`
    width: 100%;
    height: 100%;

    h2 {
        font-weight: bold;
        font-size: 28px;
        line-height: 130%;
        /* or 36px */

        text-align: center;

        color: #14133a;
    }

    padding-bottom: 16px;
    padding-top: 24px;
    padding-left: 45px;
    padding-right: 45px;

    @media (min-width: 640px) {
        padding-bottom: 48px;
        padding-top: 48px;
        padding-left: 36px;
        padding-right: 36px;
    }
`;

const CancelMissionModalDialog = ({ missionToCancelId, handleCancelMission, handleClearMissionToCancelAndClose }) => {
    // UI translations for the component
    const t = useTranslations('AccountPage.IndexPage.CancelMissionModalDialog');

    // Redux state
    const { ui } = useSelector(state => state);

    return (
        <CancelMissionModalDialogContainer isOpen={ui.cancelMissionModalDialog}>
            {ui.cancelMissionModalDialog ? (
                <CancelMissionModalDialogContentContainer>
                    <h2>{t(`heading`)}</h2>
                    <div
                        style={{
                            marginTop: '24px',
                            marginBottom: '24px',
                            textAlign: 'center',
                        }}
                    >
                        {t(`para_1`)}
                    </div>
                    <div
                        style={{
                            textAlign: 'center',
                        }}
                    >
                        <p>{t(`para_2`)}</p>
                        <p>{t(`para_3`)}</p>
                    </div>
                    <div
                        className={`
                            flex justify-around flex-wrap
                        `}
                    >
                        <PrimaryButtonOutlined
                            style={{
                                display: 'block',
                                height: '48px',
                                width: '220px',
                                marginTop: '24px',
                                marginLeft: 0,
                                marginRight: 8,
                                marginBottom: 0,
                            }}
                            onClick={() => {
                                handleClearMissionToCancelAndClose();
                            }}
                        >
                            {t(`keepMission_btn`)}
                        </PrimaryButtonOutlined>
                        <PrimaryButtonFull
                            style={{
                                display: 'block',
                                height: '48px',
                                width: '220px',
                                marginTop: '24px',
                                marginLeft: 0,
                                marginRight: 8,
                                marginBottom: 0,
                            }}
                            onClick={() => {
                                handleCancelMission(missionToCancelId);
                            }}
                        >
                            {t(`confirmCancel_btn`)}
                        </PrimaryButtonFull>
                    </div>
                </CancelMissionModalDialogContentContainer>
            ) : null}
        </CancelMissionModalDialogContainer>
    );
};

export default CancelMissionModalDialog;
