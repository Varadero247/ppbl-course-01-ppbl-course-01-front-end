import { createStore, action } from "easy-peasy";

const store = createStore({
    connection: {
        connected: null,
        setConnected: action((state, payload) => {
            state.connected = payload;
        }),
    },
    ownedUnsigs : {
        unsigIds: [],
        add: action((state, payload) => {
            state.unsigIds = payload;
        }),
    },
    myOffers : {
        unsigIds: [],
        add: action((state, payload) => {
            state.unsigIds = payload;
        }),
    },
    ownedUtxos : {
        utxos: [],
        add: action((state, payload) => {
            state.utxos = payload;
        }),
    },
});

export default store;