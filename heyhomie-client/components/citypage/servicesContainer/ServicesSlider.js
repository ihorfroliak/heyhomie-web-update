import { useState, useEffect } from 'react';

import tw, { styled, theme } from 'twin.macro';

import { useTranslations } from 'next-intl';

import { useKeenSlider } from 'keen-slider/react';

import { useDispatch, useSelector } from 'react-redux';
import useWindowSize from '../../../hooks/useWindowResize';

import { initOrderSession, initService, _closeAllServiceConfigCards } from '../../../lib/slices/orderSlice';

import ServiceCard from './ServiceCard';
import { SecondaryButtonFull, SecondaryButtonFullFixed } from '../../ui/Buttons';
import { initialConfigSwitch } from '../../../api/servicesConfig';

import Arrow from './widgets/Arrow';

const StyledServiceSliderContainer = styled.div`
    ${tw`
        w-full
        flex flex-col justify-end
    `};
    transition: ease-in-out 0.6s;
    margin-top: 100px;

    @media (min-width: 640px) {
        margin-top: 170px;
    }
`;

const HeaderContainer = styled.div`
    position: relative;

    height: 280px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    padding-top: 10px;

    div {
        width: fit-content;
    }

    .serviceHeaderCopyDiv {
        color: ${theme`colors.primary.dark`};
        font-family: 'Quicksand';

        animation: fadeIn 0.8s forwards;

        font-size: 18px;
        width: 180px;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    h1 {
        white-space: pre-line;

        text-align: justify;

        width: fit-content;

        line-height: 100%;

        font-weight: bold;
        font-family: 'Quicksand';
        text-transform: uppercase;
        color: ${theme`colors.primary.dark`};

        font-size: 32px;

        animation: fadeIn 0.8s forwards;
    }
    h2 {
        font-weight: 500;
        font-family: 'Quicksand';

        font-size: 15px;

        animation: fadeIn 0.8s forwards;
    }
    h3 {
        font-weight: 300;
        font-family: 'Quicksand';

        font-size: 15px;

        animation: fadeIn 0.8s forwards;
    }

    #bookNowButton {
        display: none;
    }

    @media (min-width: 769px) {
        display: block;
        height: 450px;

        padding-left: 18vw;

        #bookNowButton {
            display: inline-block;
        }
        #bookNowButtonFixed {
            display: none;
        }
    }

    @media (min-width: 1024px) {
        .serviceHeaderCopyDiv {
            font-size: 44px;
            line-height: 46px;
            width: 364px;
        }
        h1 {
            font-size: 74px;
        }
        h2 {
            font-size: 30px;
        }
        h3 {
            font-size: 38px;
            line-height: 46px;
        }

        & > svg {
            transform: scale(2) translateY(-40px);
        }
    }
    @media (min-width: 1344px) {
        .serviceHeaderCopyDiv {
            width: 450px;
        }
    }
`;

