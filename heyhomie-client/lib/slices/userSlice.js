/* eslint-disable no-unused-expressions */
/* eslint-disable consistent-return */
/* eslint-disable no-lonely-if */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-else-return */
/* eslint-disable import/no-cycle */
import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { loadStateLS, saveStateLS } from '../loadState';

// API
import { addCoupon, detailUser, recieveConfirmationCode, registerUser, signinUser, signoutUser } from '../../api/endpoints/user';
import { verifyTokenUser, verifyTokenVisitor } from '../../api/endpoints/sessions';
import { registerVisitor } from '../../api/endpoints/visitor';
import { retrieveOrderSession, resetOrderSession, _resetOrderSession } from './orderSlice';

// UI actions
import { ClearAllMenusAndModals, _pushToOverlayActionStack, _removeFromOverlayActionStack, _toggleMenu } from './uiSlice';

// Toasts
import { fetchAndSetAddresses, _clearAddresses } from './addressesSlice';
import { fetchAndSetCards, _clearCards } from './cardsSlice';

// Facebook Pixel
import * as fbq from '../fpixel';

const defaultState = {
    // Headers || non-persistent
    headers: {
        'Accept': 'application/json',
        'Accept-Language': '',
        'ContentType': 'application/json',
        'User-Locale': '',
    },
    // Selected city || persistent
    selectedCity: '',
    selectedCityID: '',
    // Visitor || persistent
    x_token_visitor: '',
    expires_at: '',
    // User || persistent
    isAuthenticated: false,
    id: '',
    x_token_user: '',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    phone_number_verified: '',
    preferred_locale: '',
    referral_code: '',
    // Phone number for signing in || non-persistent
    phone_number_for_confirmation: '',
    // UI state || non-persistent
    isPhoneVerificationLoading: false,
    phoneVerificationError: '',
    isSignUpLoading: false,
    signUpError: '',
    isSignInLoading: false,
    signInError: '',
    isSignOutLoading: false,
    signOutError: '',
};

const defaultPersistentState = {
    // Selected city || persistent
    selectedCity: '',
    selectedCityID: '',
    // Visitor || persistent
    x_token_visitor: '',
    expires_at: '',
    // User || persistent
    isAuthenticated: false,
    id: '',
    x_token_user: '',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    phone_number_verified: '',
    preferred_locale: '',
};

const setUpUserInitialState = () => {
    if (typeof window !== 'undefined') {
        const loadedUser = loadStateLS('user');
        if (!loadedUser) {
            saveStateLS(defaultPersistentState, 'user');

            return defaultState;
        } else {
            const initialiazedState = { ...defaultState, ...loadedUser };

            return initialiazedState;
        }
    } else {
        return defaultState;
    }
};

const userSlice = createSlice({
    name: 'user',
    initialState: setUpUserInitialState(),
    reducers: {
        _setSelectedCity(state, action) {
            const { selectedCity, selectedCityID } = action.payload;

            state.selectedCity = selectedCity;
            state.selectedCityID = selectedCityID;
        },
        _setHeaders(state, action) {
            const { acceptLanguage, userLocale } = action.payload;

            state.headers['Accept-Language'] = acceptLanguage;
            state.headers['User-Locale'] = userLocale;
        },
        _setVisitorSession(state, action) {
            const { x_token_visitor, expires_at } = action.payload;

            state.x_token_visitor = x_token_visitor;
            state.expires_at = expires_at;
        },
        _setPhoneNumberForConfirmation(state, action) {
            state.phone_number_for_confirmation = action.payload;
        },
        _setSeparateField(state, action) {
            const { key, value } = action.payload;
            state[key] = value;
        },
        _setUser(state, action) {
            const { id, first_name, last_name, x_token_user, email, phone_number, phone_number_verified, preferred_locale, referral_code } = action.payload;

            state.id = id;
            state.first_name = first_name;
            state.last_name = last_name;
            state.x_token_user = x_token_user;
            state.email = email;
            state.phone_number = phone_number;
            state.phone_number_verified = phone_number_verified;
            state.preferred_locale = preferred_locale;
            state.referral_code = referral_code;
            state.isAuthenticated = true;

            // Unset visitor data
            state.x_token_visitor = '';
            state.expires_at = '';
        },
        _unsetUser(state) {
            state.id = '';
            state.first_name = '';
            state.last_name = '';
            state.x_token_user = '';
            state.email = '';
            state.phone_number = '';
            state.phone_number_verified = '';
            state.preferred_locale = '';
            state.isAuthenticated = false;
        },
        _setAuthenticated(state, action) {
            state.isAuthenticated = action.payload;
        },
        _setPhoneVerified(state) {
            state.phone_number_verified = true;
        },
        _setUserToken(state, action) {
            const { x_token_user } = action.payload;
            state.x_token_user = x_token_user;
        },
        _setIsLoading(state, action) {
            const { loadingAction, isLoading } = action.payload;
            state[loadingAction] = isLoading;
        },
        _setError(state, action) {
            const { errorField, status } = action.payload;
            state[errorField] = status;
        },
    },
});

