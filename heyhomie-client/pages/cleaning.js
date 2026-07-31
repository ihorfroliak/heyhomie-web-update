/* eslint-disable no-unused-vars */
/* eslint-disable no-await-in-loop */
/* eslint-disable dot-notation */
/* eslint-disable no-useless-return */
// React & Next methods
import React, { useEffect, useState } from 'react';
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
import { PrimaryButtonOutlined } from '../components/ui/Buttons';

import { homiesCleaning } from '../components/serviceLanding/cleaning/homiesCleaning';
import { faqCleaning } from '../components/serviceLanding/cleaning/faqCleaning';
import { plansFeautures } from '../components/serviceLanding/cleaning/cleaningPlansFeatures';

import HreflangLinks from '../components/seo/HreflangLinks';
import HowItWorksSection from '../components/serviceLanding/HowItWorksSection';
import HomiesGallery from '../components/serviceLanding/HomiesGallery';
import HowWeSelectHomiesSection from '../components/serviceLanding/HowSelectHomiesSection';
import FAQSection from '../components/serviceLanding/FAQSection';
import OurAdvantagesSection from '../components/serviceLanding/cleaning/OurAdvantagesSection';
import WhyWeShouldCleanSection from '../components/serviceLanding/cleaning/WhyWeShouldCleanSection';
import GallerySection from '../components/serviceLanding/cleaning/GallerySection';
import CleaningCalculatorSection from '../components/serviceLanding/cleaning/CleaningCalculatorSection';

const ContentContainer = styled.div`
    min-height: 100vh;
`;

const CleaningDescription = styled.div`
    padding-top: 15px;
    background-color: #ffffff;
    box-shadow: 0px 0px 14px rgba(0, 0, 0, 0.05);

    padding-left: 24px;
    padding-right: 24px;

    padding-bottom: 64px;

    .cleaningDescription__img {
        display: none;
    }

    .cleaningDescription__content {
        h1 {
            display: flex;
            justify-content: flex-start;
            align-items: center;

            font-family: 'Quicksand';

            margin-bottom: 32px;

            padding-top: 50px;

            img {
                height: 48px;
                margin-right: 1rem;
            }
            span {
                text-transform: uppercase;
                color: #14133a;
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
        padding-top: 0;

        .cleaningDescription__img {
            margin-top: 80px;
            display: block;
            width: 35%;

            max-height: 500px;

            img {
                height: 100%;
                object-fit: contain;
            }
        }

        .cleaningDescription__content {
            width: 65%;

            padding-left: 76px;

            h1 {
                display: flex;
                justify-content: flex-start;
                align-items: center;

                font-family: 'Quicksand';

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

const CleaningPlansContainer = styled.div`
    @media (min-width: 1024px) {
    }
`;

const CleaningPlansControls = styled.div`
    display: flex;
    justify-content: center;

    margin-top: 48px;
    margin-bottom: 32px;

    @media (min-width: 1024px) {
        margin-top: 64px;
        margin-bottom: 64px;
    }
`;

const CleaningAdvancedPlanFeature = styled.li`
    color: #14133a;

    transition: 0.2s ease-in-out;

    ${props =>
        props.isSelected
            ? css`
                  opacity: 1;

                  &::before {
                      content: '•';
                  }

                  font-weight: bold;
              `
            : css`
                  opacity: 0.5;

                  &::before {
                      content: '' !important;
                  }
              `};
