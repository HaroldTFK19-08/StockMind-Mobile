import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "stockmind.token";
const USER_KEY = "stockmind.user";

// En web SecureStore no está disponible: se usa localStorage.
const isWeb = Platform.OS === "web";

const driver = {
    async getItem(key) {
        if (isWeb) return globalThis.localStorage?.getItem(key) ?? null;
        return SecureStore.getItemAsync(key);
    },
    async setItem(key, value) {
        if (isWeb) return globalThis.localStorage?.setItem(key, value);
        return SecureStore.setItemAsync(key, value);
    },
    async removeItem(key) {
        if (isWeb) return globalThis.localStorage?.removeItem(key);
        return SecureStore.deleteItemAsync(key);
    },
};

// Caché en memoria para no leer el almacenamiento en cada petición.
let cachedToken;

export const tokenStorage = {
    async get() {
        if (cachedToken !== undefined) return cachedToken;
        cachedToken = await driver.getItem(TOKEN_KEY);
        return cachedToken;
    },
    async set(token) {
        cachedToken = token;
        await driver.setItem(TOKEN_KEY, token);
    },
    async clear() {
        cachedToken = null;
        await driver.removeItem(TOKEN_KEY);
    },
};

export const userStorage = {
    async get() {
        const raw = await driver.getItem(USER_KEY);
        try {
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    },
    async set(user) {
        await driver.setItem(USER_KEY, JSON.stringify(user));
    },
    async clear() {
        await driver.removeItem(USER_KEY);
    },
};