export const {
    _setSelectedCity,
    _setHeaders,
    _setVisitorSession,
    _setSeparateField,
    _setUser,
    _unsetUser,
    _setAuthenticated,
    _setPhoneNumberForConfirmation,
    _setPhoneVerified,
    _setUserToken,
    _setIsLoading,
    _setError,
} = userSlice.actions;

export const setSelectedCity = city => dispatch => {
    const loadedUser = loadStateLS('user');

    const workingState = { ...loadedUser, ...city };

    saveStateLS(workingState, 'user');
    dispatch(_setSelectedCity(city));
};

export const setHeaders = headers => dispatch => {
    dispatch(_setHeaders(headers));
};

export const setVisitorSession = visitorSessionData => dispatch => {
    const loadedUser = loadStateLS('user');

    const workingState = { ...loadedUser, ...visitorSessionData };

    saveStateLS(workingState, 'user');
    dispatch(_setVisitorSession(visitorSessionData));
};

export const setSeparateField = keyValueObj => dispatch => {
    const loadedUser = loadStateLS('user');

    const workingState = { ...loadedUser };

    workingState[keyValueObj.key] = keyValueObj.value;

    saveStateLS(workingState, 'user');
    dispatch(_setSeparateField(keyValueObj));
};

export const setSaveUser = user => dispatch => {
    const loadedUser = loadStateLS('user');

    const workingState = { ...loadedUser, ...user };

    workingState.x_token_visitor = '';
    workingState.expires_at = '';
    workingState.isAuthenticated = true;

    saveStateLS(workingState, 'user');
    dispatch(_setUser(user));
};

export const unsetSaveUser = () => dispatch => {
    const loadedUser = loadStateLS('user');

    const workingState = { ...loadedUser };

    workingState.id = '';
    workingState.first_name = '';
    workingState.last_name = '';
    workingState.x_token_user = '';
    workingState.email = '';
    workingState.phone_number = '';
    workingState.phone_number_verified = '';
    workingState.preferred_locale = '';
    workingState.isAuthenticated = false;
    saveStateLS(workingState, 'user');

    dispatch(_unsetUser());
};

