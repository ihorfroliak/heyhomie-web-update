/* eslint-disable no-useless-return */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-dupe-keys */
/* eslint-disable import/no-cycle */
/* eslint-disable no-else-return */
import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import {
    calculatePriceForOrder,
    confirmOrder,
    createOrderSession,
    createServiceForOrder,
    deleteServiceFromOrder,
    editServiceForOrder,
    getAllServicesForOrder,
} from '../../api/endpoints/orders';
import { loadStateLS, saveStateLS } from '../loadState';

// Toasts
import { ClearAllMenusAndModals, _pushToOverlayActionStack, _toggleMenu } from './uiSlice';

import { setSelectedCity } from './userSlice';

// Facebook Pixel
import * as fbq from '../fpixel';

const defaultState = {
    // Default, needed for the UI to render correctly
    city_id: '',
    id: '',
    expires_at: '',
    services: [],
    isSyncConfigLoading: false,
    syncConfigErrors: '',
    confirmOrderLoading: false,
    totalOrderPrice: {},
};

const setUpOrderInitialState = () => {
    if (typeof window !== 'undefined') {
        const loadedOrder = loadStateLS('order');
        if (!loadedOrder) {
            return defaultState;
        } else {
            return loadedOrder;
        }
    } else {
        return defaultState;
    }
};

const orderExample = {
    city_id: 1,
    id: 1234,
    expires_at: 1111111,
    isSyncConfigLoading: false,
    syncConfigErrors: '',
    services: [
        {
            homie_service_id: 123,
            city_id: 1,
            type: 'massage',
            icon_image: 'url',
            // Local service status:
            // staging - added to state but not the order session
            // added - added on the order session
            // configModified - service exist in the order session, but config was modified
            statusLocal: ['staging', 'added', 'configModified'],
            // Services config container card
            cardExpanded: false,
            // Triggers removing from state with animation
            isDeleted: false,
            // If the service is added/updated and if there are any errors
            isLoading: false,
            loadingError: '',
            // After being "added" - comes from the API
            id: 69,
            status: 'ordering',
            // Parameters for the order, come from the services for a city
            // In the future should contain the data from the './api/servicesConfig.js'
            available_params: {
                // Common params
                opening_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
                opening_hour: 8,
                closing_hour: 20,
                minimum_bookable_hour: 12,
                // specific params - LOCAL for now
                // Massage
                // Nails
                // Flowers
                // Cleaning
            },
            // Set in the services config container - all required for a service to be "added"
            config: {
                // Common configurations
                frequency: 'once',
                // Specific configurations
                // Massage:
                plan: 'string',
                quantity: 'number',
                massage_duration: 'number',
                massage_preferred_therapist_gender: 'string',
                massage_fallback_to_any_gender: 'boolean',
                // Nails:
                plan: 'string',
                nails_polishing: 'boolean',
                nails_hybrid: 'boolean',
                nails_gel: 'boolean',
                nails_gel_removal: 'boolean',
                // Flowers:
                plan: 'string',
                quantity: 'number',
                // Cleaning:
                plan: 'string',
                cleaning_house_size: 'number',
                cleaning_windows_quantity: 'number',
                cleaning_ironing_items: 'number (batch of 10)',
            },
            // Set in the SelectAddressSubmenu
            address: {
                // Send to the API when creating service on the order
                address_id: 120,
                // NB! Recieved from the API
                address_name: 'Home',
            },
            // Set in the DatepickerSubmenu
            date_time: {
                // Date and time of the first mission
                mission_date: 1608135386,
                // Booking day	"monday" / "tuesday" / ...
                frequent_mission_day: '',
                // Booking time	0-24
                frequent_mission_time: '',
            },
            // Set in the AddCommentSubmenu
            user_comment: '',
        },
    ],
};

