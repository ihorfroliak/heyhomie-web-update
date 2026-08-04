/* eslint-disable dot-notation */
/* eslint-disable no-useless-return */
/* eslint-disable no-shadow */
// React & Next methods
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import tw, { css, styled, theme } from 'twin.macro';

// Redux Global State & actions
import { useSelector, useDispatch } from 'react-redux';

// Toasts
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Translations
import { useTranslations } from 'next-intl';

// 404 page
import DefaultErrorPage from 'next/error';

import { initCitySession, setHeaders, setSelectedCity } from '../lib/slices/userSlice';
import { ClearAllMenusAndModals, _openOverlayWithAction, _pushToOverlayActionStack, _removeFromOverlayActionStack, _toggleMenu } from '../lib/slices/uiSlice';

// SSR props
import { BASE_URL } from '../api/url';

// Sign in / Sign up menus
import ProfileMenu from '../components/citypage/menus/profilemenu/ProfileMenu';
import SignUpMenu from '../components/citypage/menus/signupmenu/SignUpMenu';
import ConfirmationCodeMenu from '../components/citypage/menus/confirmationcodemenu/ConfirmCodeMenu';

// Payment method menu
import PaymentMethodMenu from '../components/citypage/menus/paymentmenu/PaymentMethodMenu';

// Booking & booking submenus
import BookingMenu from '../components/citypage/menus/bookingmenu/BookingMenu';
import SelectAddressSubmenu from '../components/citypage/menus/bookingmenu/submenus/SelectAddressSubmenu';
import DatePickerSubmenu from '../components/citypage/menus/bookingmenu/submenus/DatepickerSubmenu';
import AddCommentSubmenu from '../components/citypage/menus/bookingmenu/submenus/AddCommentSubmenu';

// Modals
import StyledModal from '../components/ui/ModalWindow';

// Components
import Topnav from '../components/utilpages/topnav/Topnav';
import Overlay from '../components/citypage/menus/Overlay';
import ServicesContainer from '../components/citypage/servicesContainer/ServicesContainer';
import { PrimaryButtonFull, PrimaryButtonOutlined } from '../components/ui/Buttons';
import { _decrementTotalOrderPrice, deleteServiceFromOrderAndState, resetOrderSession, retrieveOrderSession } from '../lib/slices/orderSlice';
import AddCardSubmenu from '../components/citypage/menus/addcardsubmenu/AddCardSubmenu';
import ValidatePaymentConfirmOrderMenu from '../components/citypage/menus/bookingmenu/ValidatePaymentConfirmOrderMenu';
import Footer from '../components/utilpages/footer/Footer';
import CitypageBody from '../components/citypage/body/CitypageBody';
import CleaningSeoSection from '../components/serviceLanding/cleaning/CleaningSeoSection';
import { getCitySeoForms } from '../components/serviceLanding/cleaning/cityDistricts';
import HreflangLinks from '../components/seo/HreflangLinks';
import { initialConfigSwitch, servicesConfigSwitch } from '../api/servicesConfig';

// Additional options info modal
const AdditionalOptionsInfoModalContainer = styled.div`
    max-height: 50vh;
    overflow-y: auto;

    & > ul {
        list-style-type: circle;
    }
    & > ul > li {
        position: relative;
        text-indent: 2rem;
    }
    & > ul > li > p::before {
        content: '•';
        position: absolute;
        left: -1.5rem;
    }
`;