// Runs on the first render when visiting city page
export const initCitySession =
    (
        city,
        cities,
        cityServices,
        serviceFromQuery,
        session_expired_toast,
        coupon_added_toast,
        coupon_not_valid_toast,
        coupon_duplicate_toast,
        coupon_error_generic_toast,
        coupon_has_expired,
        coupon_is_not_active_yet,
        user_already_ordered,
        user_has_referral_coupon,
        user_identical_to_sponsor,
        service_already_in_order
    ) =>
    async (dispatch, getState) => {
        const { user, order } = getState();
        try {
            if (!user || !user.selectedCity || !user.selectedCityID) {
                // 1st ever visit
                dispatch(setSelectedCity({ selectedCity: city.name, selectedCityID: city.id }));
                dispatch(initVisitorSessionCity());
            } else if (user && user.selectedCity && user.selectedCity === city.name) {
                // User/Visitor is on the page from the last visit
                if (user.isAuthenticated) {
                    // Assume valid user, check
                    const isUserTokenValid = await verifyTokenUser(user.headers, user.x_token_user);
                    if (isUserTokenValid) {
                        // User is validly signed in, try to restore order session
                        if (order && order.id && Math.round(new Date() / 1000) < order.expires_at) {
                            // Order is present, try to restore services
                            dispatch(retrieveOrderSession(cityServices, city, serviceFromQuery, service_already_in_order));

                            // Try to fetch addresses
                            dispatch(fetchAndSetAddresses());

                            // Try to fetch cards
                            dispatch(fetchAndSetCards());
                        } else {
                            // Order is not present
                            dispatch(resetOrderSession(serviceFromQuery));

                            // Try to fetch addresses
                            dispatch(fetchAndSetAddresses());

                            // Try to fetch cards
                            dispatch(fetchAndSetCards());
                        }

                        // Testing
                        if (user.cachedReferralCoupon) {
                            try {
                                const data = await addCoupon(user.headers, user.x_token_user, user.cachedReferralCoupon);

                                toast.success(coupon_added_toast);
                                dispatch(setSeparateField({ key: 'cachedReferralCoupon', value: '' }));
                            } catch (err) {
                                console.log(err);
                                if (err.response && err.response.data && err.response.data.errors[0].code) {
                                    switch (err.response.data.errors[0].code) {
                                        case 'coupon_is_duplicate': {
                                            toast.warning(coupon_duplicate_toast);
                                            break;
                                        }
                                        case 'not_found': {
                                            toast.error(coupon_not_valid_toast);
                                            break;
                                        }
                                        case 'coupon_has_expired': {
                                            toast.error(coupon_has_expired);
                                            break;
                                        }
                                        case 'coupon_is_not_active_yet': {
                                            toast.warning(coupon_is_not_active_yet);
                                            break;
                                        }
                                        case 'user_already_ordered': {
                                            toast.error(user_already_ordered);
                                            break;
                                        }
                                        case 'user_has_referral_coupon': {
                                            toast.error(user_has_referral_coupon);
                                            break;
                                        }
                                        case 'user_identical_to_sponsor': {
                                            toast.error(user_identical_to_sponsor);
                                            break;
                                        }
                                        default: {
                                            toast.error(coupon_error_generic_toast);
                                            break;
                                        }
                                    }
                                }
                                dispatch(setSeparateField({ key: 'cachedReferralCoupon', value: '' }));
                            }
                        }
                        // Testing

                        dispatch(synchronizeCouponData());
                    } else {
                        // User session "expired", reset order session and prompt sign in
                        dispatch(unsetSaveUser());
                        dispatch(resetOrderSession(serviceFromQuery));

                        toast.warning(session_expired_toast);

                        dispatch(_toggleMenu({ menu: 'signUpMenuOpen', isOpen: true }));
                        dispatch(_pushToOverlayActionStack('signUpMenuOpen'));

                        // Reset addresses
                        dispatch(_clearAddresses());

                        // Reset cards
                        dispatch(_clearCards());
                    }
                } else {
                    // Assume valid visitor, check
                    const isVisitorTokenValid = await verifyTokenVisitor(user.headers, user.x_token_visitor);
                    if (isVisitorTokenValid) {
                        // Visitor token valid, try to restore order session
                        if (order && order.id && Math.round(new Date() / 1000) < order.expires_at) {
                            // Order is present, try to restore services
                            dispatch(retrieveOrderSession(cityServices, city, serviceFromQuery, service_already_in_order));

                            // Try to fetch addresses for the visitor
                            dispatch(fetchAndSetAddresses());
                        } else {
                            // Order is not present/valid
                            dispatch(resetOrderSession(serviceFromQuery));

                            // Reset addresses
                            dispatch(_clearAddresses());
                        }
                    } else {
                        // Visitor token invalid, reset visitor session and order session
                        dispatch(resetOrderSession(serviceFromQuery));
                        dispatch(initVisitorSessionCity());

                        // Reset addresses
                        dispatch(_clearAddresses());
                    }
                }
            } else if (user && user.selectedCity && user.selectedCity !== city.name) {
                // User/Visitor is NOT on the page from the last visit
                // Check for orders first
                if (order && order.id && Math.round(new Date() / 1000) < order.expires_at) {
                    // Possible valid order, check auth and try retrieve
                    if (user.isAuthenticated) {
                        // Assume valid user, check
                        const isUserTokenValid = await verifyTokenUser(user.headers, user.x_token_user);
                        if (isUserTokenValid) {
                            // User is validly signed in, try to restore order session
                            dispatch(retrieveOrderSession(cityServices, city, serviceFromQuery, service_already_in_order));

                            // Try to fetch addresses for the visitor
                            dispatch(fetchAndSetAddresses());

                            // Try and fetch cards
                            dispatch(fetchAndSetCards());
                        } else {
                            // User session "expired", reset order session and prompt sign in
                            dispatch(unsetSaveUser());
                            dispatch(resetOrderSession(serviceFromQuery));

                            toast.warning(session_expired_toast);

                            dispatch(_toggleMenu({ menu: 'signUpMenuOpen', isOpen: true }));
                            dispatch(_pushToOverlayActionStack('signUpMenuOpen'));

                            // Reset addresses
                            dispatch(_clearAddresses());

                            // Reset cards
                            dispatch(_clearCards());
                        }

                        // Testing
                        if (user.cachedReferralCoupon) {
                            try {
                                const data = await addCoupon(user.headers, user.x_token_user, user.cachedReferralCoupon);

                                toast.success(coupon_added_toast);
                                dispatch(setSeparateField({ key: 'cachedReferralCoupon', value: '' }));
                            } catch (err) {
                                console.log(err);
                                if (err.response && err.response.data && err.response.data.errors[0].code) {
                                    console.log(err.response.data.errors[0].code);
                                    switch (err.response.data.errors[0].code) {
                                        case 'coupon_is_duplicate': {
                                            toast.warning(coupon_duplicate_toast);
                                            break;
                                        }
                                        case 'not_found': {
                                            toast.error(coupon_not_valid_toast);
                                            break;
                                        }
                                        case 'coupon_has_expired': {
                                            toast.error(coupon_has_expired);
                                            break;
                                        }
                                        case 'coupon_is_not_active_yet': {
                                            toast.warning(coupon_is_not_active_yet);
                                            break;
                                        }
                                        case 'user_already_ordered': {
                                            toast.error(user_already_ordered);
                                            break;
                                        }
                                        case 'user_has_referral_coupon': {
                                            toast.error(user_has_referral_coupon);
                                            break;
                                        }
                                        case 'user_identical_to_sponsor': {
                                            toast.error(user_identical_to_sponsor);
                                            break;
                                        }
                                        default: {
                                            toast.error(coupon_error_generic_toast);
                                            break;
                                        }
                                    }
                                }
                                dispatch(setSeparateField({ key: 'cachedReferralCoupon', value: '' }));
                            }
                        }
                        // Testing

                        dispatch(synchronizeCouponData());
                    } else {
                        // Assume valid visitor, check
                        const isVisitorTokenValid = await verifyTokenVisitor(user.headers, user.x_token_visitor);
                        if (isVisitorTokenValid) {
                            // Visitor token valid, try to restore order session
                            dispatch(retrieveOrderSession(cityServices, city, serviceFromQuery, service_already_in_order));

                            // Try to fetch addresses for the visitor
                            dispatch(fetchAndSetAddresses());
                        } else {
                            // Visitor token invalid, reset visitor session and order session
                            dispatch(resetOrderSession(serviceFromQuery));
                            dispatch(initVisitorSessionCity());

                            // Reset addresses
                            dispatch(_clearAddresses());
                        }
                    }
                } else {
                    // Order invalid anyway, checking tokens

                    if (user.isAuthenticated) {
                        // Assume valid user, check
                        const isUserTokenValid = await verifyTokenUser(user.headers, user.x_token_user);
                        if (isUserTokenValid) {
                            // User is validly signed in, changing selected city and resetting order session
                            dispatch(setSelectedCity({ selectedCity: city.name, selectedCityID: city.id }));
                            dispatch(resetOrderSession(serviceFromQuery));

                            // Try to fetch addresses for the visitor
                            dispatch(fetchAndSetAddresses());

                            // Try and fetch cards
                            dispatch(fetchAndSetCards());
                        } else {
                            // User session "expired", set selected city, reset order session and prompt sign in
                            dispatch(setSelectedCity({ selectedCity: city.name, selectedCityID: city.id }));
                            dispatch(unsetSaveUser());
                            dispatch(resetOrderSession(serviceFromQuery));

                            toast.warning(session_expired_toast);

                            dispatch(_toggleMenu({ menu: 'signUpMenuOpen', isOpen: true }));
                            dispatch(_pushToOverlayActionStack('signUpMenuOpen'));

                            // Reset addresses
                            dispatch(_clearAddresses());

                            // Reset cards
                            dispatch(_clearCards());
                        }
                    } else {
                        // Assume valid visitor, check
                        const isVisitorTokenValid = await verifyTokenVisitor(user.headers, user.x_token_visitor);
                        if (isVisitorTokenValid) {
                            // Visitor token valid, set selected city, reset order session
                            dispatch(setSelectedCity({ selectedCity: city.name, selectedCityID: city.id }));
                            dispatch(resetOrderSession(serviceFromQuery));

                            // Try to fetch addresses for an old visitor
                            dispatch(fetchAndSetAddresses());
                        } else {
                            // Visitor token invalid, set selected city, reset user state and order session
                            dispatch(setSelectedCity({ selectedCity: city.name, selectedCityID: city.id }));
                            dispatch(resetOrderSession(serviceFromQuery));
                            dispatch(initVisitorSessionCity());

                            // Reset addresses
                            dispatch(_clearAddresses());
                        }
                    }
                }
            }
        } catch (err) {
            console.log(err);
            dispatch(setSelectedCity({ selectedCity: city.name, selectedCityID: city.id }));
            dispatch(resetOrderSession(serviceFromQuery));
            dispatch(initVisitorSessionCity());
        }
    };