const orderSlice = createSlice({
    name: 'order',
    initialState: setUpOrderInitialState(),
    reducers: {
        _setOrderSession(state, action) {
            const { id, city_id, expires_at } = action.payload;
            state.id = id;
            state.city_id = city_id;
            state.expires_at = expires_at;
        },
        _resetOrderSession(state) {
            state.city_id = '';
            state.id = '';
            state.expires_at = '';
            state.services = [];
            state.isSyncConfigLoading = false;
            state.syncConfigErrors = '';
        },
        // Set / Reset services for order
        _setServicesForOrder(state, action) {
            state.services = [...action.payload];
        },
        // Set sync loading status
        _setSyncLoading(state, action) {
            state.isSyncConfigLoading = action.payload;
        },
        // Set sync errors
        _setSyncErrors(state, action) {
            state.syncConfigErrors = action.payload;
        },
        // Add & delete a service from state
        // Push service to the state
        _initService(state, action) {
            state.services.push(action.payload);
        },
        _setServiceLoading(state, action) {
            const { homie_service_id, isLoading } = action.payload;
            const index = state.services.findIndex(s => s.homie_service_id === homie_service_id);
            if (state.services[index]) {
                state.services[index].isLoading = isLoading;
            }
        },
        // Add service on the order session
        _setServiceAdded(state, action) {
            const { homie_service_id, idFromAPI } = action.payload;
            const index = state.services.findIndex(s => s.homie_service_id === homie_service_id);
            state.services[index].id = idFromAPI;
            state.services[index].statusLocal = 'added';
        },
        // Set service's statusLocal
        _setServiceStatusLocal(state, action) {
            const { homie_service_id, statusLocal } = action.payload;
            const index = state.services.findIndex(s => s.homie_service_id === homie_service_id);
            state.services[index].statusLocal = statusLocal;
        },
        // Update the service
        _updateService(state, action) {
            const { serviceID, updatedData } = action.payload;
            const index = state.services.findIndex(s => s.id === serviceID);
            state.services[index] = { ...state.services[index], ...updatedData };
        },
        // Set service address
        _setServiceAddress(state, action) {
            const { serviceID, addressObject } = action.payload;
            const index = state.services.findIndex(s => s.id === serviceID);
            state.services[index].address = addressObject;
        },
        // Set service date and time
        _setServiceDatetime(state, action) {
            const { serviceID, dateTimeObject } = action.payload;
            const index = state.services.findIndex(s => s.id === serviceID);
            state.services[index].date_time = dateTimeObject;
        },
        _setServiceComment(state, action) {
            const { serviceID, comment } = action.payload;
            const index = state.services.findIndex(s => s.id === serviceID);
            state.services[index].user_comment = comment;
        },
        // Set deleted to trigger deleting animations
        _setServiceDeleted(state, action) {
            const { homie_service_id } = action.payload;
            const index = state.services.findIndex(s => s.homie_service_id === homie_service_id);
            state.services[index].isDeleted = true;
        },
        // Remove from the State
        _removeService(state, action) {
            state.services = state.services.filter(s => s.homie_service_id !== action.payload);
        },
        // Order UI
        _toggleServiceConfigCardExpanded(state, action) {
            const { homie_service_id, expanded } = action.payload;
            const index = state.services.findIndex(s => s.homie_service_id === homie_service_id);
            state.services[index].cardExpanded = expanded;
        },
        _closeAllServiceConfigCards(state) {
            if (state.services.length > 0) {
                for (let i = 0; i < state.services.length; i++) {
                    state.services[i].cardExpanded = false;
                }
            }
        },
        // Order config
        _setServiceConfigItem(state, action) {
            const { homie_service_id, field, value } = action.payload;
            const index = state.services.findIndex(s => s.homie_service_id === homie_service_id);
            state.services[index].config[field] = value;
        },
        // Confirm order loading
        _setConfirmOrderLoading(state, action) {
            state.confirmOrderLoading = action.payload;
        },
        // Count total order price
        // TODO: add array that contains all the prices of the services and their ids
        _incrementTotalOrderPrice(state, action) {
            state.totalOrderPrice[action.payload.homie_service_id] = { price: action.payload.price, hours: action.payload.hours };
        },
        _decrementTotalOrderPrice(state, action) {
            state.totalOrderPrice[action.payload.homie_service_id] = { price: 0 };
        },
    },
});

export const {
    _setOrderSession,
    _resetOrderSession,
    _setServicesForOrder,
    _setSyncLoading,
    _setSyncErrors,
    _initService,
    _setServiceLoading,
    _setServiceAdded,
    _setServiceStatusLocal,
    _updateService,
    _setServiceAddress,
    _setServiceDatetime,
    _setServiceDeleted,
    _removeService,
    _toggleServiceConfigCardExpanded,
    _closeAllServiceConfigCards,
    _setServiceConfigItem,
    _setConfirmOrderLoading,
    _incrementTotalOrderPrice,
    _decrementTotalOrderPrice,
} = orderSlice.actions;

