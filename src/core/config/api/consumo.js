import axios from "axios";
import { Platform } from "react-native";

/**
 * Cliente HTTP único de la app.
 * La URL base sale del archivo .env (EXPO_PUBLIC_API_URL).
 * OJO: Expo solo lee variables que empiezan por EXPO_PUBLIC_.
 */
const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    timeout: 20000,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

// Si la petición falla: se deja un mensaje legible en error.message.
api.interceptors.response.use(
    (respuesta) => respuesta,
    (error) => {
        error.isNetworkError = !error.response;
        error.message = mensajeDeError(error);
        return Promise.reject(error);
    }
);

/** Traduce un error de axios/Laravel a un texto para mostrar al usuario. */
export function mensajeDeError(error) {
    if (!error.response) return "No se pudo conectar con el servidor. Revisa tu conexión.";

    const { status, data } = error.response;

    // 422 de validación: Laravel manda { errors: { campo: ["mensaje"] } } → se muestra el primero
    if (status === 422 && data?.errors) {
        const primero = Object.values(data.errors)[0];
        return Array.isArray(primero) ? primero[0] : String(primero);
    }
    // 422 de reglas de negocio (ReglasNegocioExceptions) y demás: { message }
    if (data?.message) return data.message;
    if (status === 404) return "El registro no existe.";
    return "Ocurrió un error inesperado.";
}

/**
 * Saca el registro de la respuesta.
 * store / show / update responden { message, data: {...} }.
 */
export const datos = (respuesta) => respuesta.data?.data ?? respuesta.data;

/**
 * GET de un listado completo.
 * Casi todos los index del backend usan paginate(10), que responde
 * { data: [...], current_page, last_page }. Aquí se piden todas las páginas
 * y se devuelve un solo arreglo. Centros responde el arreglo directo.
 */
export async function todas(ruta, params) {
    const { data: primera } = await api.get(ruta, { params: { ...params, page: 1 } });
    if (Array.isArray(primera)) return primera;

    const ultima = primera.last_page ?? 1;
    const resto = [];
    for (let page = 2; page <= ultima; page++) {
        resto.push(api.get(ruta, { params: { ...params, page } }));
    }
    const paginas = await Promise.all(resto);
    return [primera, ...paginas.map((r) => r.data)].flatMap((p) => p.data ?? []);
}

// ---------------------------------------------------------------------------
// Envío con archivos (foto_centro, img_elemento, foto_probatorio)
// ---------------------------------------------------------------------------

/** ¿Es una imagen elegida con expo-image-picker? (tiene uri local) */
const esArchivo = (v) => v && typeof v === "object" && typeof v.uri === "string";

/** Convierte un objeto en FormData. Los arreglos van como campo[] (ej: element_ids[]). */
function aFormData(values) {
    const form = new FormData();
    Object.entries(values).forEach(([campo, valor]) => {
        if (valor === undefined) return;
        if (Array.isArray(valor)) {
            valor.forEach((v) => form.append(`${campo}[]`, String(v)));
        } else if (esArchivo(valor)) {
            if (valor.file) {
                form.append(campo, valor.file); // web: File real
            } else {
                form.append(campo, {
                    uri: valor.uri,
                    name: valor.fileName ?? `${campo}.jpg`,
                    type: valor.mimeType ?? "image/jpeg",
                });
            }
        } else if (valor !== null) {
            form.append(campo, String(valor));
        }
    });
    return form;
}

/**
 * POST (crear) o PUT (actualizar).
 * Si algún valor es una imagen se envía como multipart/form-data.
 * Laravel no lee archivos en un PUT multipart, por eso se usa POST + _method=PUT.
 */
export async function enviar(metodo, url, values) {
    const conArchivo = Object.values(values).some(esArchivo);
    if (!conArchivo) return api.request({ method: metodo, url, data: values });

    const form = aFormData(metodo === "put" ? { ...values, _method: "PUT" } : values);
    return api.post(url, form, {
        // En web el navegador pone el boundary solo; en el celular hay que indicarlo
        headers: { "Content-Type": Platform.OS === "web" ? undefined : "multipart/form-data" },
    });
}

export { api };
export default api;
