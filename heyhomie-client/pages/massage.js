/* eslint-disable no-await-in-loop */
/* eslint-disable no-lonely-if */
/* eslint-disable no-useless-return */
/* eslint-disable dot-notation */
// React & Next methods
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import tw, { css, styled, theme } from 'twin.macro';

// Redux Global State & actions
import { useSelector, useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { useTranslations } from 'next-intl';
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
import { PrimaryButtonOutlined } from '../components/ui/Buttons';

import { homiesMassage } from '../components/serviceLanding/massage/homiesMassage';
import { faqMassage } from '../components/serviceLanding/massage/faqMassage';

import HowItWorksSection from '../components/serviceLanding/HowItWorksSection';
import HomiesGallery from '../components/serviceLanding/HomiesGallery';
import HowWeSelectHomiesSection from '../components/serviceLanding/HowSelectHomiesSection';
import FAQSection from '../components/serviceLanding/FAQSection';

const ContentContainer = styled.div`
    min-height: 100vh;
`;

const MassageDescription = styled.div`
    background-color: #ffffff;
    box-shadow: 0px 0px 14px rgba(0, 0, 0, 0.05);

    padding-left: 24px;
    padding-right: 24px;

    padding-bottom: 64px;

    .massageDescription__img {
        display: none;
    }

    .massageDescription__content {
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

        .massageDescription__img {
            margin-top: 80px;
            display: block;
            width: 35%;

            max-height: 500px;

            img {
                height: 100%;
                object-fit: contain;
            }
        }

        .massageDescription__content {
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

const MassagePlansContainer = styled.div`
    @media (min-width: 1024px) {
    }
`;

const MassagePlansControls = styled.div`
    display: flex;
    justify-content: center;

    margin-top: 48px;
    margin-bottom: 32px;

    @media (min-width: 1024px) {
        margin-top: 64px;
        margin-bottom: 64px;
    }
`;

const MassageAdvancedPlanFeature = styled.li`
    color: #141338;
    font-weight: bold;

    transition: 0.2s ease-in-out;

    ${props =>
        props.isSelected
            ? css`
                  opacity: 1;
              `
            : css`
                  opacity: 0.5;
              `};
`;

const MassagePlansFlexbox = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;

    @media (min-width: 1024px) {
    }
`;

const MassagePlansFlexBoxSectionStyled = styled.div`
    display: flex;
    flex-direction: column;

    width: 100%;

    h3 {
        color: #eb4e87;

        font-family: Manrope;
        text-transform: uppercase;
        font-style: normal;
        font-weight: bold;

        font-size: 28px;
        line-height: 35px;

        margin-bottom: 16px;
        margin-top: 16px;

        @media (min-width: 1024px) {
            font-size: 28px;
            line-height: 35px;

            margin-bottom: 24px;
        }
    }

    div {
        color: #141338;

        font-weight: normal;
        font-size: 14px;
        line-height: 25px;

        @media (min-width: 1024px) {
            font-size: 18px;
            line-height: 24px;
        }
    }

    @media (min-width: 1024px) {
        width: 45%;
    }
`;

const MassagePlansFlexBoxSection = ({ section }) => {
    // UI translations for the component
    const t = useTranslations('ServicesLandings.MassageLanding.massagePlans');
    return (
        <MassagePlansFlexBoxSectionStyled>
            <h3>{t(`${section}.heading`)}</h3>
            <div
                dangerouslySetInnerHTML={{
                    __html: t(`${section}.body`),
                }}
            />
        </MassagePlansFlexBoxSectionStyled>
    );
};

const MassagePlans = () => {
    return (
        <MassagePlansContainer>
            <MassagePlansFlexbox>
                <MassagePlansFlexBoxSection section='relaxation' />
                <MassagePlansFlexBoxSection section='deepTissue' />
                <MassagePlansFlexBoxSection section='sportive' />
                <MassagePlansFlexBoxSection section='targeted' />
            </MassagePlansFlexbox>
        </MassagePlansContainer>
    );
};

function MassageLandingPage({ cities }) {
    // UI translations for the component
    const t = useTranslations('ServicesLandings.MassageLanding');

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
    const [availableCities, setAvailableCities] = useState(cities && cities.filter(city => city.services.findIndex(s => s.name === 'massage') !== -1));

    const handleRedirectToCityWithSelectedService = (city, serviceHomieName) => {
        router.push(`/${city}?selectedService=${serviceHomieName}`);
    };

    const handleClickBookNow = () => {
        if (availableCities && availableCities.length === 1) {
            handleRedirectToCityWithSelectedService(availableCities[0].name, 'massage');
        } else {
            dispatch(_toggleMenu({ menu: `isSelectCityServiceLandingOpen`, isOpen: true }));
            dispatch(_pushToOverlayActionStack(`isSelectCityServiceLandingOpen`));
        }
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
                <meta property='og:url' content={`https://www.heyhomie.io/massage`} />
                <meta property='og:title' content={t(`meta.og_title`)} />
                <meta property='og:description' content={t(`meta.og_description`)} />
            </Head>
            <Topnav handleChangeLanguage={changeLocale} />
            <ContentContainer>
                <BookingHeroSection
                    servicePictureURL={`https://api.heyhomie.io/service_images/bg_massage.png`}
                    serviceName={t(`serviceName`)}
                    serviceDescription={t(`serviceHeroDescription`)}
                    bookNowText={t(`bookNowText`)}
                    handleClick={handleClickBookNow}
                />
                <MassageDescription>
                    <div className='massageDescription__img'>
                        <img src='/landing-massage-description-img.png' />
                    </div>
                    <div className='massageDescription__content'>
                        <h1>
                            <img src='/landing-massage-icon.png' />
                            <span>{t(`serviceName`)}</span>
                        </h1>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: t(`descriptionHTML`),
                            }}
                        />
                    </div>
                    <div
                        style={{
                            width: '100%',
                        }}
                    >
                        <MassagePlans />
                    </div>
                </MassageDescription>
                <div
                    style={{
                        minHeight: `40vh`,
                    }}
                >
                    <HowItWorksSection />
                    <HomiesGallery homiesArray={homiesMassage} translationNamespace='MassageLanding' />
                </div>
                <HowWeSelectHomiesSection handleClick={handleClickBookNow} />
                <FAQSection itemsArray={faqMassage} translationNamespace='MassageLanding' />
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
                                            handleRedirectToCityWithSelectedService(city.name, 'massage');
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

export default MassageLandingPage;