function CityPage({ city, cities, homie_services: homieServices }) {
    // Local state: city page to change to
    const [cityPageForRedirect, setCityPageForRedirect] = useState({});
    // Redux state
    const dispatch = useDispatch();
    const { user, ui, order } = useSelector(state => state);

    // UI translations for the component
    const t = useTranslations('CityPage');

    // Topnav & redirect handlers
    const router = useRouter();
    const changeLocale = lang => {
        // set preffered language here
        router.push(router.pathname, router.asPath, { locale: lang });
    };

    const changeCity = city => {
        dispatch(resetOrderSession());
        router.push(`/${city}`);
    };

    const promptChangeCityResetOrderMenu = cityObj => {
        setCityPageForRedirect(cityObj);
        dispatch(_toggleMenu({ menu: `isResetOrderOrCancelChangeCityModalOpen`, isOpen: true }));
        dispatch(_pushToOverlayActionStack(`isResetOrderOrCancelChangeCityModalOpen`));
    };

    // Toasts configuration
    const contextClass = {
        success: 'bg-secondary-salad',
        error: 'bg-primary-maroon',
        warning: 'bg-primary-orange',
    };

    // Set headers (authentication and other data agnostic)
    useEffect(() => {
        if (user && user.headers) {
            const headers = {
                acceptLanguage: router.locale,
                userLocale: router.locale,
            };
            dispatch(setHeaders(headers));
        }
    }, [user, router.locale]);

    // Init city session on page mount and first render
    useEffect(() => {
        // Add service from query
        const { selectedService } = router.query;

        let serviceToInit;

        if (selectedService && homieServices.findIndex(s => s.name === selectedService) !== -1) {
            const { config, address, date_time: dateTime } = initialConfigSwitch(selectedService);
            const service = homieServices.find(s => s.name === selectedService);

            serviceToInit = {
                city_id: service.city_id,
                homie_service_id: service.id,
                type: service.name,
                icon_image: service.icon_image,
                statusLocal: 'staging',
                cardExpanded: true,
                available_params: {
                    opening_days: service.opening_days,
                    opening_hour: service.opening_hour,
                    closing_hour: service.closing_hour,
                    minimum_bookable_hour: service.minimum_bookable_hour,
                },
                config,
                address,
                date_time: dateTime,
            };
        }

        // Initialize city session
        dispatch(
            initCitySession(
                city,
                cities,
                homieServices,
                serviceToInit || '',
                t(`session_expired_toast`),
                t(`coupon_added_toast`),
                t(`coupon_not_valid_toast`),
                t(`coupon_duplicate_toast`),
                t(`coupon_error_generic_toast`),
                t(`coupon_has_expired`),
                t(`coupon_is_not_active_yet`),
                t(`user_already_ordered`),
                t(`user_has_referral_coupon`),
                t(`user_identical_to_sponsor`),
                t(`service_already_in_order`)
            )
        );
    }, [city]);

    // Block scrolling on open menus/modals
    useEffect(() => {
        if (ui.overlayActionsStack.length > 0) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [ui.overlayActionsStack]);

    useEffect(() => {
        const { selectedService } = router.query;

        const hash = window && window.location.hash.replace(/^#\/?|\/$/g, '').split('/');

        if (ui.overlayActionsStack.length > 0) {
            if (!hash[0]) {
                router.push(
                    {
                        pathname: window && window.location.pathname,
                        hash: 'menuOpened',
                        query: selectedService ? { selectedService } : {},
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
                        query: selectedService ? { selectedService } : {},
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

    // 404 handler if city does not exist
    if (!city) {
        return (
            <>
                <DefaultErrorPage statusCode={404} />
            </>
        );
    }

    const isPl = router.locale === 'pl';
    const { locative: cityLocative } = getCitySeoForms(city.name, isPl);
    const ogUrl = isPl ? `https://www.heyhomie.io/${city.name}` : `https://www.heyhomie.io/${router.locale}/${city.name}`;

    return (
        <>
            <Head>
                <title>{t(`meta.title_city`, { cityLocative })}</title>
                <meta name='description' content={t(`meta.description_city`, { cityLocative })} />
                <meta property='og:type' content='website' />
                <meta property='og:url' content={ogUrl} />
                <meta property='og:title' content={t(`meta.og_title_city`, { cityLocative })} />
                <meta property='og:description' content={t(`meta.og_description_city`, { cityLocative })} />
            </Head>
            <HreflangLinks path={city.name} />
            <ToastContainer
                toastClassName={({ type }) =>
                    `${contextClass[type || 'default']} flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer font-bold`
                }
                bodyClassName={() => 'p-3'}
            />
            <Topnav
                cities={cities}
                handleChangeCity={changeCity}
                promptChangeCityResetOrderMenu={promptChangeCityResetOrderMenu}
                handleChangeLanguage={changeLocale}
                extraButtons={true}
            />
            <div>
                <span id='order' aria-hidden='true' />
                <ServicesContainer services={homieServices} default_background_image={city.default_background_image} />
                <CitypageBody />
                <CleaningSeoSection city={city} />
                <Footer
                    cities={cities}
                    handleChangeCity={changeCity}
                    promptChangeCityResetOrderMenu={promptChangeCityResetOrderMenu}
                    manager_name={city.manager_name}
                    manager_email={city.manager_email}
                    manager_phone_number={city.manager_phone_number}
                    manager_picture={city.manager_picture}
                />
            </div>
            <Overlay />
            {/* Menus */}
            {/* Booking process */}
            <BookingMenu />
            {order &&
                order.services &&
                order.services
                    .filter(s => s.statusLocal !== 'staging')
                    .map(service => {
                        return <DatePickerSubmenu key={service.type} service={service} isOpen={ui[`${service.type}DatePickerSubmenu`]} />;
                    })}
            {order &&
                order.services &&
                order.services
                    .filter(s => s.statusLocal !== 'staging')
                    .map(service => <SelectAddressSubmenu key={service.type} service={service} isOpen={ui[`${service.type}SelectAddressSubmenuOpen`]} />)}
            {order &&
                order.services &&
                order.services
                    .filter(s => s.statusLocal !== 'staging')
                    .map(service => <AddCommentSubmenu key={service.type} service={service} isOpen={ui[`${service.type}AddCommentSubmenuOpen`]} />)}
            <DatePickerSubmenu />
            {/* Service modals: descriptions */}
            {/* Descriptions */}
            {order && order.services && order.services.length > 0
                ? order.services.map(service => {
                      const { widgets } = servicesConfigSwitch(service.type);

                      return (
                          <React.Fragment key={service.type}>
                              <StyledModal isOpen={ui[`is${service.type}ModalPriceOpen`]}>
                                  <div
                                      style={{
                                          display: 'flex',
                                          flexDirection: 'row',
                                          flexWrap: 'wrap',
                                          justifyContent: 'center',
                                          padding: '10px',
                                          paddingTop: '48px',
                                          paddingBottom: '40px',
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
                                          {t(`modals.RecurrentPriceModal.h_1`)}
                                      </h1>
                                      <p
                                          style={{
                                              width: '100%',
                                              textAlign: 'center',
                                              marginTop: '.5rem',
                                          }}
                                      >
                                          {t(`modals.RecurrentPriceModal.para_1`)}
                                      </p>
                                      <p
                                          style={{
                                              width: '100%',
                                              textAlign: 'center',
                                              marginTop: '.5rem',
                                          }}
                                      >
                                          {t(`modals.RecurrentPriceModal.para_2`)}
                                      </p>
                                      <PrimaryButtonFull
                                          style={{
                                              width: '50%',
                                              height: '48px',
                                          }}
                                          onClick={() => {
                                              dispatch(_toggleMenu({ menu: `is${service.type}ModalPriceOpen`, isOpen: false }));
                                              dispatch(_removeFromOverlayActionStack(`is${service.type}ModalPriceOpen`));
                                          }}
                                      >
                                          {t(`modals.RecurrentPriceModal.close_btn`)}
                                      </PrimaryButtonFull>
                                  </div>
                              </StyledModal>
                              {service.statusLocal !== 'staging' ? (
                                  <StyledModal isOpen={ui[`is${service.type}ConfirmDeleteModalOpen`]}>
                                      <div
                                          style={{
                                              display: 'flex',
                                              flexDirection: 'row',
                                              flexWrap: 'wrap',
                                              justifyContent: 'center',
                                              padding: '10px',
                                              paddingTop: '48px',
                                              paddingBottom: '40px',
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
                                              {t(`modals.ConfirmDeleteServiceModal.h_1`)}
                                          </h1>
                                          <div className={`text-center mb-8`}>{t(`modals.ConfirmDeleteServiceModal.message`)}</div>
                                          <div className='flex flex-wrap justify-between w-full'>
                                              <PrimaryButtonOutlined
                                                  style={{
                                                      width: '45%',
                                                      height: '48px',
                                                      marginLeft: 0,
                                                      marginRight: 0,
                                                  }}
                                                  onClick={() => {
                                                      dispatch(_toggleMenu({ menu: `is${service.type}ConfirmDeleteModalOpen`, isOpen: false }));
                                                      dispatch(_removeFromOverlayActionStack(`is${service.type}ConfirmDeleteModalOpen`));
                                                  }}
                                              >
                                                  {t(`modals.ConfirmDeleteServiceModal.cancel_btn`)}
                                              </PrimaryButtonOutlined>
                                              <PrimaryButtonFull
                                                  style={{
                                                      width: '45%',
                                                      height: '48px',
                                                      marginLeft: 0,
                                                      marginRight: 0,
                                                  }}
                                                  onClick={() => {
                                                      dispatch(_decrementTotalOrderPrice({ homie_service_id: service.homie_service_id }));
                                                      dispatch(deleteServiceFromOrderAndState(service, t(`error_deleting_service_toast`)));
                                                      dispatch(_toggleMenu({ menu: `is${service.type}ConfirmDeleteModalOpen`, isOpen: false }));
                                                      dispatch(_removeFromOverlayActionStack(`is${service.type}ConfirmDeleteModalOpen`));
                                                  }}
                                              >
                                                  {t(`modals.ConfirmDeleteServiceModal.confirm_btn`)}
                                              </PrimaryButtonFull>
                                          </div>
                                      </div>
                                  </StyledModal>
                              ) : null}
                              {widgets.additionalOptionsInfo ? (
                                  <StyledModal
                                      isOpen={ui[`is${service.type}AdditionalOptionsInfoModalOpen`]}
                                      style={{
                                          top: '10vh',
                                      }}
                                  >
                                      <div
                                          style={{
                                              display: 'flex',
                                              flexDirection: 'row',
                                              flexWrap: 'wrap',
                                              justifyContent: 'center',
                                              padding: '10px',
                                              paddingTop: '48px',
                                              paddingBottom: '40px',
                                          }}
                                      >
                                          <AdditionalOptionsInfoModalContainer
                                              dangerouslySetInnerHTML={{ __html: t(`ServiceConfig.${widgets.additionalOptionsInfo.html}`) }}
                                          />
                                          <PrimaryButtonFull
                                              style={{
                                                  width: '50%',
                                                  height: '48px',
                                              }}
                                              onClick={() => {
                                                  dispatch(_toggleMenu({ menu: `is${service.type}AdditionalOptionsInfoModalOpen`, isOpen: false }));
                                                  dispatch(_removeFromOverlayActionStack(`is${service.type}AdditionalOptionsInfoModalOpen`));
                                              }}
                                          >
                                              {t(`modals.RecurrentPriceModal.close_btn`)}
                                          </PrimaryButtonFull>
                                      </div>
                                  </StyledModal>
                              ) : null}
                          </React.Fragment>
                      );
                  })
                : null}
            {/* Validate payment and confirm order */}
            {user && user.isAuthenticated ? <ValidatePaymentConfirmOrderMenu /> : null}
            {/* Sign in / Sign up */}
            <SignUpMenu />
            <ConfirmationCodeMenu />
            {/* Profile */}
            <ProfileMenu />
            {/* Payment */}
            {user && user.isAuthenticated ? <PaymentMethodMenu /> : null}
            {user && user.isAuthenticated ? <AddCardSubmenu isOpen={ui.addCardSubmenuOpen} /> : null}
            {/* Dialogues: reset order on page change, redirect to unfinished order */}
            {/* Reset order on page change or cancel */}
            <StyledModal isOpen={ui[`isResetOrderOrCancelChangeCityModalOpen`]}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        padding: '10px',
                        paddingTop: '48px',
                        paddingBottom: '40px',
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
                        {t(`modals.ResetOrderOrCancelChangeCityModal.h_1`)}
                    </h1>
                    <p
                        style={{
                            width: '100%',
                            textAlign: 'center',
                            marginTop: '.5rem',
                        }}
                    >
                        {t(`modals.ResetOrderOrCancelChangeCityModal.para_1`, {
                            city_name: t(city.name ? `Layout.cityNames.${city.name}` : `Layout.cityNames.default`),
                        })}
                    </p>
                    <p
                        style={{
                            width: '100%',
                            textAlign: 'center',
                            marginTop: '.5rem',
                        }}
                    >
                        {t(`modals.ResetOrderOrCancelChangeCityModal.para_2`, {
                            city_name: t(cityPageForRedirect.name ? `Layout.cityNames.${cityPageForRedirect.name}` : `Layout.cityNames.default`),
                        })}
                    </p>
                    <div
                        style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                        }}
                    >
                        <PrimaryButtonOutlined
                            style={{
                                display: 'block',
                                width: '40%',
                                height: '48px',
                                marginLeft: 0,
                                marginRight: '4px',
                            }}
                            onClick={() => {
                                // Close modal
                                setCityPageForRedirect({});
                                dispatch(_toggleMenu({ menu: `isResetOrderOrCancelChangeCityModalOpen`, isOpen: false }));
                                dispatch(_removeFromOverlayActionStack(`isResetOrderOrCancelChangeCityModalOpen`));
                            }}
                        >
                            {t(`modals.ResetOrderOrCancelChangeCityModal.stay_btn`)}
                        </PrimaryButtonOutlined>
                        <PrimaryButtonFull
                            style={{
                                display: 'block',
                                width: '40%',
                                height: '48px',
                                marginRight: 0,
                                marginLeft: '4px',
                            }}
                            onClick={() => {
                                // Close modal
                                dispatch(_toggleMenu({ menu: `isResetOrderOrCancelChangeCityModalOpen`, isOpen: false }));
                                dispatch(_removeFromOverlayActionStack(`isResetOrderOrCancelChangeCityModalOpen`));
                                // Reset order
                                dispatch(resetOrderSession());
                                // Set selected city
                                dispatch(
                                    setSelectedCity({
                                        selectedCity: cityPageForRedirect.name,
                                        selectedCityID: cityPageForRedirect.id,
                                    })
                                );
                                // Redirect
                                setTimeout(() => {
                                    router.push(`/${cityPageForRedirect.name}`, `/${cityPageForRedirect.name}`);
                                }, 100);
                            }}
                        >
                            {t(`modals.ResetOrderOrCancelChangeCityModal.redirect_btn`)}
                        </PrimaryButtonFull>
                    </div>
                </div>
            </StyledModal>
            {/* Redirect to unfinished order or stay and reset order */}
            <StyledModal isOpen={ui[`isRedirectToUnfinishedOrResetOrderModalOpen`]}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        padding: '10px',
                        paddingTop: '48px',
                        paddingBottom: '40px',
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
                        {t(`modals.RedirectToUnfinishedOrResetOrderModal.h_1`)}
                    </h1>
                    <p
                        style={{
                            width: '100%',
                            textAlign: 'center',
                            marginTop: '.5rem',
                        }}
                    >
                        {t(`modals.RedirectToUnfinishedOrResetOrderModal.para_1`, {
                            city_name: t(city.name ? `Layout.cityNames.${city.name}` : `Layout.cityNames.default`),
                            user_selectedCity: t(user.selectedCity ? `Layout.cityNames.${user.selectedCity}` : `Layout.cityNames.default`),
                        })}
                    </p>
                    <p
                        style={{
                            width: '100%',
                            textAlign: 'center',
                            marginTop: '.5rem',
                        }}
                    >
                        {t(`modals.RedirectToUnfinishedOrResetOrderModal.para_2`, {
                            city_name: t(city.name ? `Layout.cityNames.${city.name}` : `Layout.cityNames.default`),
                        })}
                    </p>
                    <div
                        style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                        }}
                    >
                        <PrimaryButtonOutlined
                            style={{
                                display: 'block',
                                width: '40%',
                                minHeight: '64px',
                                marginLeft: 0,
                                marginRight: '4px',
                            }}
                            onClick={() => {
                                // Close modal
                                dispatch(_toggleMenu({ menu: `isRedirectToUnfinishedOrResetOrderModalOpen`, isOpen: false }));
                                dispatch(_removeFromOverlayActionStack(`isRedirectToUnfinishedOrResetOrderModalOpen`));

                                const { selectedService } = router.query;

                                let serviceToInit = '';

                                if (selectedService && homieServices.findIndex(s => s.name === selectedService) !== -1) {
                                    const { config, address, date_time: dateTime } = initialConfigSwitch(selectedService);
                                    const service = homieServices.find(s => s.name === selectedService);

                                    serviceToInit = {
                                        city_id: service.city_id,
                                        homie_service_id: service.id,
                                        type: service.name,
                                        icon_image: service.icon_image,
                                        statusLocal: 'staging',
                                        cardExpanded: true,
                                        available_params: {
                                            opening_days: service.opening_days,
                                            opening_hour: service.opening_hour,
                                            closing_hour: service.closing_hour,
                                            minimum_bookable_hour: service.minimum_bookable_hour,
                                        },
                                        config,
                                        address,
                                        date_time: dateTime,
                                    };
                                }

                                // Retrieve order
                                // dispatch(retrieveOrderSession(
                                //     city.homie_services, city,
                                //     serviceToInit, t(`service_already_in_order`)
                                // ));
                                // Redirect
                                setTimeout(() => {
                                    router.push(`/${user.selectedCity}${selectedService ? `?selectedService=${selectedService}` : ``}`);
                                }, 100);
                            }}
                        >
                            {t(`modals.RedirectToUnfinishedOrResetOrderModal.return_to_order_in_btn`, {
                                city_name: t(user.selectedCity ? `Layout.cityNames.${user.selectedCity}` : `Layout.cityNames.default`),
                            })}
                        </PrimaryButtonOutlined>
                        <PrimaryButtonFull
                            style={{
                                display: 'block',
                                width: '40%',
                                minHeight: '64px',
                                marginRight: 0,
                                marginLeft: '4px',
                            }}
                            onClick={() => {
                                const { selectedService } = router.query;

                                let serviceToInit = '';

                                if (selectedService && homieServices.filter(s => s.open).findIndex(s => s.name === selectedService) !== -1) {
                                    const { config, address, date_time: dateTime } = initialConfigSwitch(selectedService);
                                    const service = homieServices.find(s => s.name === selectedService);

                                    serviceToInit = {
                                        city_id: service.city_id,
                                        homie_service_id: service.id,
                                        type: service.name,
                                        icon_image: service.icon_image,
                                        statusLocal: 'staging',
                                        cardExpanded: true,
                                        available_params: {
                                            opening_days: service.opening_days,
                                            opening_hour: service.opening_hour,
                                            closing_hour: service.closing_hour,
                                            minimum_bookable_hour: service.minimum_bookable_hour,
                                        },
                                        config,
                                        address,
                                        date_time: dateTime,
                                    };
                                }

                                // Close modal
                                dispatch(_toggleMenu({ menu: `isRedirectToUnfinishedOrResetOrderModalOpen`, isOpen: false }));
                                dispatch(_removeFromOverlayActionStack(`isRedirectToUnfinishedOrResetOrderModalOpen`));
                                // Set selected city
                                dispatch(
                                    setSelectedCity({
                                        selectedCity: city.name,
                                        selectedCityID: city.id,
                                    })
                                );
                                // Reset order
                                dispatch(resetOrderSession(serviceToInit));
                            }}
                        >
                            {t(`modals.RedirectToUnfinishedOrResetOrderModal.stay_on_page_for_btn`, {
                                city_name: t(city.name ? `Layout.cityNames.${city.name}` : `Layout.cityNames.default`),
                            })}
                        </PrimaryButtonFull>
                    </div>
                </div>
            </StyledModal>
        </>
    );
}

export async function getServerSideProps(context) {
    try {
        const { city } = context.query;

        const resCities = await fetch(`${BASE_URL}api/v1/cities`);
        const { cities } = await resCities.json();

        const cityObject = cities.find(c => c.name === city);

        if (!cityObject) {
            console.error(`City '${city}' not found`);

            return { props: { city: null, cities: [], homie_services: [] } };
        }

        const resServices = await fetch(`${BASE_URL}api/v1/cities/${cityObject.id}/homie_services`);
        const { homie_services: homieServices } = await resServices.json();

        return {
            props: {
                city: cityObject,
                cities,
                homie_services: homieServices,
            },
        };
    } catch (err) {
        console.error(err);
        return { props: { city: null, cities: [], homie_services: [] } };
    }
}

export default CityPage;