export const initAccountSession = pushRedirectCallback => async (dispatch, getState) => {
    const { user, order } = getState();
    try {
        if (!user || !user.x_token_user || !user.isAuthenticated) {
            return pushRedirectCallback('/');
        } else if (user.x_token_user && user.isAuthenticated) {
            const isUserTokenValid = await verifyTokenUser(user.headers, user.x_token_user);

            if (isUserTokenValid) {
                // Clear modals
                dispatch(_toggleMenu({ menu: 'accountSidenavMenuOpen', isOpen: false }));
                dispatch(_removeFromOverlayActionStack('accountSidenavMenuOpen'));

                // Try to fetch addresses
                dispatch(fetchAndSetAddresses());

                // Try to fetch cards
                dispatch(fetchAndSetCards());

                // Sync coupons
                dispatch(synchronizeCouponData());
            } else {
                // User session "expired", reset order session and prompt sign in
                dispatch(unsetSaveUser());
                dispatch(resetOrderSession());

                dispatch(ClearAllMenusAndModals());

                dispatch(_toggleMenu({ menu: 'signUpMenuOpen', isOpen: true }));
                dispatch(_pushToOverlayActionStack('signUpMenuOpen'));

                // Reset addresses
                dispatch(_clearAddresses());

                // Reset cards
                dispatch(_clearCards());

                // Redirect
                pushRedirectCallback('/');
            }
        }
    } catch (err) {
        console.log(err);
        pushRedirectCallback('/');
    }
};

