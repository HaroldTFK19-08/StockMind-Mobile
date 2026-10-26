import axios from "axios";
import { env } from "../config/env";
import { ApiError, messageFromResponse } from "./ApiError";

/**
 * Cliente HTTP de la app (axios).
 *
 * Por ahora la API de Laravel NO tiene autenticación, así que aquí no se
 * envía ningún token. Cuando exista el login en el backend, el token
 * Bearer se agrega en el interceptor de petición (ver comentario abajo).
 */

// Oculta contraseñas en los logs de depuración.
const SENSIBLES = ["contrasena", "password", "password_confirmation"];
const maskForLog = (body) => {
    if (typeof FormData !== "undefined" && body instanceof FormData) return "[FormData]";
    return body && typeof body === "object" && !Array.isArray(body)
        ? Object.fromEntries(Object.entries(body).map(([k, v]) => [k, SENSIBLES.includes(k) ? "•••" : v]))
        : body ?? "";
};

/**
 * Instancia única de axios.
 * - baseURL: viene de EXPO_PUBLIC_API_URL (ej: http://10.10.34.122/v1)
 * - Accept: application/json → Laravel responde JSON (también en errores 404/422).
 */
export const api = axios.create({
    baseURL: env.apiUrl || undefined,
    timeout: env.timeout,
    headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
    },
});

// ── Antes de cada petición ────────────────────────────────────────────────
api.interceptors.request.use((config) => {
    if (!env.apiUrl) {
        throw new ApiError("No hay URL del backend configurada (EXPO_PUBLIC_API_URL).");
    }

    // Cuando Laravel tenga login (Sanctum), aquí se agrega el token:
    // config.headers.Authorization = `Bearer ${token}`;

    // FormData (fotos, archivos): axios arma el multipart/form-data.
    if (typeof FormData !== "undefined" && config.data instanceof FormData) {
        config.headers["Content-Type"] = "multipart/form-data";
    }

    config.metadata = { startedAt: Date.now() };
    if (env.debug) {
        console.log(`[api] → ${config.method?.toUpperCase()} ${api.getUri(config)}`, maskForLog(config.data));
    }
    return config;
});

// ── Después de cada respuesta ─────────────────────────────────────────────
const logResponse = (config, status, data) => {
    if (!env.debug || !config) return;
    const ms = Date.now() - (config.metadata?.startedAt ?? Date.now());
    console.log(`[api] ← ${status} ${config.method?.toUpperCase()} ${api.getUri(config)} (${ms} ms)`, maskForLog(data));
};

// Si la URL está mal (falta /v1, /public…), el servidor devuelve una página HTML.
const isHtml = (data) => typeof data === "string" && data.trimStart().startsWith("<");

api.interceptors.response.use(
    (response) => {
        logResponse(response.config, response.status, response.data);
        if (isHtml(response.data)) {
            throw new ApiError("El servidor respondió HTML en lugar de JSON. Revisa EXPO_PUBLIC_API_URL.", {
                status: response.status,
                details: response.data.slice(0, 300),
            });
        }
        return response;
    },
    (error) => {
        if (error instanceof ApiError) throw error;
        const { config, response } = error;

        // Sin respuesta: servidor apagado, IP equivocada, firewall o timeout.
        if (!response) {
            const timeout = error.code === "ECONNABORTED" || error.code === "ETIMEDOUT";
            if (env.isDevelopment) {
                console.warn(`[api] ✕ ${config ? api.getUri(config) : ""} → ${timeout ? "timeout" : error.message}`);
            }
            throw new ApiError(
                timeout
                    ? "El servidor tardó demasiado en responder."
                    : "No se pudo conectar con el servidor. Revisa que el celular y el PC estén en la misma red.",
                { status: 0, details: error.message }
            );
        }

        // Respuesta con error (404, 422, 500…): se arma un mensaje legible.
        logResponse(config, response.status, response.data);
        throw new ApiError(
            isHtml(response.data)
                ? `El servidor respondió ${response.status} con una página HTML. Revisa EXPO_PUBLIC_API_URL.`
                : messageFromResponse(response.status, response.data),
            { status: response.status, details: response.data }
        );
    }
);

// Quita parámetros vacíos: { buscar: "" } no se envía.
const cleanParams = (params) =>
    params ? Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")) : undefined;

/** Hace la petición y devuelve directamente el cuerpo de la respuesta. */
async function request(method, url, { body, params, headers, signal } = {}) {
    const response = await api.request({ method, url, data: body, params: cleanParams(params), headers, signal });
    return response.status === 204 ? null : response.data;
}

export const http = {
    get: (path, options) => request("GET", path, options),
    post: (path, body, options) => request("POST", path, { ...options, body }),
    put: (path, body, options) => request("PUT", path, { ...options, body }),
    patch: (path, body, options) => request("PATCH", path, { ...options, body }),
    delete: (path, options) => request("DELETE", path, options),
    /**
     * Envío de archivos. PHP no lee multipart en PUT/PATCH, por eso se
     * manda POST con _method (method spoofing de Laravel).
     */
    upload: (path, formData, { method = "POST", ...options } = {}) => {
        if (method !== "POST") formData.append("_method", method);
        return request("POST", path, { ...options, body: formData });
    },
};

/**
 * Normaliza listas: [ ... ] | { data: [...] } | { results: [...] } | { items: [...] }
 * También la paginación de Laravel: { data: [...], links, meta }.
 */
export function unwrapList(payload) {
    if (Array.isArray(payload)) return payload;
    if (!payload || typeof payload !== "object") return [];
    const list = payload.data ?? payload.results ?? payload.items ?? payload.rows ?? [];
    if (!Array.isArray(list) && list && Array.isArray(list.data)) return list.data;
    return Array.isArray(list) ? list : [];
}

/** Normaliza un solo objeto: { data: {...} } o {...} */
export function unwrapItem(payload) {
    if (payload && typeof payload === "object" && !Array.isArray(payload) && "data" in payload) {
        return payload.data;
    }
    return payload;
}
