import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

/**
 * Cuentas creadas desde la app mientras no hay backend configurado.
 * Es solo el modo demo local: el índice guarda los IDs y cada cuenta su propio
 * registro, para no guardar un JSON grande en una sola clave de SecureStore.
 */
const INDICE_KEY = "stockmind.cuentas";
const claveCuenta = (id) => `stockmind.cuenta.${id}`;
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

async function leerIndice() {
    const raw = await driver.getItem(INDICE_KEY);
    if (!raw) return [];
    try {
        const ids = JSON.parse(raw);
        return Array.isArray(ids) ? ids : [];
    } catch {
        return [];
    }
}

const parsear = (raw) => {
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
};

export const cuentasStorage = {
    async list() {
        const ids = await leerIndice();
        const cuentas = await Promise.all(ids.map((id) => driver.getItem(claveCuenta(id))));
        return cuentas.map(parsear).filter(Boolean);
    },

    async get(id) {
        if (!id) return null;
        return parsear(await driver.getItem(claveCuenta(id)));
    },

    async findByCorreo(correo) {
        if (!correo) return null;
        const cuentas = await cuentasStorage.list();
        return cuentas.find((c) => String(c.correo ?? "").toLowerCase() === String(correo).toLowerCase()) ?? null;
    },

    async save(cuenta) {
        if (!cuenta?.id) throw new Error("La cuenta no tiene documento.");
        await driver.setItem(claveCuenta(cuenta.id), JSON.stringify(cuenta));
        const ids = await leerIndice();
        if (!ids.includes(cuenta.id)) {
            await driver.setItem(INDICE_KEY, JSON.stringify([...ids, cuenta.id]));
        }
        return cuenta;
    },
};
