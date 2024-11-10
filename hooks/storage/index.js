const STORAGES_KEY = {
    LOCAL_STORAGE: Symbol(1),
    SESSION_STORAGE: Symbol(2),
};

function getStorage(storage) {
    return storage === STORAGES_KEY.SESSION_STORAGE
        ? sessionStorage
        : localStorage;
}

const STORAGE = {
    load: (key, storage, defaultValue = null) => {
        storage = getStorage(storage);

        const data = storage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    },
    save: (key, data, storage) => {
        storage = getStorage(storage);

        storage.setItem(key, JSON.stringify(data));
    },
    remove: (key, storage) => {
        storage = getStorage(storage);

        storage.removeItem(key);
    },
    ...STORAGES_KEY,
};

export default STORAGE;
