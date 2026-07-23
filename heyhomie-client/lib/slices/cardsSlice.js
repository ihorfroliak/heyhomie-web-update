/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import { createSlice } from '@reduxjs/toolkit';

// Toasts
import { toast } from 'react-toastify';
import { createCard, deleteCard, listAllCards, setDefaultCard } from '../../api/endpoints/cards';
import { _removeFromOverlayActionStack, _toggleMenu } from './uiSlice';

const initialCardsState = [
    {
        id: 9999999999,
        brand: 'Pay Later',
        payment_method: 'pay_later',
        default: true,
    },
    {
        id: 9999999998,
        brand: 'Cash',
        payment_method: 'cash',
        default: false,
    },
];

const initialState = {
    // Data
    cards: [...initialCardsState],
    // UI - general
    isCardsLoading: false,
    cardsLoadingError: '',
    // UI - add
    isAddCardLoading: false,
    addCardError: '',
    // UI - set default
    isSetDeafultCardLoading: false,
    setDefaultCardError: '',
    // UI - delete default
    isDeleteCardLoading: false,
    deleteCardError: '',
};

const cardsSlice = createSlice({
    name: 'cards',
    initialState: initialState,
    reducers: {
        _setCards(state, action) {
            const newInitialState = initialCardsState.map(el => ({ ...el, default: false }));
            state.cards = [...newInitialState, ...action.payload];
        },
        _clearCards(state, action) {
            state.cards = [...initialCardsState];
        },
        _addCardToState(state, action) {
            state.cards.push(action.payload);
        },
        _setCardDefault(state, action) {
            const id = action.payload;

            const indexOldDefault = state.cards.findIndex(card => card.default === true);
            const indexNewDefault = state.cards.findIndex(card => card.id === id);

            if (indexOldDefault !== -1) {
                state.cards[indexOldDefault].default = false;
            }
            state.cards[indexNewDefault].default = true;
        },
        _setCardDeleted(state, action) {
            const { id } = action.payload;
            const index = state.cards.findIndex(card => card.id === id);
            state.cards[index].isDeleted = true;
        },
        _removeCardFromState(state, action) {
            state.cards = state.cards.filter(card => card.id !== action.payload);
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

export const { _setCards, _clearCards, _addCardToState, _setCardDefault, _setCardDeleted, _removeCardFromState, _setIsLoading, _setError } = cardsSlice.actions;

export const fetchAndSetCards = () => async (dispatch, getState) => {
    const state = getState();
    try {
        dispatch(
            _setIsLoading({
                loadingAction: 'isCardsLoading',
                isLoading: true,
            })
        );

        const { cards } = await listAllCards(state.user.headers, state.user.x_token_user);

        if (cards && cards.length > 0) {
            dispatch(_setCards(cards));
        } else {
            dispatch(_clearCards());
        }

        dispatch(
            _setError({
                errorField: 'cardsLoadingError',
                status: '',
            })
        );
        dispatch(
            _setIsLoading({
                loadingAction: 'isCardsLoading',
                isLoading: false,
            })
        );
    } catch (err) {
        dispatch(
            _setIsLoading({
                loadingAction: 'isCardsLoading',
                isLoading: false,
            })
        );
        dispatch(
            _setError({
                errorField: 'cardsLoadingError',
                status: err.toString(),
            })
        );
    }
};

export const setCardDefault = id => async (dispatch, getState) => {
    const state = getState();
    try {
        dispatch(
            _setIsLoading({
                loadingAction: 'isSetDeafultCardLoading',
                isLoading: true,
            })
        );

        if (id !== initialCardsState[0].id && id !== initialCardsState[1].id) {
            const { card } = await setDefaultCard(state.user.headers, state.user.x_token_user, id);
        }

        dispatch(_setCardDefault(id));

        dispatch(
            _setError({
                errorField: 'setDefaultCardError',
                status: '',
            })
        );
        dispatch(
            _setIsLoading({
                loadingAction: 'isSetDeafultCardLoading',
                isLoading: false,
            })
        );
    } catch (err) {
        dispatch(
            _setIsLoading({
                loadingAction: 'isSetDeafultCardLoading',
                isLoading: false,
            })
        );
        dispatch(
            _setError({
                errorField: 'setDefaultCardError',
                status: err.toString(),
            })
        );
    }
};

export const addNewCard = (token, errorOccuredToast, callback) => async (dispatch, getState) => {
    const state = getState();
    try {
        dispatch(
            _setIsLoading({
                loadingAction: 'isAddCardLoading',
                isLoading: true,
            })
        );

        const { card } = await createCard(state.user.headers, state.user.x_token_user, {
            card: {
                token,
            },
        });

        dispatch(_addCardToState(card));
        dispatch(setCardDefault(card.id));

        dispatch(
            _setError({
                errorField: 'addCardError',
                status: '',
            })
        );
        dispatch(
            _setIsLoading({
                loadingAction: 'isAddCardLoading',
                isLoading: false,
            })
        );

        callback && callback();
    } catch (err) {
        dispatch(
            _setIsLoading({
                loadingAction: 'isAddCardLoading',
                isLoading: false,
            })
        );
        dispatch(
            _setError({
                errorField: 'addCardError',
                status: err.toString(),
            })
        );
        toast.error(errorOccuredToast);
    }
};

export const deleteCardMyAccount = (id, errorOccuredToast) => async (dispatch, getState) => {
    const state = getState();
    try {
        dispatch(
            _setIsLoading({
                loadingAction: 'isDeleteCardLoading',
                isLoading: true,
            })
        );

        const res = await deleteCard(state.user.headers, state.user.x_token_user, id);

        if (res) {
            dispatch(_removeCardFromState(id));

            dispatch(
                _setIsLoading({
                    loadingAction: 'isDeleteCardLoading',
                    isLoading: false,
                })
            );
        }
    } catch (error) {
        dispatch(
            _setIsLoading({
                loadingAction: 'isDeleteCardLoading',
                isLoading: false,
            })
        );
        toast.error(errorOccuredToast);
    }
};

export default cardsSlice.reducer;
