import { configureStore, combineReducers, createAction } from '@reduxjs/toolkit';

import userReducer from './lib/slices/userSlice';
import uiReducer from './lib/slices/uiSlice';
import orderReducer from './lib/slices/orderSlice';
import addressesReducer from './lib/slices/addressesSlice';
import cardsReducer from './lib/slices/cardsSlice';

const rootReducer = combineReducers({
    user: userReducer,
    ui: uiReducer,
    order: orderReducer,
    addresses: addressesReducer,
    cards: cardsReducer,
});

export default configureStore({
    reducer: rootReducer,
    devTools: process.env.NEXT_PUBLIC_NODE_ENV !== 'production',
});

// NOTE: set devtools to false in production