`;

const CleaningPlansFlexbox = styled.div`
    .cleaningPlansFlexbox__notes {
        padding-top: 24px;

        .cleaningPlansFlexbox__notes__item {
            display: flex;
            align-items: center;

            margin-bottom: 1rem;

            img:first-child {
                display: block;

                height: 24px;
                width: 24px;
                margin-right: 1rem;

                object-fit: contain;
            }

            img:nth-child(2) {
                display: block;

                height: 32px;
                width: 32px;
                min-width: 32px;
                margin-right: 1rem;

                object-fit: contain;
            }
        }
    }
    @media (min-width: 1024px) {
        display: grid;
        grid-template-columns: repeat(3, 1fr);

        grid-gap: 10px;

        .cleaningPlansFlexbox__notes {
            padding-top: 0;

            grid-column: 1/3;

            position: relative;
            top: -80px;

            .cleaningPlansFlexbox__notes__item {
                img:first-child {
                    height: 32px;
                    width: 32px;
                    margin-right: 1.5rem;
                }

                img:nth-child(2) {
                    height: 64px;
                    width: 64px;
                    min-width: 64px;
                    margin-right: 1.5rem;
                }
            }
        }

        div:first-child {
            grid-row: 1 / 4;
        }
        div:nth-child(2) {
            grid-row: 1 / 2;
        }
        div:nth-child(3) {
            grid-row: 2 / 4;
        }
        div:nth-child(4) {
            grid-row: 1 / 2;
        }
        div:nth-child(5) {
            grid-row: 2 / 3;
        }
        div:nth-child(6) {
            grid-row: 3 / 4;
        }
    }
`;

const CleaningPlansFlexBoxSectionStyled = styled.div`
    display: flex;
    flex-direction: column;

    h3 {
        color: #ff3c87;

        font-family: Quicksand;
        text-transform: uppercase;
        font-style: normal;
        font-weight: bold;

        font-size: 28px;
        line-height: 35px;

        margin-bottom: 16px;
        margin-top: 16px;

        display: flex;
        justify-content: flex-start;
        align-items: center;

        img {
            display: block;

            height: 32px;
            margin-right: 1rem;

            @media (min-width: 1024px) {
                height: 64px;
                margin-right: 1.5rem;
            }
        }

        @media (min-width: 1024px) {
            font-size: 28px;
            line-height: 35px;

            margin-bottom: 24px;
        }
    }

    & > ul {
    }
    & > ul > li {
        position: relative;
        text-indent: 2rem;

        color: #14133a;

        font-size: 14px;
        line-height: 25px;

        @media (min-width: 1024px) {
            font-size: 18px;
            line-height: 25px;
        }
    }
    & > ul > li::before {
        content: '•';
        position: absolute;
        left: -1.5rem;
    }

    @media (min-width: 1024px) {
        height: fit-content;
    }
`;

const CleaningPlansFlexBoxSection = ({ section, selectedPlan }) => {
    // UI translations for the component
    const t = useTranslations('ServicesLandings.CleaningLanding');

    return (
        <CleaningPlansFlexBoxSectionStyled>
            <h3>
                <img src={section.imageURL} />
                <div>{t(`cleaningPlans.plansFeautures.${section.section}`)}</div>
            </h3>
            <ul>
                {section.features.map((f, i) =>
                    f.plan === 'regular' ? (
                        <li key={i}>{t(`cleaningPlans.plansFeautures.${f.token}`)}</li>
                    ) : (
                        <CleaningAdvancedPlanFeature key={i} isSelected={selectedPlan === 'advanced'}>
                            {t(`cleaningPlans.plansFeautures.${f.token}`)}
                        </CleaningAdvancedPlanFeature>
                    )
                )}
            </ul>
        </CleaningPlansFlexBoxSectionStyled>
    );
};

const CleaningPlansControlsLeftBtn = styled.button`
    background: #ffffff;
    border-radius: 8px 0px 0px 8px;

    text-align: center;

    color: #14133a;

    font-weight: bold;
    font-size: 16px;
    line-height: 19px;

    height: 44px;
    width: 162px;

    ${props =>
        props.isSelected
            ? css`
                  background: #36f0c7;
              `
            : tw`
        shadow-surface1
    `};

    &:focus {
        outline: none;
    }

    @media (min-width: 1024px) {
        width: 220px;
        font-size: 18px;
        line-height: 22px;
    }
`;

const CleaningPlansControlsRightBtn = styled.button`
    background: #ffffff;
    border-radius: 0px 8px 8px 0px;

    text-align: center;

    color: #14133a;

    font-weight: bold;
    font-size: 16px;
    line-height: 19px;

    height: 44px;
    width: 162px;

    ${props =>
        props.isSelected
            ? css`
                  background: #36f0c7;
              `
            : tw`
        shadow-surface1
    `};

    &:focus {
        outline: none;
    }

    @media (min-width: 1024px) {
        width: 220px;
        font-size: 18px;
        line-height: 22px;
    }
