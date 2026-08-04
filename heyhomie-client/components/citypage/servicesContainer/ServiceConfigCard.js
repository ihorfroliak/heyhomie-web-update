import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { animated, useSpring } from 'react-spring';

// eslint-disable-next-line no-unused-vars
import { keyframes } from 'styled-components';
import tw, { css, styled } from 'twin.macro';
import { _decrementTotalOrderPrice, _removeService, _setServiceDeleted, _toggleServiceConfigCardExpanded } from '../../../lib/slices/orderSlice';
import { _pushToOverlayActionStack, _toggleMenu } from '../../../lib/slices/uiSlice';
import ServiceConfigEditor from './ServiceConfigEditor';

const StyledServiceConfigCard = styled(animated.div)`
    ${tw`shadow-surface1 rounded-md bg-whiteStandard mx-4 mb-2 md:mx-8 lg:m-2 px-6 py-5`}

    width: 500px;

    @media (min-width: 768px) {
        width: 680px;
    }

    @media (min-width: 1224px) {
        width: 880px;
    }

    transition: 0.6s ease-in-out;
    ${properties =>
        properties.expanded
            ? css`
                  max-height: 3000px;
              `
            : css`
                  max-height: 52px;
              `};
`;

const StyledExpandedDiv = styled(animated.div)`
    transition: 0.2s ease-in-out;
    animation: ${properties => (properties.expanded ? 'expand .3s linear forwards' : 'collapse .3s linear forwards')};

    @keyframes collapse {
        0% {
            opacity: 1;
            visibility: visible;
            transform: translateY(1);
        }
        99% {
            visibility: visible;
            opacity: 0;
            transform: translateY(0);
        }
        100% {
            visibility: hidden;
            opacity: 0;
            transform: translateY(0);
        }
    }
    @keyframes expand {
        0% {
            visibility: hidden;
            opacity: 0;
            transform: translateY(0);
        }
        99% {
            visibility: visible;
            opacity: 0;
            transform: translateY(0);
        }
        100% {
            visibility: visible;
            transform: translateY(1);
            opacity: 1;
        }
    }
`;