// Persist order id and expires_at in the localStorage
export const setOrderSession = order => (dispatch, getState) => {
    let loadedOrder = loadStateLS('order');
    if (!loadedOrder) saveStateLS(defaultState, 'order');
    loadedOrder = loadStateLS('order');

    const workingState = { ...loadedOrder, ...order };

    saveStateLS(workingState, 'order');

    dispatch(_setOrderSession(order));
};

export const resetOrderSession = serviceFromQuery => async (dispatch, getState) => {
    const { order } = getState();

    let loadedOrder = loadStateLS('order');
    if (!loadedOrder) saveStateLS(defaultState, 'order');
    loadedOrder = loadStateLS('order');
    saveStateLS(defaultState, 'order');
    dispatch(_resetOrderSession());

    if (serviceFromQuery) {
        dispatch(initOrderSession(serviceFromQuery));
    }
};

export const initOrderSession = serviceFromQuery => async (dispatch, getState) => {
    try {
        const { user } = getState();

        const state = getState();

        const { order } = await createOrderSession(user.headers, user.x_token_user, user.x_token_visitor, { city_id: user.selectedCityID });

        dispatch(setOrderSession(order));

        if (serviceFromQuery) {
            dispatch(initService(serviceFromQuery));
        }
    } catch (err) {
        console.log(err);
    }
};

export const retrieveOrderSession = (cityServices, city, serviceFromQuery, service_already_in_order) => async (dispatch, getState) => {
    try {
        const { order, user } = getState();

        if (user.selectedCity !== city.name) {
            dispatch(_toggleMenu({ menu: `isRedirectToUnfinishedOrResetOrderModalOpen`, isOpen: true }));
            dispatch(_pushToOverlayActionStack(`isRedirectToUnfinishedOrResetOrderModalOpen`));

            return;
        }

        const { services } = await getAllServicesForOrder(user.headers, user.x_token_user, user.x_token_visitor, order.id);

        if (services && services.length > 0) {
            const servicesFined = services.map(service => {
                const cityService = cityServices.find(s => s.name === service.type);

                const workingObject = {
                    // Self-assigned data
                    statusLocal: 'added',
                    isLoading: false,
                    cardExpanded: false,
                    // Data from API
                    id: service.id,
                    city_id: service.city_id,
                    type: service.type,
                    status: service.status,
                    user_comment: service.user_comment,
                    address: {
                        address_id: service.address_id,
                        address_name: service.address_name,
                    },
                    date_time: {
                        mission_date: service.mission_date,
                        frequent_mission_day: service.frequent_mission_day,
                        frequent_mission_time: service.frequent_mission_time,
                    },
                    // Data from cityServices
                    icon_image: cityService.icon_image,
                    homie_service_id: cityService.id,
                    available_params: {
                        opening_days: cityService.opening_days,
                        opening_hour: cityService.opening_hour,
                        closing_hour: cityService.closing_hour,
                        minimum_bookable_hour: cityService.minimum_bookable_hour,
                    },
                };
                const configFromAPI = {};
                Object.keys(service).forEach(key => {
                    if (
                        key !== 'id' &&
                        key !== 'type' &&
                        key !== 'status' &&
                        key !== 'city_id' &&
                        key !== 'address_id' &&
                        key !== 'address_name' &&
                        key !== 'mission_date' &&
                        key !== 'frequent_mission_day' &&
                        key !== 'frequent_mission_time'
                    ) {
                        configFromAPI[key] = service[key];
                    }
                });

                workingObject.config = { ...configFromAPI };

                return workingObject;
            });

            dispatch(_setServicesForOrder(servicesFined));
            // if (user.selectedCity !== city.name) {
            //     dispatch(_toggleMenu({menu: `isRedirectToUnfinishedOrResetOrderModalOpen`, isOpen: true}));
            //     dispatch(_pushToOverlayActionStack(`isRedirectToUnfinishedOrResetOrderModalOpen`));
            // }
        } else {
            dispatch(_setServicesForOrder([]));
            if (user.selectedCity !== city.name) {
                dispatch(setSelectedCity({ selectedCity: city.name, selectedCityID: city.id }));
                dispatch(resetOrderSession(serviceFromQuery));
            }
        }

        if (serviceFromQuery && cityServices.find(s => s.name === serviceFromQuery.type) && cityServices.find(s => s.name === serviceFromQuery.type).open) {
            if (services.findIndex(s => s.type === serviceFromQuery.type) === -1) {
                if (order && (!order.id || Math.round(new Date() / 1000) >= order.expires_at)) {
                    dispatch(initOrderSession(serviceFromQuery));
                } else {
                    dispatch(initService(serviceFromQuery));
                }
            } else {
                toast.warning(service_already_in_order);
            }
        }
    } catch (err) {
        dispatch(_setServicesForOrder([]));
        dispatch(setSelectedCity({ selectedCity: city.name, selectedCityID: city.id }));
        dispatch(resetOrderSession());
        console.log(err);
    }
};

