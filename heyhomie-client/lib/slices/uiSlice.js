/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import { createSelector, createSlice } from '@reduxjs/toolkit';

const initialState = {
    isConfiguringService: false,
    overlayOpen: false,
    overlayAction: '',
    overlayActionsStack: [],
    profileMenuOpen: false,
    signUpMenuOpen: false,
    confirmationCodeMenuOpen: false,
    paymentMethodMenuOpen: false,
    addCardSubmenuOpen: false,
    bookingMenuOpen: false,
    datePickerSubmenuOpen: false,
    selectAddressMenuOpen: false,
    modalOpen: false,
    modalContent: '',
};

const uiSlice = createSlice({
    name: 'ui',
    initialState: initialState,
    reducers: {
        _setOverlayAction(state, action) {
            state.overlayAction = action.payload;
        },
        _openOverlayWithAction(state, action) {
            state.overlayAction = action.payload;
            state.overlayOpen = true;
        },
        _pushToOverlayActionStack(state, action) {
            state.overlayActionsStack.push(action.payload);
        },
        _removeFromOverlayActionStack(state, action) {
            state.overlayActionsStack = state.overlayActionsStack.filter(a => a !== action.payload);
        },
        _clearOverOverlayActionStack(state) {
            state.overlayActionsStack = [];
        },
        _openOverlayWithPush(state, action) {
            state.overlayActionsStack = [...state.overlayActionsStack, action.payload];
            state.overlayOpen = true;
        },
        _closeOverlay(state, action) {
            state.overlayOpen = false;
        },
        _toggleMenu(state, action) {
            const { menu, isOpen } = action.payload;
            if (!isOpen) {
                state.overlayActionsStack = state.overlayActionsStack.filter(a => a !== menu);
            }
            state[menu] = isOpen;
        },
    },
});

export const {
    _openOverlayWithAction,
    _closeOverlay,
    _toggleMenu,
    _openOverlayWithPush,
    _pushToOverlayActionStack,
    _removeFromOverlayActionStack,
    _clearOverOverlayActionStack,
} = uiSlice.actions;

export const ClearAllMenusAndModals = () => (dispatch, getState) => {
    const state = getState();
    for (let i = 0; i < state.ui.overlayActionsStack.length; i++) {
        dispatch(
            _toggleMenu({
                menu: state.ui.overlayActionsStack[i],
                isOpen: false,
            })
        );
    }

    dispatch(_clearOverOverlayActionStack());
};

export const GoBack = () => (dispatch, getState) => {
    const state = getState();

    const lastInStack = state.ui.overlayActionsStack[state.ui.overlayActionsStack.length - 1];

    if (lastInStack) {
        dispatch(_toggleMenu({ menu: lastInStack, isOpen: false }));
        dispatch(_removeFromOverlayActionStack(lastInStack));
    }
};

export default uiSlice.reducer;
