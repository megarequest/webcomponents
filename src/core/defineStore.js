import { signal, computed, effect } from '@preact/signals-core';

const stores = new Map();

export default function defineStore(name, storeFactory = () => {}) {
    if (stores.has(name)) {
        console.warn(`Store with name "${name}" already exists. Returning existing store.`);
        return stores.get(name);
    }

    const storeInstance = storeFactory({ signal, computed, effect });
    stores.set(name, storeInstance);

    return storeInstance;
}

export function useStore(name) {
    if (!stores.has(name)) {
        throw new Error(`Store with name "${name}" not found. Did you forget to define it?`);
    }
    return stores.get(name);
}

export function resetStore(name) {
    if (stores.has(name)) {
        const store = stores.get(name);
        if (typeof store.reset === 'function') {
            store.reset();
        }
    }
}