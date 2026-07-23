/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import { createSlice } from '@reduxjs/toolkit';

// Toasts
import { toast } from 'react-toastify';
import { createAddress, listAllAddresses, deleteAddress, editAddressDetails } from '../../api/endpoints/addresses';
import { _removeFromOverlayActionStack, _toggleMenu } from './uiSlice';

const initialState = {
    // Data
    addresses: [],
    // UI - general
    isAddressesLoading: false,
    addressesLoadingError: '',
    // UI - add
    isAddAddressLoading: false,
    addAddressError: '',
    // UI - set default
    isEditAddressLoading: false,
    setEditAddressError: '',
    // UI - delete default
    isDeleteAddressLoading: false,
    deleteAddressError: '',
};

const addressExample = {
    id: 58,
    name: 'Home',
    line1: 'ul Studencka',
    line2: '',
    street_number: '17',
    house_number: '10',
    zip_code: '31-116',
    city: 'Kraków',
    state: 'Małypolskie',
    country: 'Polska',
    country_code: 'PL',
    additional_information: 'At the last floor on the right.',
};

const addressesSlice = createSlice({
    name: 'addresses',
    initialState: initialState,
    reducers: {
        _setAddresses(state, action) {
            state.addresses = [...action.payload];
        },
        _clearAddresses(state, action) {
            state.addresses = [];
        },
        _addAddressToState(state, action) {
            state.addresses.push(action.payload);
        },
        _updateAddress(state, action) {
            const { id, updatedData } = action.payload;
            const index = state.addresses.findIndex(address => address.id === id);
            state.addresses[index] = { ...updatedData };
        },
        _setAddressDeleted(state, action) {
            const { id } = action.payload;
            const index = state.addresses.findIndex(address => address.id === id);
            state.addresses[index].isDeleted = true;
        },
        _removeAddressFromState(state, action) {
            state.addresses = state.addresses.filter(address => address.id !== action.payload);
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

export const { _setAddresses, _clearAddresses, _addAddressToState, _updateAddress, _setAddressDeleted, _removeAddressFromState, _setIsLoading, _setError } =
    addressesSlice.actions;

export const fetchAndSetAddresses = () => async (dispatch, getState) => {
    const state = getState();
    try {
        dispatch(
            _setIsLoading({
                loadingAction: 'isAddressesLoading',
                isLoading: true,
            })
        );

        const { addresses } = await listAllAddresses(state.user.headers, state.user.x_token_user, state.user.x_token_visitor);

        if (addresses && addresses.length > 0) {
            dispatch(_setAddresses(addresses));
        } else {
            dispatch(_clearAddresses());
        }

        dispatch(
            _setError({
                errorField: 'addressesLoadingError',
                status: '',
            })
        );
        dispatch(
            _setIsLoading({
                loadingAction: 'isAddressesLoading',
                isLoading: false,
            })
        );
    } catch (err) {
        dispatch(
            _setIsLoading({
                loadingAction: 'isAddressesLoading',
                isLoading: false,
            })
        );
        dispatch(
            _setError({
                errorField: 'addressesLoadingError',
                status: err.toString(),
            })
        );
    }
};

export const addNewAddress = (addressToAdd, setAddressCalback) => async (dispatch, getState) => {
    const state = getState();
    try {
        dispatch(
            _setIsLoading({
                loadingAction: 'isAddAddressLoading',
                isLoading: true,
            })
        );

        const { address } = await createAddress(state.user.headers, state.user.x_token_user, state.user.x_token_visitor, addressToAdd);

        dispatch(_addAddressToState(address));

        setAddressCalback({
            address_id: address.id,
            address_name: address.name,
        });

        dispatch(
            _setError({
                errorField: 'addAddressError',
                status: '',
            })
        );
        dispatch(
            _setIsLoading({
                loadingAction: 'isAddAddressLoading',
                isLoading: false,
            })
        );
    } catch (err) {
        dispatch(
            _setIsLoading({
                loadingAction: 'isAddAddressLoading',
                isLoading: false,
            })
        );
        dispatch(
            _setError({
                errorField: 'addAddressError',
                status: err.toString(),
            })
        );
    }
};

export const addNewAddressMyAccount = (addressToAdd, successMsg, errorMsg) => async (dispatch, getState) => {
    const state = getState();
    try {
        dispatch(
            _setIsLoading({
                loadingAction: 'isAddAddressLoading',
                isLoading: true,
            })
        );

        const { address } = await createAddress(state.user.headers, state.user.x_token_user, '', addressToAdd);

        dispatch(_addAddressToState(address));

        dispatch(
            _setIsLoading({
                loadingAction: 'isAddAddressLoading',
                isLoading: false,
            })
        );
        toast.success(successMsg);
    } catch (err) {
        dispatch(
            _setIsLoading({
                loadingAction: 'isAddAddressLoading',
                isLoading: false,
            })
        );
        toast.error(errorMsg);
    }
};

export const updateAddress = (addressID, updatedData, successMsg, errorMsg) => async (dispatch, getState) => {
    const state = getState();
    try {
        dispatch(
            _setIsLoading({
                loadingAction: 'isEditAddressLoading',
                isLoading: true,
            })
        );

        const { address } = await editAddressDetails(state.user.headers, state.user.x_token_user, '', addressID, updatedData);

        dispatch(
            _updateAddress({
                id: addressID,
                updatedData: address,
            })
        );

        dispatch(
            _setIsLoading({
                loadingAction: 'isEditAddressLoading',
                isLoading: false,
            })
        );
        toast.success(successMsg);
    } catch (err) {
        dispatch(
            _setIsLoading({
                loadingAction: 'isEditAddressLoading',
                isLoading: false,
            })
        );
        toast.error(errorMsg);
    }
};

export const deleteAddressThunk = (id, successMsg, errorMsg) => async (dispatch, getState) => {
    const state = getState();
    try {
        dispatch(
            _setIsLoading({
                loadingAction: 'isDeleteAddressLoading',
                isLoading: true,
            })
        );

        const res = await deleteAddress(state.user.headers, state.user.x_token_user, '', id);

        if (res) {
            dispatch(_removeAddressFromState(id));

            dispatch(
                _setIsLoading({
                    loadingAction: 'isDeleteAddressLoading',
                    isLoading: false,
                })
            );

            toast.success(successMsg);
        }
    } catch (err) {
        dispatch(
            _setIsLoading({
                loadingAction: 'isDeleteAddressLoading',
                isLoading: false,
            })
        );
        console.log(err);
        toast.error(errorMsg);
    }
};

export default addressesSlice.reducer;