export const initVisitorSessionCity = () => async (dispatch, getState) => {
    try {
        const { user } = getState();

        const { visitor } = await registerVisitor(user.headers);

        dispatch(setVisitorSession(visitor));
    } catch (err) {
        console.log(err);
    }
};

export const signUpUser = (payload, resetFormCallback, error_occured_toast, already_exists_toast) => async (dispatch, getState) => {
    dispatch(
        _setIsLoading({
            loadingAction: 'isSignUpLoading',
            isLoading: true,
        })
    );

    try {
        const state = getState();

        const { user } = await registerUser(state.user.headers, state.user.x_token_visitor, {
            user: payload,
        });

        // Facebook pixel track sign up
        const paramsObject = {
            user_email: payload.email,
        };

        if (state.order && state.order.services && state.order.services.length > 0) {
            paramsObject.content_name = state.order.services[0].type;
        }

        fbq.event('CompleteRegistration', paramsObject);

        dispatch(_setPhoneNumberForConfirmation(payload.phone_number));

        await recieveConfirmationCode(user.headers, user.x_token_visitor, {
            user: {
                phone_number: payload.phone_number,
            },
        });

        dispatch(
            _setIsLoading({
                loadingAction: 'isSignUpLoading',
                isLoading: false,
            })
        );

        dispatch(
            _setError({
                errorField: 'signUpError',
                status: '',
            })
        );

        resetFormCallback();

        dispatch(_toggleMenu({ menu: 'confirmationCodeMenuOpen', isOpen: true }));
        dispatch(_pushToOverlayActionStack('confirmationCodeMenuOpen'));
    } catch (err) {
        dispatch(
            _setError({
                errorField: 'signUpError',
                status: err.toString(),
            })
        );
        dispatch(
            _setIsLoading({
                loadingAction: 'isSignUpLoading',
                isLoading: false,
            })
        );
        if (err.response && err.response.data && err.response.data.errors[0].code === 'already_exists') {
            toast.error(already_exists_toast);
        } else {
            toast.error(error_occured_toast);
        }
        console.log(err);
    }
};