`;

const CleaningPlans = () => {
    // UI translations for the component
    const t = useTranslations('ServicesLandings.CleaningLanding');

    const [plan, setPlan] = useState('regular');

    return (
        <CleaningPlansContainer>
            <CleaningPlansControls>
                <CleaningPlansControlsLeftBtn isSelected={plan === 'regular'} onClick={() => setPlan('regular')}>
                    {t(`cleaningPlans.regularBtn`)}
                </CleaningPlansControlsLeftBtn>
                <CleaningPlansControlsRightBtn isSelected={plan === 'advanced'} onClick={() => setPlan('advanced')}>
                    {t(`cleaningPlans.advancedBtn`)}
                </CleaningPlansControlsRightBtn>
            </CleaningPlansControls>
            <CleaningPlansFlexbox>
                {plansFeautures.map((f, i) => (
                    <CleaningPlansFlexBoxSection key={i} section={f} selectedPlan={plan} />
                ))}
                <div className='cleaningPlansFlexbox__notes'>
                    <div className='cleaningPlansFlexbox__notes__item'>
                        <img src='/cleaning-plan-icon-yes.png' />
                        <img src='/cleaning-plan-icon-spray.png' />
                        <div
                            dangerouslySetInnerHTML={{
                                __html: t(`cleaningPlans.notes.yes`),
                            }}
                        />
                    </div>
                    <div className='cleaningPlansFlexbox__notes__item'>
                        <img src='/cleaning-plan-icon-no.png' />
                        <img src='/cleaning-plan-icon-vacuum.png' />
                        <div
                            dangerouslySetInnerHTML={{
                                __html: t(`cleaningPlans.notes.no`),
                            }}
                        />
                    </div>
                </div>
            </CleaningPlansFlexbox>
        </CleaningPlansContainer>
    );
};

function CleaningLandingPage({ cities }) {
    // UI translations for the component
    const t = useTranslations('ServicesLandings.CleaningLanding');

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
    const [availableCities, setAvailableCities] = useState(cities && cities.filter(city => city.services.findIndex(s => s.name === 'cleaning') !== -1));

    const handleRedirectToCityWithSelectedService = (city, serviceHomieName) => {
        router.push(`/${city}?selectedService=${serviceHomieName}`);
    };

    const handleClickBookNow = () => {
        if (availableCities && availableCities.length === 1) {
            handleRedirectToCityWithSelectedService(availableCities[0].name, 'cleaning');
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
            // eslint-disable-next-line no-lonely-if
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
                <meta property='og:url' content={`https://www.heyhomie.io/cleaning`} />
                <meta property='og:title' content={t(`meta.og_title`)} />
                <meta property='og:description' content={t(`meta.og_description`)} />
            </Head>
            <HreflangLinks path='cleaning' />
            <Topnav handleChangeLanguage={changeLocale} />
            <ContentContainer>
                <BookingHeroSection
                    servicePictureURL={`https://api.heyhomie.io/service_images/bg_cleaning.png`}
                    serviceName={t(`serviceName`)}
                    serviceDescription={t(`serviceHeroDescription`)}
                    bookNowText={t(`bookNowText`)}
                    handleClick={handleClickBookNow}
                />
                <CleaningCalculatorSection onBook={handleClickBookNow} />
                <CleaningDescription>
                    <CleaningPlans />

                    <div className='cleaningDescription__img'>
                        <img src='/landing-cleaning-description-img.png' />
                    </div>
                    <div className='cleaningDescription__content'>
                        <h1>
                            <img src='/landing-cleaning-icon.png' />
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
                    ></div>
                </CleaningDescription>
                <div
                    style={{
                        minHeight: `40vh`,
                    }}
                >
                    <OurAdvantagesSection />
                    <HowItWorksSection />
                    <WhyWeShouldCleanSection />
                    <GallerySection />
                    <HomiesGallery homiesArray={homiesCleaning} translationNamespace='CleaningLanding' />
                </div>
                <HowWeSelectHomiesSection handleClick={handleClickBookNow} />
                <FAQSection itemsArray={faqCleaning} translationNamespace='CleaningLanding' />
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
                                            handleRedirectToCityWithSelectedService(city.name, 'cleaning');
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

export default CleaningLandingPage;
