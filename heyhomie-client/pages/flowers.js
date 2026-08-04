/* eslint-disable no-await-in-loop */
/* eslint-disable no-lonely-if */
/* eslint-disable no-useless-return */
/* eslint-disable dot-notation */
// React & Next methods
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import tw, { css, styled, theme } from 'twin.macro';

// Redux Global State & actions
import { useSelector, useDispatch } from 'react-redux';
import { useTranslations } from 'next-intl';
import { ToastContainer, toast } from 'react-toastify';
import { initCitySession, setHeaders, setSelectedCity } from '../lib/slices/userSlice';
import { ClearAllMenusAndModals, _openOverlayWithAction, _pushToOverlayActionStack, _removeFromOverlayActionStack, _toggleMenu } from '../lib/slices/uiSlice';

// Toasts
import 'react-toastify/dist/ReactToastify.css';

// Translations

// SSR props
import { BASE_URL } from '../api/url';

import Topnav from '../components/utilpages/topnav/Topnav';
import Footer from '../components/utilpages/footer/Footer';
import BookingHeroSection from '../components/serviceLanding/BookingHeroSection';
import StyledModal from '../components/ui/ModalWindow';
import Overlay from '../components/citypage/menus/Overlay';
import { PrimaryButtonOutlined, SecondaryButtonFull } from '../components/ui/Buttons';

import { flowersPictures } from '../components/serviceLanding/flowers/flowersPictures';
import { faqFlowers } from '../components/serviceLanding/flowers/faqFlowers';

import HowItWorksSection from '../components/serviceLanding/HowItWorksSection';
import FAQSection from '../components/serviceLanding/FAQSection';
import useWindowSize from '../hooks/useWindowResize';
import FlowersGallery, { FlowerCard } from '../components/serviceLanding/flowers/FlowersGallery';

const ContentContainer = styled.div`
    min-height: 100vh;
`;

const FlowersDescription = styled.div`
    background-color: #ffffff;
    box-shadow: 0px 0px 14px rgba(0, 0, 0, 0.05);

    padding-left: 24px;
    padding-right: 24px;

    padding-bottom: 64px;

    .flowersDescription__img {
        display: none;
    }

    .flowersDescription__content {
        h1 {
            display: flex;
            justify-content: flex-start;
            align-items: center;

            font-family: 'Manrope';

            margin-bottom: 32px;

            padding-top: 50px;

            img {
                height: 48px;
                margin-right: 1rem;
            }
            span {
                text-transform: uppercase;
                color: #141338;
                font-weight: bold;

                font-size: 32px;
                line-height: 40px;
            }
        }

        div {
            font-size: 14px;
            line-height: 24px;

            p {
                margin-bottom: 1rem;
            }
        }
    }

    @media (min-width: 1024px) {
        display: flex;
        flex-wrap: wrap;

        padding-left: 128px;
        padding-right: 128px;

        .flowersDescription__img {
            margin-top: 80px;
            display: block;
            width: 35%;

            max-height: 500px;

            img {
                height: 100%;
                object-fit: contain;
            }
        }

        .flowersDescription__content {
            width: 65%;

            padding-left: 76px;

            h1 {
                display: flex;
                justify-content: flex-start;
                align-items: center;

                font-family: 'Manrope';

                margin-bottom: 48px;
                margin-top: 80px;

                padding-top: initial;

                img {
                    height: 80px;
                    margin-right: 2rem;
                }
                span {
                    font-size: 48px;
                    line-height: 60px;
                }
            }

            div {
                font-size: 18px;
                line-height: 24px;

                p {
                    margin-bottom: 1rem;
                }
            }
        }
    }
`;

const FlowersGallerySection = styled.div`
    & > h2 {
        text-transform: uppercase;
        font-family: Manrope;
        font-style: normal;
        font-weight: bold;
        text-align: center;

        color: ${theme`colors.primary.dark`};

        font-size: 32px;
        line-height: 40px;

        margin-top: 64px;
        margin-bottom: 58px;

        @media (min-width: 1024px) {
            font-size: 48px;
            line-height: 60px;

            margin-top: 96px;
            margin-bottom: 58px;
        }
    }
`;

