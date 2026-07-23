export const loadStateLS = stateKey => {
    if (typeof localStorage !== 'undefined') {
        try {
            const serializedState = localStorage.getItem(stateKey);
            if (serializedState === null) return undefined;

            const parsedState = JSON.parse(serializedState);

            if (parsedState.totalOrderPrice === undefined && stateKey === 'order') return undefined;

            return parsedState;
        } catch (err) {
            return undefined;
        }
    }
    return null;
};

export const saveStateLS = (stateValue, stateKey) => {
    if (typeof localStorage !== 'undefined') {
        try {
            const serializedState = JSON.stringify(stateValue);

            localStorage.setItem(stateKey, serializedState);
        } catch (err) {
            console.log(err);
        }
    }
    return null;
};

export const loadStateSS = stateKey => {
    try {
        const serializedState = sessionStorage.getItem(stateKey);
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};

export const saveStateSS = (stateValue, stateKey) => {
    try {
        const serializedState = JSON.stringify(stateValue);

        sessionStorage.setItem(stateKey, serializedState);
    } catch (err) {
        console.log(err);
    }
};