export const initService = service => (dispatch, getState) => {
    dispatch(_initService(service));
};

// Set service config item and mark modified if needed
export const setServiceConfigItem = idFieldValueObj => (dispatch, getState) => {
    const { homie_service_id } = idFieldValueObj;
    const state = getState();

    const index = state.order.services.findIndex(s => s.homie_service_id === homie_service_id);

    if (state.order.services[index].statusLocal && state.order.services[index].statusLocal === 'added') {
        dispatch(
            _setServiceStatusLocal({
                homie_service_id,
                statusLocal: 'configModified',
            })
        );
    }

    dispatch(_setServiceConfigItem(idFieldValueObj));
};

// Add staging services, update added services, synchronize localStorage, and open the BookingMenu
export const synchronizeServicesConfig = error_occured_toast => async (dispatch, getState) => {
    const state = getState();

    try {
        dispatch(_setSyncLoading(true));

        // iterate over the services to add/updated
        await state.order.services.reduce(async (promise, service) => {
            await promise;
            if (service.statusLocal === 'added') {
                return;
            } else if (service.statusLocal === 'staging') {
                const payload = {
                    service: {
                        homie_service_id: service.homie_service_id,
                        ...service.config,
                    },
                };

                dispatch(
                    _setServiceLoading({
                        homie_service_id: service.homie_service_id,
                        isLoading: true,
                    })
                );

                const data = await createServiceForOrder(state.user.headers, state.user.x_token_user, state.user.x_token_visitor, state.order.id, payload);

                const configFromAPI = {};
                Object.keys(data.service).forEach(key => {
                    if (
                        key !== 'id' &&
                        key !== 'type' &&
                        key !== 'status' &&
                        key !== 'city_id' &&
                        key !== 'address_id' &&
                        key !== 'address_name' &&
                        key !== 'mission_date' &&
                        key !== 'frequent_mission_day' &&
                        key !== 'frequent_mission_time'
                    ) {
                        configFromAPI[key] = data.service[key];
                    }
                });

                const updatedData = {
                    status: data.service.status,
                    config: { ...configFromAPI },
                    address: {
                        address_id: data.service.address_id,
                        address_name: data.service.address_name,
                    },
                    date_time: {
                        mission_date: data.service.mission_date,
                        frequent_mission_day: data.service.frequent_mission_day,
                        frequent_mission_time: data.service.frequent_mission_time,
                    },
                    user_comment: data.service.user_comment,
                };

                dispatch(
                    _setServiceAdded({
                        homie_service_id: service.homie_service_id,
                        idFromAPI: data.service.id,
                    })
                );

                dispatch(
                    _updateService({
                        serviceID: data.service.id,
                        updatedData,
                    })
                );

                dispatch(
                    _setServiceLoading({
                        homie_service_id: service.homie_service_id,
                        isLoading: false,
                    })
                );
            } else if (service.statusLocal === 'configModified') {
                const payload = {
                    service: {
                        id: service.id,
                        ...service.config,
                    },
                };

                dispatch(
                    _setServiceLoading({
                        homie_service_id: service.homie_service_id,
                        isLoading: true,
                    })
                );

                const data = await editServiceForOrder(state.user.headers, state.user.x_token_user, state.user.x_token_visitor, state.order.id, payload);

                const configFromAPI = {};
                Object.keys(data.service).forEach(key => {
                    if (
                        key !== 'id' &&
                        key !== 'type' &&
                        key !== 'status' &&
                        key !== 'city_id' &&
                        key !== 'address_id' &&
                        key !== 'address_name' &&
                        key !== 'mission_date' &&
                        key !== 'frequent_mission_day' &&
                        key !== 'frequent_mission_time'
                    ) {
                        configFromAPI[key] = data.service[key];
                    }
                });

                const updatedData = {
                    status: data.service.status,
                    config: { ...configFromAPI },
                    address: {
                        address_id: data.service.address_id,
                        address_name: data.service.address_name,
                    },
                    date_time: {
                        mission_date: data.service.mission_date,
                        frequent_mission_day: data.service.frequent_mission_day,
                        frequent_mission_time: data.service.frequent_mission_time,
                    },
                    user_comment: data.service.user_comment,
                };

                dispatch(
                    _setServiceStatusLocal({
                        homie_service_id: service.homie_service_id,
                        statusLocal: 'added',
                    })
                );

                dispatch(
                    _updateService({
                        serviceID: service.id,
                        updatedData,
                    })
                );

                dispatch(
                    _setServiceLoading({
                        homie_service_id: service.homie_service_id,
                        isLoading: false,
                    })
                );
            }
        }, Promise.resolve());

        dispatch(_setSyncLoading(false));
        dispatch(_setSyncErrors(''));

        state.order.services.forEach(service => {
            dispatch(
                _toggleServiceConfigCardExpanded({
                    homie_service_id: service.homie_service_id,
                    expanded: false,
                })
            );
        });

        dispatch(_toggleMenu({ menu: 'bookingMenuOpen', isOpen: true }));
        dispatch(_pushToOverlayActionStack('bookingMenuOpen'));
    } catch (err) {
        const errorCode = err.response.data.errors[0]?.code;
        console.log('errorCode: ', errorCode);
        dispatch(_setSyncLoading(false));
        state.order.services.forEach(service => {
            dispatch(
                _setServiceLoading({
                    homie_service_id: service.homie_service_id,
                    isLoading: false,
                })
            );
        });
        dispatch(_setSyncErrors(err));
        toast.error(error_occured_toast(`${errorCode ? `${errorCode}` : 'error_occured_toast'}`));
        console.log(err);
    }
};