function FlowersLandingPage({ cities }) {
    // UI translations for the component
    const t = useTranslations('ServicesLandings.FlowersLanding');

    // Redux state
    const dispatch = useDispatch();
    const { user, ui, order } = useSelector(state => state);

    // Topnav & redirect handlers
    const router = useRouter();
    const changeLocale = lang => {
        // set preffered language here
        router.push(router.pathname, router.asPath, { locale: lang });
    };

    // Local state: cities with the service being available
    const [availableCities, setAvailableCities] = useState(cities && cities.filter(city => city.services.findIndex(s => s.name === 'flowers') !== -1));

    const handleRedirectToCityWithSelectedService = (city, serviceHomieName) => {
        router.push(`/${city}?selectedService=${serviceHomieName}`);
    };

    const handleClickBookNow = () => {
        if (availableCities && availableCities.length === 1) {
            handleRedirectToCityWithSelectedService(availableCities[0].name, 'flowers');
        } else {
            dispatch(_toggleMenu({ menu: `isSelectCityServiceLandingOpen`, isOpen: true }));
            dispatch(_pushToOverlayActionStack(`isSelectCityServiceLandingOpen`));
        }
    };

    // Flowers gallery
    const { width, height } = useWindowSize();
    const flowersGalleryRef = useRef(null);

    const scrollToFlowersGallery = () => {
        flowersGalleryRef.current.scrollIntoView();
    };

    // Block scrolling on open menus/modals
    useEffect(() => {
        if (ui.overlayActionsStack.length > 0) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [ui.overlayActionsStack]);

    useEffect(() => {
        const hash = window && window.location.hash.replace(/^#\/?|\/$/g, '').split('/');

        if (ui.overlayActionsStack.length > 0) {
            if (!hash[0]) {
                router.push(
                    {
                        pathname: window && window.location.pathname,
                        hash: 'menuOpened',
                    },
                    undefined,
                    {
                        shallow: true,
                    }
                );
            } else {
                return;
            }
        } else {
            if (hash[0]) {
                router.push(
                    {
                        pathname: window && window.location.pathname,
                    },
                    undefined,
                    {
                        shallow: true,
                    }
                );
            } else {
                return;
            }
        }
    }, [ui.overlayActionsStack]);

    useEffect(() => {
        const verifyHash = () => {
            const hash = window.location.hash.replace(/^#\/?|\/$/g, '').split('/');
            if (!hash[0] && ui.overlayActionsStack.length > 0) {
                dispatch(ClearAllMenusAndModals());
            } else {
                return;
            }
        };

        verifyHash();
    });

    return (
        <>
            <Head>
                <title>{t(`meta.title`)}</title>
                <meta name='description' content={t(`meta.description`)} />
                <meta property='og:type' content='website' />
                <meta property='og:url' content={`https://www.heyhomie.io/flowers`} />
                <meta property='og:title' content={t(`meta.og_title`)} />
                <meta property='og:description' content={t(`meta.og_description`)} />
            </Head>
            <Topnav handleChangeLanguage={changeLocale} />
            <ContentContainer>
                <BookingHeroSection
                    servicePictureURL={`https://api.heyhomie.io/service_images/bg_flowers.png`}
                    serviceName={t(`serviceName`)}
                    serviceDescription={t(`serviceHeroDescription`)}
                    bookNowText={t(`bookNowText`)}
                    handleClick={handleClickBookNow}
                />
                <FlowersDescription>
                    <div className='flowersDescription__img'>
                        <img src='/landing-flowers-description-img.png' />
                    </div>
                    <div className='flowersDescription__content'>
                        <h1>
                            <img src='/landing-flowers-icon.png' />
                            <span>{t(`serviceName`)}</span>
                        </h1>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: t(`descriptionHTML`),
                            }}
                        />
                        <SecondaryButtonFull
                            onClick={() => scrollToFlowersGallery()}
                            style={{
                                width: '220px',
                                height: '48px',
                            }}
                        >
                            {t(`descriptionCTA`)}
                        </SecondaryButtonFull>
                    </div>
                </FlowersDescription>
                <div
                    style={{
                        minHeight: `40vh`,
                    }}
                >
                    <HowItWorksSection />
                    <FlowersGallerySection>
                        <h2 ref={flowersGalleryRef}>{t(`flowersGalleryHeading`)}</h2>
                        {width > 1024 ? (
                            <div
                                className='grid grid-cols-4 gap-6'
                                style={{
                                    justifyItems: 'center',
                                    marginLeft: '12vw',
                                    marginRight: '12vw',
                                }}
                            >
                                {flowersPictures.map((flowerPictureUrl, i) => (
                                    <FlowerCard key={i} pictureURL={flowerPictureUrl} />
                                ))}
                            </div>
                        ) : (
                            <FlowersGallery flowers={flowersPictures} />
                        )}
                    </FlowersGallerySection>
                </div>
                <FAQSection itemsArray={faqFlowers} translationNamespace='FlowersLanding' />
            </ContentContainer>
            <Footer cities={cities} />
            <Overlay />
            {/* Select city modal */}
            <StyledModal isOpen={ui[`isSelectCityServiceLandingOpen`]}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        padding: '10px',
                        paddingTop: '48px',
                        paddingBottom: '40px',
                        overflowY: 'auto',
                    }}
                >
                    <h1
                        style={{
                            width: '100%',
                            fontWeight: 'bold',
                            fontSize: '28px',
                            textAlign: 'center',
                        }}
                    >
                        {t(`selectCityForServiceModal.h_1`)}
                    </h1>
                    <div className={`text-center mb-8`}>{t(`selectCityForServiceModal.message`)}</div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                        }}
                    >
                        {availableCities &&
                            availableCities.map(city => (
                                <PrimaryButtonOutlined
                                    key={city.name}
                                    onClick={() => {
                                        dispatch(_toggleMenu({ menu: `isSelectCityServiceLandingOpen`, isOpen: false }));
                                        dispatch(_removeFromOverlayActionStack(`isSelectCityServiceLandingOpen`));
                                        setTimeout(() => {
                                            handleRedirectToCityWithSelectedService(city.name, 'flowers');
                                        }, 100);
                                    }}
                                    style={{
                                        height: '48px',
                                        width: '220px',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {t(`selectCityForServiceModal.cities.${city.name}`)}
                                </PrimaryButtonOutlined>
                            ))}
                    </div>
                </div>
            </StyledModal>
        </>
    );
}

export async function getServerSideProps(context) {
    try {
        const resCities = await fetch(`${BASE_URL}api/v1/cities`);

        const { cities } = await resCities.json();

        for (let i = 0; i < cities.length; i++) {
            const resServices = await fetch(`${BASE_URL}api/v1/cities/${cities[i].id}/homie_services`);
            const { homie_services: homieServices } = await resServices.json();
            cities[i].services = homieServices.filter(s => s.open);
        }

        return {
            props: {
                cities,
            },
        };
    } catch (err) {
        console.log(err);
    }

    return { props: {} };
}

export default FlowersLandingPage;