export const verifyPhoneNumber = phone_not_exist_toast => async (dispatch, getState) => {
    dispatch(
        _setIsLoading({
            loadingAction: 'isPhoneVerificationLoading',
            isLoading: true,
        })
    );

    try {
        const { user } = getState();

        await recieveConfirmationCode(user.headers, user.x_token_visitor, {
            user: {
                phone_number: user.phone_number_for_confirmation,
            },
        });

        dispatch(
            _setIsLoading({
                loadingAction: 'isPhoneVerificationLoading',
                isLoading: false,
            })
        );

        dispatch(
            _setError({
                errorField: 'phoneVerificationError',
                status: '',
            })
        );

        dispatch(_toggleMenu({ menu: 'confirmationCodeMenuOpen', isOpen: true }));
        dispatch(_pushToOverlayActionStack('confirmationCodeMenuOpen'));
    } catch (err) {
        dispatch(
            _setError({
                errorField: 'phoneVerificationError',
                status: '',
            })
        );
        dispatch(
            _setIsLoading({
                loadingAction: 'isPhoneVerificationLoading',
                isLoading: false,
            })
        );
        toast.error(phone_not_exist_toast);
        console.log(err);
    }
};

export const signInUser =
    (
        payload,
        signInSuccess_toast,
        incorrect_confirmation_code_toast,
        coupon_added_toast,
        coupon_not_valid_toast,
        coupon_duplicate_toast,
        coupon_error_generic_toast,
        coupon_has_expired,
        coupon_is_not_active_yet,
        user_already_ordered,
        user_has_referral_coupon,
        user_identical_to_sponsor
    ) =>
    async (dispatch, getState) => {
        dispatch(
            _setIsLoading({
                loadingAction: 'isSignInLoading',
                isLoading: true,
            })
        );
        try {
            const state = getState();

            const { user } = await signinUser(state.user.headers, state.user.x_token_visitor, payload);

            dispatch(setSaveUser(user));

            dispatch(
                _setIsLoading({
                    loadingAction: 'isSignInLoading',
                    isLoading: false,
                })
            );

            dispatch(_setPhoneNumberForConfirmation(''));

            dispatch(
                _setError({
                    errorField: 'signInError',
                    status: '',
                })
            );

            dispatch(_toggleMenu({ menu: 'signUpMenuOpen', isOpen: false }));
            dispatch(_removeFromOverlayActionStack('signUpMenuOpen'));
            dispatch(_toggleMenu({ menu: 'confirmationCodeMenuOpen', isOpen: false }));
            dispatch(_removeFromOverlayActionStack('confirmationCodeMenuOpen'));

            // Fetch addresses after signing in
            dispatch(fetchAndSetAddresses());

            // Fetch cards after signing in
            dispatch(fetchAndSetCards());

            // Success toast
            toast.success(signInSuccess_toast);

            // Testing
            if (state.user.cachedReferralCoupon) {
                try {
                    const data = await addCoupon(user.headers, user.x_token_user, state.user.cachedReferralCoupon);

                    toast.success(coupon_added_toast);
                    dispatch(setSeparateField({ key: 'cachedReferralCoupon', value: '' }));
                } catch (err) {
                    if (err.response && err.response.data && err.response.data.errors[0].code) {
                        switch (err.response.data.errors[0].code) {
                            case 'coupon_is_duplicate': {
                                toast.warning(coupon_duplicate_toast);
                                break;
                            }
                            case 'not_found': {
                                toast.error(coupon_not_valid_toast);
                                break;
                            }
                            case 'coupon_has_expired': {
                                toast.error(coupon_has_expired);
                                break;
                            }
                            case 'coupon_is_not_active_yet': {
                                toast.warning(coupon_is_not_active_yet);
                                break;
                            }
                            case 'user_already_ordered': {
                                toast.error(user_already_ordered);
                                break;
                            }
                            case 'user_has_referral_coupon': {
                                toast.error(user_has_referral_coupon);
                                break;
                            }
                            case 'user_identical_to_sponsor': {
                                toast.error(user_identical_to_sponsor);
                                break;
                            }
                            default: {
                                toast.error(coupon_error_generic_toast);
                                break;
                            }
                        }
                        err.response.data.errors[0].code === 'already_exists';
                    }
                    dispatch(setSeparateField({ key: 'cachedReferralCoupon', value: '' }));
                }
            }

            dispatch(synchronizeCouponData());

            // if (state.ui.overlayActionsStack.includes('bookingMenuOpen')) {
            //     dispatch(_toggleMenu({ menu: 'validatePaymentConfirmOrderMenuOpen', isOpen: true }));
            //     dispatch(_pushToOverlayActionStack('validatePaymentConfirmOrderMenuOpen'));
            // }
        } catch (err) {
            dispatch(
                _setError({
                    errorField: 'signInError',
                    status: err.toString(),
                })
            );
            dispatch(
                _setIsLoading({
                    loadingAction: 'isSignInLoading',
                    isLoading: false,
                })
            );
            toast.error(incorrect_confirmation_code_toast);
            console.log(err);
        }
    };

