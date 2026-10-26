import { Platform } from "react-native";
import Constants from "expo-constants";

/**
 * Configuración del entorno de StockMind.
 *
 * Expo solo inyecta las variables que empiezan por EXPO_PUBLIC_ y solo si se
 * leen de forma estática (process.env.EXPO_PUBLIC_X). No usar process.env[nombre]
 * ni desestructurar process.env: llegarían undefined.
 *
 * Después de cambiar el .env, reinicia Expo con: npx expo start --clear
 */
const RAW_API_URL = process.env.EXPO_PUBLIC_API_URL;
const RAW_USE_MOCKS = process.env.EXPO_PUBLIC_USE_MOCKS;
const RAW_API_MODULES = process.env.EXPO_PUBLIC_API_MODULES;
const RAW_TIMEOUT = process.env.EXPO_PUBLIC_API_TIMEOUT;
const RAW_DEBUG = process.env.EXPO_PUBLIC_API_DEBUG;

const DEFAULT_TIMEOUT = 15000;
const MIN_TIMEOUT = 1000;
const MAX_TIMEOUT = 120000;
const DEFAULT_MOCK_LATENCY = 450;

const IS_DEV = typeof __DEV__ !== "undefined" && __DEV__;
const LOCAL_HOSTS = ["localhost", "127.0.0.1", "0.0.0.0"];

/** Módulos que tienen servicio. Se usan para validar EXPO_PUBLIC_API_MODULES. */
// "auth" no está: el login aún no existe en Laravel y funciona de forma local.
export const API_MODULES = [
    "dashboard",
    "usuarios",
    "centros",
    "ambientes",
    "elementos",
    "asignaciones",
    "traslados",
    "reportes",
    "notificaciones",
];

const clean = (value) => (typeof value === "string" ? value.trim() : "");

const parseBoolean = (value) => {
    const v = clean(value).toLowerCase();
    if (v === "true") return true;
    if (v === "false") return false;
    return null;
};

const parseTimeout = (value) => {
    const timeout = Number(clean(value));
    if (!Number.isFinite(timeout) || timeout < MIN_TIMEOUT) return DEFAULT_TIMEOUT;
    return Math.min(timeout, MAX_TIMEOUT);
};

/** "centros, usuarios" → ["centros", "usuarios"]; "*" → todos los módulos. */
function parseModules(value) {
    const raw = clean(value).toLowerCase();
    if (!raw) return [];
    if (raw === "*") return [...API_MODULES];
    const lista = raw.split(",").map((m) => m.trim()).filter(Boolean);
    const desconocidos = lista.filter((m) => !API_MODULES.includes(m));
    if (IS_DEV && desconocidos.length) {
        console.warn(`[env] EXPO_PUBLIC_API_MODULES tiene módulos desconocidos: ${desconocidos.join(", ")}`);
    }
    return lista.filter((m) => API_MODULES.includes(m));
}

/** IP del PC donde corre `expo start` (la misma que usa el celular para cargar el bundle). */
function getDevMachineHost() {
    const hostUri = Constants.expoConfig?.hostUri ?? Constants.expoGoConfig?.debuggerHost ?? "";
    const host = hostUri.split(":")[0];
    return host && !LOCAL_HOSTS.includes(host) ? host : null;
}

/**
 * En el celular o el emulador "localhost" es el propio dispositivo, no tu PC.
 * Si la URL apunta a localhost se cambia por la IP del PC (o por 10.0.2.2 en
 * el emulador de Android). En web se deja igual.
 */
function resolveLocalhost(url) {
    if (Platform.OS === "web") return url;
    const match = url.match(/^(https?:\/\/)([^/:]+)(.*)$/i);
    if (!match || !LOCAL_HOSTS.includes(match[2].toLowerCase())) return url;

    const devHost = getDevMachineHost();
    if (devHost) return `${match[1]}${devHost}${match[3]}`;
    if (Platform.OS === "android") return `${match[1]}10.0.2.2${match[3]}`;
    return url;
}

function normalizeApiUrl(value) {
    const url = clean(value).replace(/\/+$/, "");
    if (!url) return "";
    if (!/^https?:\/\//i.test(url)) {
        console.warn(`[env] EXPO_PUBLIC_API_URL debe empezar por http:// o https:// (valor: "${url}")`);
        return "";
    }
    return resolveLocalhost(url);
}

const apiUrl = normalizeApiUrl(RAW_API_URL);
// Sin URL no hay backend posible: todo queda en mocks.
const useMocks = apiUrl === "" ? true : parseBoolean(RAW_USE_MOCKS) ?? false;
const apiModules = apiUrl === "" ? [] : useMocks ? parseModules(RAW_API_MODULES) : [...API_MODULES];

export const env = Object.freeze({
    apiUrl,
    /** true = modo demo. Los módulos de EXPO_PUBLIC_API_MODULES igual van al backend. */
    useMocks,
    /** Módulos que consumen la API real. */
    apiModules: Object.freeze(apiModules),
    /** ¿Este módulo trabaja con datos de prueba? Ej: env.isMock("centros") */
    isMock: (modulo) => !apiModules.includes(modulo),
    /** ¿Algún módulo usa el backend? */
    usesApi: apiModules.length > 0,
    timeout: parseTimeout(RAW_TIMEOUT),
    debug: IS_DEV && parseBoolean(RAW_DEBUG) === true,
    mockLatency: DEFAULT_MOCK_LATENCY,
    isDevelopment: IS_DEV,
});

if (IS_DEV) {
    if (parseBoolean(RAW_USE_MOCKS) === false && !apiUrl) {
        console.warn("[env] EXPO_PUBLIC_USE_MOCKS=false pero EXPO_PUBLIC_API_URL está vacía. Revisa tu .env.");
    }
    const modo = !env.usesApi
        ? "Modo MOCK (sin backend)"
        : env.useMocks
          ? `Mixto · API ${apiUrl} para: ${apiModules.join(", ")}`
          : `API: ${apiUrl}`;
    console.log(`[env] ${modo} · timeout ${env.timeout} ms`);
}