const ServiceConfigCard = ({ service }) => {
    const timeoutReference = useRef(null);

    const t = useTranslations('CityPage.ServiceGeneral');

    const dispatch = useDispatch();
    const { order } = useSelector(state => state);

    const spring = useSpring({
        from: { transform: 'translate3d(0,-40px,0)', opacity: '0' },
        to: { transform: 'translate3d(0,0px,0)', opacity: '1' },
    });

    const deleteSpring = useSpring({
        transform: service.isDeleted ? 'translate(300px) scaleY(0.6)' : 'translate(0px) scaleY(1)',
        opacity: service.isDeleted ? '0.01' : '1',
    });

    useEffect(() => {
        if (service.isDeleted) {
            timeoutReference.current = setTimeout(() => dispatch(_removeService(service.homie_service_id)), 500);
        }
    }, [service]);

    useEffect(() => () => clearTimeout(timeoutReference.current), []);

    return (
        <animated.div style={{ ...spring }} className={`w-full flex flex-row justify-center items-center relative overflow-hidden`}>
            <StyledServiceConfigCard expanded={service.cardExpanded}>
                <animated.div style={deleteSpring}>
                    <div className='flex flex-row items-center relative mb-6'>
                        <div>
                            <img width='20px' height='20px' draggable={false} src={service.icon_image} />
                        </div>
                        <div className={`font-bold ml-4 text-14px `} style={{ userSelect: 'none' }}>
                            {t(`${service.type}.name`)}
                            <span className={`hidden md:inline-block ml-4 text-12px text-primary-grey`}>{t(`${service.type}.opening_hours`)}</span>
                            <span className={`md:hidden ml-4 text-12px text-primary-grey`}>{t(`${service.type}.opening_hours_short`)}</span>
                        </div>
                        <button
                            className={`
                            absolute right-12
                            h-6 w-6
                            flex flex-row items-center justify-center
                            bg-transparent
                            rounded-full
                            focus:outline-none
                            opacity-30
                            hover:opacity-100 transition-opacity duration-300
                        `}
                            onClick={() => {
                                if (service.statusLocal === 'staging') {
                                    dispatch(_decrementTotalOrderPrice({ homie_service_id: service.homie_service_id }));

                                    dispatch(
                                        _setServiceDeleted({
                                            homie_service_id: service.homie_service_id,
                                        })
                                    );
                                } else {
                                    dispatch(_toggleMenu({ menu: `is${service.type}ConfirmDeleteModalOpen`, isOpen: true }));
                                    dispatch(_pushToOverlayActionStack(`is${service.type}ConfirmDeleteModalOpen`));
                                }
                            }}
                        >
                            <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                <g>
                                    <path
                                        d='M20.8668 4.73511H3.13334C2.96537 4.73511 2.80427 4.79398 2.6855 4.89879C2.56673 5.00359 2.5 5.14573 2.5 5.29394C2.5 5.44215 2.56673 5.58429 2.6855 5.68909C2.80427 5.79389 2.96537 5.85277 3.13334 5.85277H5.03335V18.7059C5.03335 19.0728 5.11526 19.4361 5.2744 19.7751C5.43354 20.1142 5.6668 20.4222 5.96085 20.6816C6.25491 20.9411 6.604 21.1469 6.9882 21.2873C7.3724 21.4277 7.78418 21.5 8.20004 21.5H15.8001C16.2159 21.5 16.6277 21.4277 17.0119 21.2873C17.3961 21.1469 17.7452 20.9411 18.0393 20.6816C18.3333 20.4222 18.5666 20.1142 18.7257 19.7751C18.8849 19.4361 18.9668 19.0728 18.9668 18.7059V5.85277H20.8668C21.0348 5.85277 21.1959 5.79389 21.3146 5.68909C21.4334 5.58429 21.5001 5.44215 21.5001 5.29394C21.5001 5.14573 21.4334 5.00359 21.3146 4.89879C21.1959 4.79398 21.0348 4.73511 20.8668 4.73511ZM17.7001 18.7059C17.7001 19.1505 17.4999 19.5769 17.1436 19.8913C16.7873 20.2057 16.304 20.3824 15.8001 20.3824H8.20004C7.69612 20.3824 7.21285 20.2057 6.85653 19.8913C6.5002 19.5769 6.30003 19.1505 6.30003 18.7059V5.85277H17.7001V18.7059Z'
                                        fill='#B31E50'
                                        stroke='#B31E50'
                                        strokeWidth='0.5'
                                    />
                                    <path
                                        d='M9.46244 3.61766H14.5291C14.6971 3.61766 14.8582 3.55878 14.977 3.45398C15.0958 3.34918 15.1625 3.20704 15.1625 3.05883C15.1625 2.91062 15.0958 2.76848 14.977 2.66368C14.8582 2.55888 14.6971 2.5 14.5291 2.5H9.46244C9.29447 2.5 9.13338 2.55888 9.0146 2.66368C8.89583 2.76848 8.8291 2.91062 8.8291 3.05883C8.8291 3.20704 8.89583 3.34918 9.0146 3.45398C9.13338 3.55878 9.29447 3.61766 9.46244 3.61766Z'
                                        fill='#B31E50'
                                        stroke='#B31E50'
                                        strokeWidth='0.5'
                                    />
                                    <path
                                        d='M10.0953 17.0292C10.2632 17.0292 10.4243 16.9703 10.5431 16.8655C10.6619 16.7607 10.7286 16.6186 10.7286 16.4704V9.7644C10.7286 9.61619 10.6619 9.47404 10.5431 9.36924C10.4243 9.26444 10.2632 9.20557 10.0953 9.20557C9.92728 9.20557 9.76619 9.26444 9.64741 9.36924C9.52864 9.47404 9.46191 9.61619 9.46191 9.7644V16.4704C9.46191 16.6186 9.52864 16.7607 9.64741 16.8655C9.76619 16.9703 9.92728 17.0292 10.0953 17.0292Z'
                                        fill='#B31E50'
                                        stroke='#B31E50'
                                        strokeWidth='0.5'
                                    />
                                    <path
                                        d='M13.899 17.0292C14.0669 17.0292 14.228 16.9703 14.3468 16.8655C14.4656 16.7607 14.5323 16.6186 14.5323 16.4704V9.7644C14.5323 9.61619 14.4656 9.47404 14.3468 9.36924C14.228 9.26444 14.0669 9.20557 13.899 9.20557C13.731 9.20557 13.5699 9.26444 13.4511 9.36924C13.3324 9.47404 13.2656 9.61619 13.2656 9.7644V16.4704C13.2656 16.6186 13.3324 16.7607 13.4511 16.8655C13.5699 16.9703 13.731 17.0292 13.899 17.0292Z'
                                        fill='#B31E50'
                                        stroke='#B31E50'
                                        strokeWidth='0.5'
                                    />
                                </g>
                            </svg>
                        </button>
                        <button
                            className={`
                            absolute right-3
                            h-6
                            w-6
                            flex flex-row items-center justify-center
                            bg-transparent
                            rounded-full
                            focus:outline-none
                        `}
                            onClick={() => {
                                if (service.cardExpanded) {
                                    dispatch(
                                        _toggleServiceConfigCardExpanded({
                                            homie_service_id: service.homie_service_id,
                                            expanded: false,
                                        })
                                    );
                                } else {
                                    // eslint-disable-next-line no-unused-expressions
                                    order &&
                                        order.services &&
                                        order.services.length > 0 &&
                                        order.services.forEach(orderService => {
                                            dispatch(
                                                _toggleServiceConfigCardExpanded({
                                                    homie_service_id: orderService.homie_service_id,
                                                    expanded: false,
                                                })
                                            );
                                        });

                                    dispatch(
                                        _toggleServiceConfigCardExpanded({
                                            homie_service_id: service.homie_service_id,
                                            expanded: !service.cardExpanded,
                                        })
                                    );
                                }
                            }}
                        >
                            <svg
                                style={{
                                    transform: service.cardExpanded ? 'rotate(180deg)' : '',
                                }}
                                width='16'
                                height='9'
                                viewBox='0 0 16 9'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <path
                                    fillRule='evenodd'
                                    clipRule='evenodd'
                                    d='M8.69461 8.69461L15.7126 1.7006C16.0958 1.29341 16.0958 0.670659 15.7126 0.287425C15.3293 -0.0958084 14.6826 -0.0958084 14.2994 0.287425L8 6.58683L1.7006 0.287425C1.29341 -0.0958084 0.670659 -0.0958084 0.287425 0.287425C-0.0958084 0.670659 -0.0958084 1.29341 0.287425 1.7006L7.28144 8.69461C7.68862 9.07784 8.31138 9.07784 8.69461 8.69461Z'
                                    fill='#141338'
                                />
                            </svg>
                        </button>
                    </div>
                </animated.div>
                {/* <hr
                    style={{
                        position: 'relative',
                        left: '-2rem',
                        width: 'calc(100% + 4rem)',
                        color: 'transparent',
                        marginTop: '1rem',
                        marginBottom: '1rem',
                        height: '.0001px',
                        boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.05)',
                    }}
                /> */}
                <StyledExpandedDiv
                    expanded={service.cardExpanded}
                    // style={{...expansionSpring}}
                >
                    <ServiceConfigEditor service={service} />
                </StyledExpandedDiv>
            </StyledServiceConfigCard>
        </animated.div>
    );
};

export default ServiceConfigCard;