export const synchronizeCouponData = () => async (dispatch, getState) => {
    const state = getState();
    try {
        const data = await detailUser(state.user.headers, state.user.x_token_user);

        dispatch(
            setSeparateField({
                key: 'coupon',
                value: data.user.coupon,
            })
        );

        dispatch(
            setSeparateField({
                key: 'earned_amount',
                value: data.user.earned_amount,
            })
        );

        dispatch(
            setSeparateField({
                key: 'pending_amount',
                value: data.user.pending_amount,
            })
        );
    } catch (err) {
        console.log(err);
    }
};

export const signOutUser = redirectCallback => async (dispatch, getState) => {
    dispatch(
        _setIsLoading({
            loadingAction: 'isSignOutLoading',
            isLoading: true,
        })
    );
    try {
        const state = getState();

        await signoutUser(state.user.headers, state.user.x_token_user);

        dispatch(unsetSaveUser());

        dispatch(
            _setIsLoading({
                loadingAction: 'isSignOutLoading',
                isLoading: false,
            })
        );
        dispatch(
            _setError({
                errorField: 'signOutError',
                status: '',
            })
        );

        // Clear addresses
        dispatch(_clearAddresses());

        // Clear cards
        dispatch(_clearCards());

        dispatch(_resetOrderSession());

        dispatch(initVisitorSessionCity());

        redirectCallback();
    } catch (err) {
        dispatch(
            _setError({
                errorField: 'signOutError',
                status: err.toString(),
            })
        );
        dispatch(
            _setIsLoading({
                loadingAction: 'isSignOutLoading',
                isLoading: false,
            })
        );
        console.log(err);
    }
};

export default userSlice.reducer;
