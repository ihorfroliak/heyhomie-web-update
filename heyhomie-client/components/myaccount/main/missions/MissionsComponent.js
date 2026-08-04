import React, { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/router';

import { useTranslations } from 'next-intl';

import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import tw, { css, styled, theme } from 'twin.macro';

import { listMissions } from '../../../../api/endpoints/missions';

import Spinner from '../../../ui/Spinner';
import { PrimaryButtonFull } from '../../../ui/Buttons';

import PastMissionCard from './PastMissionCard';
import UpcomingMissionCard from './UpcomingMissionCard';

const MissionsContainer = styled.div`
    width: 100%;
`;

const EmptyContainer = styled.div`
    position: relative;
    height: 562px;

    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;

    margin-top: 32px;

    background: #ffffff;
    box-shadow: 0px 0px 14px rgba(0, 0, 0, 0.05);
    border-radius: 8px;

    h2 {
        position: absolute;
        left: 40px;
        top: 40px;

        font-weight: bold;
        font-size: 28px;
        line-height: 34px;

        color: #141338;
    }
`;
const LoadingDiv = styled.div`
    height: 562px;

    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;

    margin-top: 32px;

    background: #ffffff;
    box-shadow: 0px 0px 14px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
`;

const MissionsWrapper = styled.div`
    width: 100%;

    margin-top: 48px;

    h2 {
        font-weight: bold;
        font-size: 28px;
        line-height: 34px;

        color: #141338;
    }

    @media (max-width: 768px) {
        padding-left: 24px;
        padding-right: 24px;
    }
`;
const TabSelection = styled.div`
    width: 100%;
    border-bottom: 1px solid #e2e2eb;

    margin-top: 32px;
    margin-bottom: 24px;
`;
const TabSelectionButton = styled.button`
    min-width: 80px;

    font-weight: bold;
    font-size: 14px;

    border-bottom: 1px solid transparent;
    ${props =>
        props.selected
            ? css`
                  border-bottom: 1px solid #141338;
                  color: #141338;
              `
            : css`
                  color: #727189;
              `}
    &:focus {
        outline: none;
    }

    transition: 0.2s ease-in-out;
`;
const UpcomingMissionsWrapper = styled.div`
    ${props =>
        props.isLoading
            ? css`
                  opacity: 0.5;
              `
            : ``}
`;

const PastMissionsWrapper = styled.div`
    ${props =>
        props.isLoading
            ? css`
                  opacity: 0.5;
              `
            : ``}
`;

const SeeMoreButton = styled.button`
    display: block;
    margin-left: auto;
    margin-right: auto;

    text-decoration: underline;
    font-size: 18px;

    outline: none;
    border: transparent;

    margin-top: 24px;

    &:disabled {
        display: none;
    }
    &:focus {
        outline: none;
    }
`;

// Utils
function missionStatusColorSwitch(status) {
    switch (status) {
        case 'searching_homie': {
            return '#5465FC';
        }
        case 'canceled': {
            return '#B31E50';
        }
        case 'planned': {
            return '#77ECC8';
        }
        case 'homie_found': {
            return '#77ECC8';
        }
        case 'done': {
            return '#77ECC8';
        }
        case 'unpaid': {
            return '#B31E50';
        }
        case 'freezed': {
            return '#B31E50';
        }
        default: {
            return '#141338';
        }
    }
}

const MissionsComponent = ({
    currentVisible,
    setCurrentVisible,
    initialFetchLoading,
    setInitialFetchLoading,
    upcomingMissions,
    setUpcomingMissions,
    upcomingMissionsVisibleNumber,
    setUpcomingMissionsVisibleNumber,
    visibleUpcomingMissions,
    setVisibleUpcomingMissions,
    upcomingMissionsLoading,
    setUpcomingMissionsLoading,
    pastMissions,
    setPastMissions,
    pastMissionsVisibleNumber,
    setPastMissionsVisibleNumber,
    visiblePastMissions,
    setVisiblePastMissions,
    pastMissionsLoading,
    setPastMissionsLoading,
    handleSetMissionForCancel,
    handleSetMissionForEdit,
    handleSetMissionForEditComment,
}) => {
    // UI translations for the component
    const t = useTranslations('AccountPage.IndexPage.MissionsComponent');

    // Redux state
    const dispatch = useDispatch();
    const { user, ui, order } = useSelector(state => state);

    // Redirects
    const router = useRouter();
    const handlePush = url => {
        router.push(url);
    };

    // Utils
    function parseDateTime(date_timeObject) {
        const { locale } = router;
        let month = new Date(date_timeObject * 1000).toLocaleString(locale, { month: 'long' });
        month = month.charAt(0).toUpperCase() + month.slice(1);

        const day = new Date(date_timeObject * 1000).getUTCDate();

        const year = new Date(date_timeObject * 1000).getUTCFullYear();

        const time = new Date(date_timeObject * 1000).getUTCHours();

        const minutes = new Date(date_timeObject * 1000).getUTCMinutes();

        const string = `${month} ${day}, ${year} ${t(`utils.time_at`)} ${time}:${minutes !== 0 ? minutes : '00'}`;
        return string;
    }

    useEffect(() => {
        async function fetchMissions() {
            setInitialFetchLoading(true);
            setUpcomingMissionsLoading(true);
            setPastMissionsLoading(true);

            try {
                const dataUpcoming = await listMissions(user.headers, user.x_token_user, 'upcoming');

                const dataPast = await listMissions(user.headers, user.x_token_user, 'past');

                setUpcomingMissions(upcomingMissions => [...dataUpcoming.missions]);

                setPastMissions(pastMissions => [...dataPast.missions]);

                setInitialFetchLoading(false);
                setUpcomingMissionsLoading(false);
                setPastMissionsLoading(false);
            } catch (err) {
                console.log(err);
                toast.error(t(`error_msg`));

                setInitialFetchLoading(false);
                setUpcomingMissionsLoading(false);
                setPastMissionsLoading(false);
            }
        }

        fetchMissions();
    }, []);

    useEffect(() => {
        let workingArray = [...upcomingMissions];

        workingArray = workingArray.filter((m, i) => i + 1 <= upcomingMissionsVisibleNumber);

        setVisibleUpcomingMissions(visibleUpcomingMissions => [...workingArray]);
    }, [upcomingMissionsVisibleNumber, upcomingMissions]);

    useEffect(() => {
        let workingArray = [...pastMissions];

        workingArray = workingArray.filter((m, i) => i + 1 <= pastMissionsVisibleNumber);

        setVisiblePastMissions(pastUpcomingMissions => [...workingArray]);
    }, [pastMissionsVisibleNumber, pastMissions]);

    return (
        <MissionsContainer>
            {!initialFetchLoading ? (
                upcomingMissions.length === 0 && pastMissions.length === 0 ? (
                    <EmptyContainer>
                        <h2>{t(`heading`)}</h2>
                        <div style={{ width: '100%' }}>
                            <svg
                                style={{
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                }}
                                width='200'
                                height='200'
                                viewBox='0 0 200 200'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <path
                                    d='M66.148 147.39C45.2524 136.282 37.8111 82.899 37.4743 64.206C37.0979 43.337 76.866 18.9938 118.472 23.3735C150.485 26.7433 175.317 44.4325 183.681 65.9037C190.449 83.2768 175.233 108.68 173.431 121.73C168.622 156.537 130.023 124.444 109.885 135.794C93.3995 145.084 87.9936 159.002 66.148 147.39Z'
                                    fill='#77ECC8'
                                />
                                <path
                                    fillRule='evenodd'
                                    clipRule='evenodd'
                                    d='M25.9853 54.6602C24.1472 54.6602 22.6582 56.1493 22.6582 57.9869V171.159C22.6582 172.995 24.1477 174.485 25.9853 174.485H163.495C165.332 174.485 166.821 172.995 166.821 171.159V57.9869C166.821 56.1493 165.333 54.6602 163.495 54.6602H25.9853ZM17.1431 57.9869C17.1431 53.1029 21.1017 49.1451 25.9853 49.1451H163.495C168.379 49.1451 172.337 53.1036 172.337 57.9869V171.159C172.337 176.04 168.379 180.001 163.495 180.001H25.9853C21.1012 180.001 17.1431 176.04 17.1431 171.159V57.9869Z'
                                    fill='#141338'
                                />
                                <path
                                    d='M59.2857 68.6107C59.2857 73.1821 54.4068 76.1672 50.3811 74.0011C44.4578 70.8164 40.4238 64.5591 40.4238 57.378V46.7127C40.4238 36.3615 48.6425 27.7244 58.9927 27.5672C69.5263 27.4055 78.1475 35.9285 78.1475 46.426V51.9022H65.9787V46.5907C65.9787 42.9655 63.1663 39.876 59.5439 39.7378C55.7363 39.5937 52.5927 42.6498 52.5927 46.426V57.378C52.5927 59.8895 53.9825 62.0825 56.0342 63.2265C58.0069 64.3278 59.2857 66.3512 59.2857 68.6107Z'
                                    fill='#141338'
                                />
                                <path
                                    d='M130.03 69.3705C130.03 73.9419 125.151 76.927 121.125 74.7609C115.202 71.5763 111.168 65.319 111.168 58.1379V47.4726C111.168 37.1213 119.387 28.4842 129.736 28.327C140.27 28.1654 148.891 36.6884 148.891 47.1858V52.662H136.722V47.3506C136.722 43.7254 133.91 40.6358 130.288 40.4976C126.48 40.3535 123.336 43.4096 123.336 47.1858V58.1379C123.336 60.6493 124.726 62.8423 126.778 63.9864C128.751 65.0877 130.03 67.111 130.03 69.3705Z'
                                    fill='#141338'
                                />
                                <path
                                    fillRule='evenodd'
                                    clipRule='evenodd'
                                    d='M44.2378 111.246C40.3843 111.246 37.26 114.371 37.26 118.224C37.26 122.077 40.3845 125.201 44.2378 125.201C48.0911 125.201 51.2155 122.077 51.2155 118.224C51.2155 114.371 48.0912 111.246 44.2378 111.246ZM31.7449 118.224C31.7449 111.324 37.3387 105.731 44.2378 105.731C51.1368 105.731 56.7306 111.324 56.7306 118.224C56.7306 125.123 51.1369 130.717 44.2378 130.717C37.3385 130.717 31.7449 125.123 31.7449 118.224Z'
                                    fill='#141338'
                                />
                                <path
                                    fillRule='evenodd'
                                    clipRule='evenodd'
                                    d='M77.7028 111.246C73.8494 111.246 70.7251 114.371 70.7251 118.224C70.7251 122.077 73.8496 125.201 77.7028 125.201C81.5562 125.201 84.6806 122.077 84.6806 118.224C84.6806 114.371 81.5565 111.246 77.7028 111.246ZM65.21 118.224C65.21 111.324 70.8038 105.731 77.7028 105.731C84.6024 105.731 90.1957 111.324 90.1957 118.224C90.1957 125.123 84.602 130.717 77.7028 130.717C70.8036 130.717 65.21 125.123 65.21 118.224Z'
                                    fill='#141338'
                                />
                                <path
                                    fillRule='evenodd'
                                    clipRule='evenodd'
                                    d='M111.168 111.246C107.315 111.246 104.191 114.371 104.191 118.224C104.191 122.077 107.315 125.201 111.168 125.201C115.022 125.201 118.146 122.077 118.146 118.224C118.146 114.371 115.022 111.246 111.168 111.246ZM98.6758 118.224C98.6758 111.324 104.269 105.731 111.168 105.731C118.067 105.731 123.661 111.324 123.661 118.224C123.661 125.123 118.067 130.717 111.168 130.717C104.269 130.717 98.6758 125.123 98.6758 118.224Z'
                                    fill='#141338'
                                />
                                <path
                                    fillRule='evenodd'
                                    clipRule='evenodd'
                                    d='M144.633 111.246C140.779 111.246 137.655 114.371 137.655 118.224C137.655 122.077 140.779 125.201 144.633 125.201C148.485 125.201 151.61 122.077 151.61 118.224C151.61 114.371 148.486 111.246 144.633 111.246ZM132.14 118.224C132.14 111.324 137.733 105.731 144.633 105.731C151.531 105.731 157.125 111.324 157.125 118.224C157.125 125.123 151.531 130.717 144.633 130.717C137.733 130.717 132.14 125.123 132.14 118.224Z'
                                    fill='#141338'
                                />
                                <path
                                    fillRule='evenodd'
                                    clipRule='evenodd'
                                    d='M44.2378 144.712C40.3843 144.712 37.26 147.836 37.26 151.689C37.26 155.543 40.3845 158.667 44.2378 158.667C48.091 158.667 51.2155 155.543 51.2155 151.689C51.2155 147.836 48.0912 144.712 44.2378 144.712ZM31.7449 151.689C31.7449 144.79 37.3387 139.197 44.2378 139.197C51.1368 139.197 56.7306 144.79 56.7306 151.689C56.7306 158.589 51.137 164.182 44.2378 164.182C37.3385 164.182 31.7449 158.589 31.7449 151.689Z'
                                    fill='#141338'
                                />
                                <path
                                    fillRule='evenodd'
                                    clipRule='evenodd'
                                    d='M77.7028 144.712C73.8494 144.712 70.7251 147.836 70.7251 151.689C70.7251 155.543 73.8496 158.667 77.7028 158.667C81.5561 158.667 84.6806 155.543 84.6806 151.689C84.6806 147.836 81.5565 144.712 77.7028 144.712ZM65.21 151.689C65.21 144.79 70.8038 139.197 77.7028 139.197C84.6024 139.197 90.1957 144.79 90.1957 151.689C90.1957 158.589 84.6021 164.182 77.7028 164.182C70.8036 164.182 65.21 158.589 65.21 151.689Z'
                                    fill='#141338'
                                />
                                <path
                                    fillRule='evenodd'
                                    clipRule='evenodd'
                                    d='M111.168 144.712C107.315 144.712 104.191 147.836 104.191 151.689C104.191 155.543 107.315 158.667 111.168 158.667C115.022 158.667 118.146 155.543 118.146 151.689C118.146 147.836 115.022 144.712 111.168 144.712ZM98.6758 151.689C98.6758 144.79 104.269 139.197 111.168 139.197C118.067 139.197 123.661 144.79 123.661 151.689C123.661 158.589 118.068 164.182 111.168 164.182C104.269 164.182 98.6758 158.589 98.6758 151.689Z'
                                    fill='#141338'
                                />
                                <path
                                    d='M156.657 151.795C156.657 158.495 151.224 163.927 144.525 163.927C137.825 163.927 132.393 158.494 132.393 151.795C132.393 145.096 137.825 139.663 144.525 139.663C151.224 139.663 156.657 145.096 156.657 151.795Z'
                                    fill='#141338'
                                />
                                <path fillRule='evenodd' clipRule='evenodd' d='M167.916 90.088H19.9014V84.5729H167.916V90.088Z' fill='#141338' />
                            </svg>
                        </div>
                        <PrimaryButtonFull
                            style={{
                                display: 'block',
                                height: '48px',
                                width: '220px',
                                marginTop: '34px',
                            }}
                            onClick={() => {
                                handlePush('/');
                            }}
                        >
                            {t(`createABooking_btn`)}
                        </PrimaryButtonFull>
                    </EmptyContainer>
                ) : (
                    <MissionsWrapper>
                        <h2>{t(`heading`)}</h2>
                        <TabSelection>
                            <TabSelectionButton
                                onClick={() => {
                                    setCurrentVisible('upcoming');
                                }}
                                disabled={currentVisible === 'upcoming'}
                                selected={currentVisible === 'upcoming'}
                            >
                                {t(`upcoming_tabBtn`)}
                            </TabSelectionButton>
                            <TabSelectionButton
                                onClick={() => {
                                    setCurrentVisible('past');
                                }}
                                disabled={currentVisible === 'past'}
                                selected={currentVisible === 'past'}
                            >
                                {t(`past_tabBtn`)}
                            </TabSelectionButton>
                        </TabSelection>
                        {currentVisible === 'upcoming' ? (
                            upcomingMissions.length > 0 ? (
                                <UpcomingMissionsWrapper isLoading={upcomingMissionsLoading || pastMissionsLoading}>
                                    {visibleUpcomingMissions.length > 0 &&
                                        visibleUpcomingMissions.map(mission => (
                                            <UpcomingMissionCard
                                                key={mission.id}
                                                mission={mission}
                                                parseDateTime={parseDateTime}
                                                missionStatusColorSwitch={missionStatusColorSwitch}
                                                upcomingMissionsLoading={upcomingMissionsLoading}
                                                pastMissionsLoading={pastMissionsLoading}
                                                handleSetMissionForCancel={handleSetMissionForCancel}
                                                handleSetMissionForEdit={handleSetMissionForEdit}
                                                handleSetMissionForEditComment={handleSetMissionForEditComment}
                                            />
                                        ))}
                                    <SeeMoreButton
                                        onClick={() => {
                                            setUpcomingMissionsVisibleNumber(upcomingMissionsVisibleNumber => upcomingMissionsVisibleNumber + 4);
                                        }}
                                        disabled={upcomingMissionsVisibleNumber >= upcomingMissions.length}
                                    >
                                        {t(`seeMore_btn`)}
                                    </SeeMoreButton>
                                </UpcomingMissionsWrapper>
                            ) : (
                                <EmptyContainer>
                                    <h2>{t(`heading`)}</h2>
                                    <div style={{ width: '100%' }}>
                                        <svg
                                            style={{
                                                marginLeft: 'auto',
                                                marginRight: 'auto',
                                            }}
                                            width='200'
                                            height='200'
                                            viewBox='0 0 200 200'
                                            fill='none'
                                            xmlns='http://www.w3.org/2000/svg'
                                        >
                                            <path
                                                d='M66.148 147.39C45.2524 136.282 37.8111 82.899 37.4743 64.206C37.0979 43.337 76.866 18.9938 118.472 23.3735C150.485 26.7433 175.317 44.4325 183.681 65.9037C190.449 83.2768 175.233 108.68 173.431 121.73C168.622 156.537 130.023 124.444 109.885 135.794C93.3995 145.084 87.9936 159.002 66.148 147.39Z'
                                                fill='#77ECC8'
                                            />
                                            <path
                                                fillRule='evenodd'
                                                clipRule='evenodd'
                                                d='M25.9853 54.6602C24.1472 54.6602 22.6582 56.1493 22.6582 57.9869V171.159C22.6582 172.995 24.1477 174.485 25.9853 174.485H163.495C165.332 174.485 166.821 172.995 166.821 171.159V57.9869C166.821 56.1493 165.333 54.6602 163.495 54.6602H25.9853ZM17.1431 57.9869C17.1431 53.1029 21.1017 49.1451 25.9853 49.1451H163.495C168.379 49.1451 172.337 53.1036 172.337 57.9869V171.159C172.337 176.04 168.379 180.001 163.495 180.001H25.9853C21.1012 180.001 17.1431 176.04 17.1431 171.159V57.9869Z'
                                                fill='#141338'
                                            />
                                            <path
                                                d='M59.2857 68.6107C59.2857 73.1821 54.4068 76.1672 50.3811 74.0011C44.4578 70.8164 40.4238 64.5591 40.4238 57.378V46.7127C40.4238 36.3615 48.6425 27.7244 58.9927 27.5672C69.5263 27.4055 78.1475 35.9285 78.1475 46.426V51.9022H65.9787V46.5907C65.9787 42.9655 63.1663 39.876 59.5439 39.7378C55.7363 39.5937 52.5927 42.6498 52.5927 46.426V57.378C52.5927 59.8895 53.9825 62.0825 56.0342 63.2265C58.0069 64.3278 59.2857 66.3512 59.2857 68.6107Z'
                                                fill='#141338'
                                            />
                                            <path
                                                d='M130.03 69.3705C130.03 73.9419 125.151 76.927 121.125 74.7609C115.202 71.5763 111.168 65.319 111.168 58.1379V47.4726C111.168 37.1213 119.387 28.4842 129.736 28.327C140.27 28.1654 148.891 36.6884 148.891 47.1858V52.662H136.722V47.3506C136.722 43.7254 133.91 40.6358 130.288 40.4976C126.48 40.3535 123.336 43.4096 123.336 47.1858V58.1379C123.336 60.6493 124.726 62.8423 126.778 63.9864C128.751 65.0877 130.03 67.111 130.03 69.3705Z'
                                                fill='#141338'
                                            />
                                            <path
                                                fillRule='evenodd'
                                                clipRule='evenodd'
                                                d='M44.2378 111.246C40.3843 111.246 37.26 114.371 37.26 118.224C37.26 122.077 40.3845 125.201 44.2378 125.201C48.0911 125.201 51.2155 122.077 51.2155 118.224C51.2155 114.371 48.0912 111.246 44.2378 111.246ZM31.7449 118.224C31.7449 111.324 37.3387 105.731 44.2378 105.731C51.1368 105.731 56.7306 111.324 56.7306 118.224C56.7306 125.123 51.1369 130.717 44.2378 130.717C37.3385 130.717 31.7449 125.123 31.7449 118.224Z'
                                                fill='#141338'
                                            />
                                            <path
                                                fillRule='evenodd'
                                                clipRule='evenodd'
                                                d='M77.7028 111.246C73.8494 111.246 70.7251 114.371 70.7251 118.224C70.7251 122.077 73.8496 125.201 77.7028 125.201C81.5562 125.201 84.6806 122.077 84.6806 118.224C84.6806 114.371 81.5565 111.246 77.7028 111.246ZM65.21 118.224C65.21 111.324 70.8038 105.731 77.7028 105.731C84.6024 105.731 90.1957 111.324 90.1957 118.224C90.1957 125.123 84.602 130.717 77.7028 130.717C70.8036 130.717 65.21 125.123 65.21 118.224Z'
                                                fill='#141338'
                                            />
                                            <path
                                                fillRule='evenodd'
                                                clipRule='evenodd'
                                                d='M111.168 111.246C107.315 111.246 104.191 114.371 104.191 118.224C104.191 122.077 107.315 125.201 111.168 125.201C115.022 125.201 118.146 122.077 118.146 118.224C118.146 114.371 115.022 111.246 111.168 111.246ZM98.6758 118.224C98.6758 111.324 104.269 105.731 111.168 105.731C118.067 105.731 123.661 111.324 123.661 118.224C123.661 125.123 118.067 130.717 111.168 130.717C104.269 130.717 98.6758 125.123 98.6758 118.224Z'
                                                fill='#141338'
                                            />
                                            <path
                                                fillRule='evenodd'
                                                clipRule='evenodd'
                                                d='M144.633 111.246C140.779 111.246 137.655 114.371 137.655 118.224C137.655 122.077 140.779 125.201 144.633 125.201C148.485 125.201 151.61 122.077 151.61 118.224C151.61 114.371 148.486 111.246 144.633 111.246ZM132.14 118.224C132.14 111.324 137.733 105.731 144.633 105.731C151.531 105.731 157.125 111.324 157.125 118.224C157.125 125.123 151.531 130.717 144.633 130.717C137.733 130.717 132.14 125.123 132.14 118.224Z'
                                                fill='#141338'
                                            />
                                            <path
                                                fillRule='evenodd'
                                                clipRule='evenodd'
                                                d='M44.2378 144.712C40.3843 144.712 37.26 147.836 37.26 151.689C37.26 155.543 40.3845 158.667 44.2378 158.667C48.091 158.667 51.2155 155.543 51.2155 151.689C51.2155 147.836 48.0912 144.712 44.2378 144.712ZM31.7449 151.689C31.7449 144.79 37.3387 139.197 44.2378 139.197C51.1368 139.197 56.7306 144.79 56.7306 151.689C56.7306 158.589 51.137 164.182 44.2378 164.182C37.3385 164.182 31.7449 158.589 31.7449 151.689Z'
                                                fill='#141338'
                                            />
                                            <path
                                                fillRule='evenodd'
                                                clipRule='evenodd'
                                                d='M77.7028 144.712C73.8494 144.712 70.7251 147.836 70.7251 151.689C70.7251 155.543 73.8496 158.667 77.7028 158.667C81.5561 158.667 84.6806 155.543 84.6806 151.689C84.6806 147.836 81.5565 144.712 77.7028 144.712ZM65.21 151.689C65.21 144.79 70.8038 139.197 77.7028 139.197C84.6024 139.197 90.1957 144.79 90.1957 151.689C90.1957 158.589 84.6021 164.182 77.7028 164.182C70.8036 164.182 65.21 158.589 65.21 151.689Z'
                                                fill='#141338'
                                            />
                                            <path
                                                fillRule='evenodd'
                                                clipRule='evenodd'
                                                d='M111.168 144.712C107.315 144.712 104.191 147.836 104.191 151.689C104.191 155.543 107.315 158.667 111.168 158.667C115.022 158.667 118.146 155.543 118.146 151.689C118.146 147.836 115.022 144.712 111.168 144.712ZM98.6758 151.689C98.6758 144.79 104.269 139.197 111.168 139.197C118.067 139.197 123.661 144.79 123.661 151.689C123.661 158.589 118.068 164.182 111.168 164.182C104.269 164.182 98.6758 158.589 98.6758 151.689Z'
                                                fill='#141338'
                                            />
                                            <path
                                                d='M156.657 151.795C156.657 158.495 151.224 163.927 144.525 163.927C137.825 163.927 132.393 158.494 132.393 151.795C132.393 145.096 137.825 139.663 144.525 139.663C151.224 139.663 156.657 145.096 156.657 151.795Z'
                                                fill='#141338'
                                            />
                                            <path fillRule='evenodd' clipRule='evenodd' d='M167.916 90.088H19.9014V84.5729H167.916V90.088Z' fill='#141338' />
                                        </svg>
                                    </div>
                                    <PrimaryButtonFull
                                        style={{
                                            display: 'block',
                                            height: '48px',
                                            width: '220px',
                                            marginTop: '34px',
                                        }}
                                        onClick={() => {
                                            handlePush('/');
                                        }}
                                    >
                                        {t(`createABooking_btn`)}
                                    </PrimaryButtonFull>
                                </EmptyContainer>
                            )
                        ) : pastMissions.length > 0 ? (
                            <PastMissionsWrapper isLoading={upcomingMissionsLoading || pastMissionsLoading}>
                                {visiblePastMissions.length > 0 &&
                                    visiblePastMissions.map(mission => (
                                        <PastMissionCard
                                            key={mission.id}
                                            mission={mission}
                                            parseDateTime={parseDateTime}
                                            missionStatusColorSwitch={missionStatusColorSwitch}
                                        />
                                    ))}
                                <SeeMoreButton
                                    onClick={() => {
                                        setPastMissionsVisibleNumber(pastMissionsVisibleNumber => pastMissionsVisibleNumber + 4);
                                    }}
                                    disabled={pastMissionsVisibleNumber >= pastMissions.length}
                                >
                                    {t(`seeMore_btn`)}
                                </SeeMoreButton>
                            </PastMissionsWrapper>
                        ) : (
                            <EmptyContainer>
                                <h2>{t(`heading`)}</h2>
                                <div style={{ width: '100%' }}>
                                    <svg
                                        style={{
                                            marginLeft: 'auto',
                                            marginRight: 'auto',
                                        }}
                                        width='200'
                                        height='200'
                                        viewBox='0 0 200 200'
                                        fill='none'
                                        xmlns='http://www.w3.org/2000/svg'
                                    >
                                        <path
                                            d='M66.148 147.39C45.2524 136.282 37.8111 82.899 37.4743 64.206C37.0979 43.337 76.866 18.9938 118.472 23.3735C150.485 26.7433 175.317 44.4325 183.681 65.9037C190.449 83.2768 175.233 108.68 173.431 121.73C168.622 156.537 130.023 124.444 109.885 135.794C93.3995 145.084 87.9936 159.002 66.148 147.39Z'
                                            fill='#77ECC8'
                                        />
                                        <path
                                            fillRule='evenodd'
                                            clipRule='evenodd'
                                            d='M25.9853 54.6602C24.1472 54.6602 22.6582 56.1493 22.6582 57.9869V171.159C22.6582 172.995 24.1477 174.485 25.9853 174.485H163.495C165.332 174.485 166.821 172.995 166.821 171.159V57.9869C166.821 56.1493 165.333 54.6602 163.495 54.6602H25.9853ZM17.1431 57.9869C17.1431 53.1029 21.1017 49.1451 25.9853 49.1451H163.495C168.379 49.1451 172.337 53.1036 172.337 57.9869V171.159C172.337 176.04 168.379 180.001 163.495 180.001H25.9853C21.1012 180.001 17.1431 176.04 17.1431 171.159V57.9869Z'
                                            fill='#141338'
                                        />
                                        <path
                                            d='M59.2857 68.6107C59.2857 73.1821 54.4068 76.1672 50.3811 74.0011C44.4578 70.8164 40.4238 64.5591 40.4238 57.378V46.7127C40.4238 36.3615 48.6425 27.7244 58.9927 27.5672C69.5263 27.4055 78.1475 35.9285 78.1475 46.426V51.9022H65.9787V46.5907C65.9787 42.9655 63.1663 39.876 59.5439 39.7378C55.7363 39.5937 52.5927 42.6498 52.5927 46.426V57.378C52.5927 59.8895 53.9825 62.0825 56.0342 63.2265C58.0069 64.3278 59.2857 66.3512 59.2857 68.6107Z'
                                            fill='#141338'
                                        />
                                        <path
                                            d='M130.03 69.3705C130.03 73.9419 125.151 76.927 121.125 74.7609C115.202 71.5763 111.168 65.319 111.168 58.1379V47.4726C111.168 37.1213 119.387 28.4842 129.736 28.327C140.27 28.1654 148.891 36.6884 148.891 47.1858V52.662H136.722V47.3506C136.722 43.7254 133.91 40.6358 130.288 40.4976C126.48 40.3535 123.336 43.4096 123.336 47.1858V58.1379C123.336 60.6493 124.726 62.8423 126.778 63.9864C128.751 65.0877 130.03 67.111 130.03 69.3705Z'
                                            fill='#141338'
                                        />
                                        <path
                                            fillRule='evenodd'
                                            clipRule='evenodd'
                                            d='M44.2378 111.246C40.3843 111.246 37.26 114.371 37.26 118.224C37.26 122.077 40.3845 125.201 44.2378 125.201C48.0911 125.201 51.2155 122.077 51.2155 118.224C51.2155 114.371 48.0912 111.246 44.2378 111.246ZM31.7449 118.224C31.7449 111.324 37.3387 105.731 44.2378 105.731C51.1368 105.731 56.7306 111.324 56.7306 118.224C56.7306 125.123 51.1369 130.717 44.2378 130.717C37.3385 130.717 31.7449 125.123 31.7449 118.224Z'
                                            fill='#141338'
                                        />
                                        <path
                                            fillRule='evenodd'
                                            clipRule='evenodd'
                                            d='M77.7028 111.246C73.8494 111.246 70.7251 114.371 70.7251 118.224C70.7251 122.077 73.8496 125.201 77.7028 125.201C81.5562 125.201 84.6806 122.077 84.6806 118.224C84.6806 114.371 81.5565 111.246 77.7028 111.246ZM65.21 118.224C65.21 111.324 70.8038 105.731 77.7028 105.731C84.6024 105.731 90.1957 111.324 90.1957 118.224C90.1957 125.123 84.602 130.717 77.7028 130.717C70.8036 130.717 65.21 125.123 65.21 118.224Z'
                                            fill='#141338'
                                        />
                                        <path
                                            fillRule='evenodd'
                                            clipRule='evenodd'
                                            d='M111.168 111.246C107.315 111.246 104.191 114.371 104.191 118.224C104.191 122.077 107.315 125.201 111.168 125.201C115.022 125.201 118.146 122.077 118.146 118.224C118.146 114.371 115.022 111.246 111.168 111.246ZM98.6758 118.224C98.6758 111.324 104.269 105.731 111.168 105.731C118.067 105.731 123.661 111.324 123.661 118.224C123.661 125.123 118.067 130.717 111.168 130.717C104.269 130.717 98.6758 125.123 98.6758 118.224Z'
                                            fill='#141338'
                                        />
                                        <path
                                            fillRule='evenodd'
                                            clipRule='evenodd'
                                            d='M144.633 111.246C140.779 111.246 137.655 114.371 137.655 118.224C137.655 122.077 140.779 125.201 144.633 125.201C148.485 125.201 151.61 122.077 151.61 118.224C151.61 114.371 148.486 111.246 144.633 111.246ZM132.14 118.224C132.14 111.324 137.733 105.731 144.633 105.731C151.531 105.731 157.125 111.324 157.125 118.224C157.125 125.123 151.531 130.717 144.633 130.717C137.733 130.717 132.14 125.123 132.14 118.224Z'
                                            fill='#141338'
                                        />
                                        <path
                                            fillRule='evenodd'
                                            clipRule='evenodd'
                                            d='M44.2378 144.712C40.3843 144.712 37.26 147.836 37.26 151.689C37.26 155.543 40.3845 158.667 44.2378 158.667C48.091 158.667 51.2155 155.543 51.2155 151.689C51.2155 147.836 48.0912 144.712 44.2378 144.712ZM31.7449 151.689C31.7449 144.79 37.3387 139.197 44.2378 139.197C51.1368 139.197 56.7306 144.79 56.7306 151.689C56.7306 158.589 51.137 164.182 44.2378 164.182C37.3385 164.182 31.7449 158.589 31.7449 151.689Z'
                                            fill='#141338'
                                        />
                                        <path
                                            fillRule='evenodd'
                                            clipRule='evenodd'
                                            d='M77.7028 144.712C73.8494 144.712 70.7251 147.836 70.7251 151.689C70.7251 155.543 73.8496 158.667 77.7028 158.667C81.5561 158.667 84.6806 155.543 84.6806 151.689C84.6806 147.836 81.5565 144.712 77.7028 144.712ZM65.21 151.689C65.21 144.79 70.8038 139.197 77.7028 139.197C84.6024 139.197 90.1957 144.79 90.1957 151.689C90.1957 158.589 84.6021 164.182 77.7028 164.182C70.8036 164.182 65.21 158.589 65.21 151.689Z'
                                            fill='#141338'
                                        />
                                        <path
                                            fillRule='evenodd'
                                            clipRule='evenodd'
                                            d='M111.168 144.712C107.315 144.712 104.191 147.836 104.191 151.689C104.191 155.543 107.315 158.667 111.168 158.667C115.022 158.667 118.146 155.543 118.146 151.689C118.146 147.836 115.022 144.712 111.168 144.712ZM98.6758 151.689C98.6758 144.79 104.269 139.197 111.168 139.197C118.067 139.197 123.661 144.79 123.661 151.689C123.661 158.589 118.068 164.182 111.168 164.182C104.269 164.182 98.6758 158.589 98.6758 151.689Z'
                                            fill='#141338'
                                        />
                                        <path
                                            d='M156.657 151.795C156.657 158.495 151.224 163.927 144.525 163.927C137.825 163.927 132.393 158.494 132.393 151.795C132.393 145.096 137.825 139.663 144.525 139.663C151.224 139.663 156.657 145.096 156.657 151.795Z'
                                            fill='#141338'
                                        />
                                        <path fillRule='evenodd' clipRule='evenodd' d='M167.916 90.088H19.9014V84.5729H167.916V90.088Z' fill='#141338' />
                                    </svg>
                                </div>
                                <PrimaryButtonFull
                                    style={{
                                        display: 'block',
                                        height: '48px',
                                        width: '220px',
                                        marginTop: '34px',
                                    }}
                                    onClick={() => {
                                        handlePush('/');
                                    }}
                                >
                                    {t(`createABooking_btn`)}
                                </PrimaryButtonFull>
                            </EmptyContainer>
                        )}
                        <div
                            style={{
                                marginTop: '64px',
                                textAlign: 'center',
                            }}
                        >
                            <strong>{t(`cancellationPolicyHeading`)}</strong> <span>{t(`cancellationPolicySpan`)}</span>
                        </div>
                    </MissionsWrapper>
                )
            ) : (
                <LoadingDiv>
                    <Spinner />
                </LoadingDiv>
            )}
        </MissionsContainer>
    );
};

export default MissionsComponent;