const ServicesSlider = ({
    handleChangeBackgroundImg,
    handleSetDefaultImageCopy,
    handleResetBackgroundImg,
    services,
    servicesConfigContainerRef,
    currentHeaderCopy,
}) => {
    const { order, user } = useSelector(state => state);

    const dispatch = useDispatch();

    const t = useTranslations('CityPage');

    const cleaning_service = services.find(service => service.name === 'cleaning');

    const isServer = typeof window === 'undefined';

    const windowSize = isServer ? { height: '', width: '' } : useWindowSize();

    const cardsLength = services && services.length * 166;

    // Offset left
    const [initialOffsetLeft, setInitialOffsetLeft] = useState();
    const [enableDragging, setEnableDragging] = useState(false);

    const [isDragging, setIsDragging] = useState(false);

    const [isBookNowButtonVisible, setIsBookNowButtonVisible] = useState(true);

    const findOffsetLeft = windowSize => {
        return (windowSize - cardsLength) / 2;
    };

    const updateSliderProperties = windowSize => {
        setInitialOffsetLeft(windowSize >= 926 ? findOffsetLeft(windowSize) / windowSize : 48 / windowSize);

        setEnableDragging(windowSize <= cardsLength + 48);
    };

    useEffect(() => {
        updateSliderProperties(windowSize.width);
    }, [services]);

    useEffect(() => {
        setIsBookNowButtonVisible(!order.services.length > 0);
    }, [order.services]);

    //! Keen-slider
    // eslint-disable-next-line no-unused-vars
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loaded, setLoaded] = useState(false);

    const [keenSliderReference, instanceReference] = useKeenSlider({
        mode: 'free-snap',
        drag: enableDragging,
        slides: {
            perView: 'auto',
            spacing: 16,
            origin: initialOffsetLeft,
            number: services.length,
        },
        updated: options => {
            updateSliderProperties(options.size + 5);
        },
        optionsChanged: options => {
            updateSliderProperties(options.size + 5);
        },
        dragStarted: () => {
            setIsDragging(true);
        },
        dragEnded: () => {
            setIsDragging(false);
        },
        slideChanged(slider) {
            setCurrentSlide(slider.track.details.rel);
        },
        created() {
            setLoaded(true);
        },
    });

    const handleClickBookNow = async () => {
        const isCleaningServiceExistInOrder = order.services.find(s => s.homie_service_id === cleaning_service.id);

        if (cleaning_service.open && !isCleaningServiceExistInOrder) {
            try {
                if (order && (!order.id || Math.round(Date.now() / 1000) >= order.expires_at)) {
                    await dispatch(initOrderSession());
                }

                const { config, address, date_time: dateTime } = initialConfigSwitch(cleaning_service.name);

                const serviceToInit = {
                    city_id: cleaning_service.city_id,
                    homie_service_id: cleaning_service.id,
                    type: cleaning_service.name,
                    icon_image: cleaning_service.icon_image,
                    statusLocal: 'staging',
                    cardExpanded: true,
                    available_params: {
                        opening_days: cleaning_service.opening_days,
                        opening_hour: cleaning_service.opening_hour,
                        closing_hour: cleaning_service.closing_hour,
                        minimum_bookable_hour: cleaning_service.minimum_bookable_hour,
                    },
                    config,
                    address,
                    date_time: dateTime,
                };

                dispatch(_closeAllServiceConfigCards());

                dispatch(initService(serviceToInit));

                handleSetDefaultImageCopy(cleaning_service.header_background_image, cleaning_service.name);

                window &&
                    window.scrollTo({
                        top: servicesConfigContainerRef.current.getBoundingClientRect().top,
                    });
                servicesConfigContainerRef.current && servicesConfigContainerRef.current.scrollIntoView(true);
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <StyledServiceSliderContainer>
            <div
                className={`
                    h-full
                    w-full
                    flex flex-col justify-end
                    z-10
                    mt-4
                `}
            >
                <HeaderContainer>
                    <div>
                        <SecondaryButtonFull
                            id='bookNowButton'
                            style={{
                                height: '48px',
                                width: '100%',
                                marginLeft: 0,
                                marginRight: 0,
                                justifySelf: 'end',
                                zIndex: 100,
                                position: 'relative',
                            }}
                            onClick={handleClickBookNow}
                        >
                            Book now!
                        </SecondaryButtonFull>
                        <SecondaryButtonFullFixed
                            id='bookNowButtonFixed'
                            style={{
                                visibility: isBookNowButtonVisible ? 'visible' : 'hidden',
                            }}
                            onClick={handleClickBookNow}
                        >
                            Book now!
                        </SecondaryButtonFullFixed>
                        <h2>
                            {/* <span style='textDecorationThickness: 2px; textUnderlineOffset: 4px;' class='underline underline-offset-4 '>Call us</span> or <span style='textDecorationThickness: 2px; textUnderlineOffset: 4px;' class='underline underline-offset-4 '>fill the form</span> */}
                            <a style={{ textDecorationThickness: '2px', textUnderlineOffset: '4px' }} className='underline' href='tel:+48530277998'>
                                {t(`ServicesSlider.heading.h4.p1`)}
                            </a>
                            {t(`ServicesSlider.heading.h4.p2`)}
                            <a
                                style={{ textDecorationThickness: '2px', textUnderlineOffset: '4px' }}
                                className='underline'
                                href='https://heyhomie.pl'
                                target='_blank'
                            >
                                {t(`ServicesSlider.heading.h4.p3`)}
                            </a>
                        </h2>
                        {currentHeaderCopy ? (
                            <>
                                <h1 className='sr-only'>
                                    {t(`ServiceGeneral.${currentHeaderCopy}.name`)}{' '}
                                    {t(user && user.selectedCity ? `Layout.cityNames.${user.selectedCity}` : `Layout.cityNames.default`)}
                                </h1>
                                <div
                                    className={`serviceHeaderCopyDiv`}
                                    dangerouslySetInnerHTML={{
                                        __html: t(`ServiceGeneral.${currentHeaderCopy}.headerCopy`),
                                    }}
                                />
                            </>
                        ) : (
                            <>
                                <h1>{t(`ServicesSlider.heading.h1`)}</h1>
                                <h3>{t(`ServicesSlider.heading.h3`)}</h3>
                            </>
                        )}
                    </div>
                    <svg
                        width='22'
                        height='33'
                        viewBox='0 0 22 33'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                        style={{
                            position: 'absolute',
                            bottom: '45%',
                            left: '0px',
                        }}
                    >
                        <path
                            d='M21.1146 28.8248C21.146 29.4784 21.036 30.49 20.5175 31.4237C19.669 32.9956 18.2076 33.4469 16.652 32.5287C15.3477 31.7661 14.3578 30.6456 13.5092 29.4317C10.8379 25.6033 8.33948 21.666 5.30676 18.0866C3.12258 15.5188 0.561266 13.3867 -2.23575 11.5192C-4.78135 9.8384 -7.34266 8.1732 -9.134 5.62093C-9.8254 4.62492 -10.3125 3.59779 -9.76255 2.33722C-9.08686 0.796519 -7.75121 0.142889 -5.67702 0.391891C-2.48717 0.780956 0.341276 2.07265 3.0283 3.72229C10.4137 8.28214 15.9134 14.5539 19.7004 22.2885C20.6275 24.2027 21.1303 26.2725 21.1146 28.8248Z'
                            fill='#FF3C87'
                        />
                    </svg>
                    <svg
                        width='30'
                        height='33'
                        viewBox='0 0 30 33'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                        style={{
                            position: 'absolute',
                            top: '20%',
                            left: '8vw',
                        }}
                    >
                        <path
                            d='M29.3526 8.77938C29.3663 11.784 28.7232 14.5701 26.6705 16.9056C24.8779 18.9405 22.661 20.1014 19.9789 20.4702C17.8441 20.757 15.6683 20.6614 13.5472 21.153C10.0988 21.9452 8.5798 23.5431 8.00506 27.0667C7.84085 28.091 7.60821 29.088 7.184 30.0304C6.65031 31.2049 5.93872 32.1609 4.48818 32.2292C2.99659 32.2975 2.01132 31.4507 1.35447 30.2899C0.314459 28.4461 0.0407725 26.4385 0.382881 24.3216C1.01236 20.4019 2.81869 17.1651 6.03451 14.8433C7.71769 13.6141 9.7156 13.2454 11.823 13.4502C13.8346 13.6551 15.7915 13.5049 17.6662 12.6171C19.1852 11.9069 20.0336 10.7051 20.3894 9.14813C20.7178 7.72776 20.8957 6.28007 21.1831 4.84604C21.402 3.71247 21.5799 2.53793 22.3873 1.62288C23.5368 0.325423 25.4663 0.243479 26.7389 1.41802C28.4768 3.0296 29.339 5.44697 29.3526 8.77938Z'
                            fill='#36F0C7'
                        />
                    </svg>
                    <svg
                        width='11'
                        height='10'
                        viewBox='0 0 11 10'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                        style={{
                            position: 'absolute',
                            top: '28%',
                            left: '16vw',
                        }}
                    >
                        <path
                            d='M5.49296 9.72262C2.86744 9.72262 0.431536 7.54802 0.460709 5.21808C0.489881 2.90226 2.70699 0.727657 5.09913 0.685295C7.783 0.642932 10.1168 2.46452 10.0001 4.66737C9.82508 7.64686 8.04555 9.73674 5.49296 9.72262Z'
                            fill='#14133A'
                        />
                    </svg>
                    <svg
                        width='31'
                        height='24'
                        viewBox='0 0 31 24'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                        style={{
                            position: 'absolute',
                            top: '8%',
                            left: '18vw',
                        }}
                    >
                        <path
                            d='M0.526855 4.35998C0.526855 3.56197 0.650445 2.80523 0.925087 2.07602C1.88634 -0.373051 4.2208 -0.717022 5.81372 1.37432C6.50033 2.26864 7.11827 3.24552 7.68129 4.22239C9.35661 7.08423 11.0045 9.9323 13.4762 12.2163C15.4125 14.0049 17.6371 14.9543 20.2462 15.0093C22.0451 15.0368 23.844 14.9543 25.6154 15.4221C26.8651 15.7523 28.0323 16.1788 28.9798 17.0869C30.7512 18.793 30.5041 20.9531 28.2795 21.9575C25.5468 23.1958 22.6905 23.9525 19.6282 23.4297C14.3276 22.5216 9.53513 20.4578 5.90985 16.3989C2.90251 13.0005 1.06241 8.92791 0.526855 4.35998Z'
                            fill='#FAD668'
                        />
                    </svg>
                </HeaderContainer>
                <div className={'w-full h-32 relative'}>
                    <div ref={keenSliderReference} className={`cursor-grab keen-slider`}>
                        {services.map((service, index) => (
                            <ServiceCard
                                key={service.id}
                                index={index}
                                service={service}
                                handleChangeBackgroundImg={handleChangeBackgroundImg}
                                handleSetDefaultImageCopy={handleSetDefaultImageCopy}
                                handleResetBackgroundImg={handleResetBackgroundImg}
                                isDragging={isDragging}
                                servicesConfigContainerRef={servicesConfigContainerRef}
                            />
                        ))}
                    </div>
                    {loaded && instanceReference.current && enableDragging && (
                        <>
                            <Arrow left={true} onClick={e => e.stopPropagation() || instanceReference.current?.prev()} disabled={currentSlide === 0} />

                            <Arrow
                                onClick={e => e.stopPropagation() || instanceReference.current?.next()}
                                disabled={currentSlide === instanceReference.current.track.details.slides.length - 1}
                            />
                        </>
                    )}
                </div>
            </div>
        </StyledServiceSliderContainer>
    );
};

export default ServicesSlider;