// Set service's address
export const setServiceAddress = addressObj => async (dispatch, getState) => {
    try {
        console.log(addressObj);
    } catch (err) {
        console.log(err);
    }
};

// Set service's date and time
export const setServiceDateTime = dateTimeObj => async (dispatch, getState) => {
    try {
        console.log(dateTimeObj);
    } catch (err) {
        console.log(err);
    }
};

// Delete service from order and state, synchronize localStorage
export const deleteServiceFromOrderAndState = (service, error_deleting_service_toast) => async (dispatch, getState) => {
    const state = getState();
    try {
        dispatch(
            _setServiceLoading({
                homie_service_id: service.homie_service_id,
                isLoading: true,
            })
        );

        const res = await deleteServiceFromOrder(state.user.headers, state.user.x_token_user, state.user.x_token_visitor, state.order.id, service.id);

        if (!res) throw new Error();

        dispatch(
            _setServiceDeleted({
                homie_service_id: service.homie_service_id,
            })
        );

        dispatch(
            _setServiceLoading({
                homie_service_id: service.homie_service_id,
                isLoading: false,
            })
        );
    } catch (err) {
        dispatch(
            _setServiceLoading({
                homie_service_id: service.homie_service_id,
                isLoading: false,
            })
        );
        toast.error(error_deleting_service_toast);
        console.log(err);
    }
};

export const confirmOrderClearOrderState = (order_success_toast, error_occured_toast, redirectCallback) => async (dispatch, getState) => {
    const state = getState();
    try {
        dispatch(_setConfirmOrderLoading(true));

        // Calculate prices and trigger Facebook pixel event
        const { service_prices } = await calculatePriceForOrder(state.user.headers, state.user.x_token_user, state.user.x_token_visitor, state.order.id);

        const totalPrice =
            service_prices &&
            service_prices.reduce((acc, currentValue) => {
                return acc + currentValue.price;
            }, 0);

        const notDefaultCardPayment = state.cards.cards.find(
            card => card.default === true && (card.id === state.cards.cards[0].id || card.id === state.cards.cards[1].id)
        );

        const res = await confirmOrder(state.user.headers, state.user.x_token_user, state.order.id, notDefaultCardPayment);

        if (!res) throw new Error();

        // Trigger Facebook Pixel event
        fbq.event('Purchase', {
            currency: 'PLN',
            value: totalPrice,
        });

        toast.success(order_success_toast);

        dispatch(_setConfirmOrderLoading(false));

        dispatch(ClearAllMenusAndModals());

        dispatch(resetOrderSession());

        redirectCallback();

        dispatch(_toggleMenu({ menu: `referralMenuOpen`, isOpen: true }));
        dispatch(_pushToOverlayActionStack(`referralMenuOpen`));
    } catch (err) {
        dispatch(_setConfirmOrderLoading(false));
        toast.error(error_occured_toast);
        console.log(err);
    }
};

export default orderSlice.reducer;
