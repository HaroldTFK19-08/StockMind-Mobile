import axios from "axios";

// Conexión con el backend. La URL sale del archivo .env
// Ejemplo: EXPO_PUBLIC_API_URL=http://192.168.20.63:8000/v1
const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    timeout: 15000,
    headers: { Accept: "application/json" },
});

// Si algo falla, se deja un mensaje entendible en error.message
api.interceptors.response.use(
    (respuesta) => respuesta,
    (error) => {
        const respuesta = error.response;

        if (!respuesta) {
            // No hubo respuesta: servidor apagado, IP mala o CORS
            console.warn("[API] Sin respuesta de:", api.defaults.baseURL + (error.config?.url ?? ""));
            error.message = "No se pudo conectar con el servidor.";
        } else if (respuesta.data?.errors) {
            // Error de validación de Laravel (422): se muestra el primero
            error.message = Object.values(respuesta.data.errors)[0][0];
        } else {
            error.message = respuesta.data?.message ?? "Ocurrió un error inesperado.";
        }
        return Promise.reject(error);
    }
);

// Laravel responde { message, data: {...} } al crear, ver y actualizar
export const datos = (respuesta) => respuesta.data?.data ?? respuesta.data;

// Trae TODAS las páginas de un listado (el backend usa paginate(10))
export async function todas(ruta, params) {
    let lista = [];
    let pagina = 1;
    let ultima = 1;

    do {
        const { data } = await api.get(ruta, { params: { ...params, page: pagina } });
        if (Array.isArray(data)) return data; // /centros no está paginado
        lista = lista.concat(data.data);
        ultima = data.last_page;
        pagina++;
    } while (pagina <= ultima);

    return lista;
}

// Crear (post) o actualizar (put). Si lleva una foto se envía como FormData
export function enviar(metodo, url, values) {
    const llevaFoto = Object.values(values).some((v) => v?.uri);
    if (!llevaFoto) return api.request({ method: metodo, url, data: values });

    const form = new FormData();
    // Laravel no lee archivos en un PUT, por eso se manda POST con _method=PUT
    if (metodo === "put") form.append("_method", "PUT");

    for (const [campo, valor] of Object.entries(values)) {
        if (valor == null) continue;
        if (Array.isArray(valor)) {
            valor.forEach((v) => form.append(`${campo}[]`, String(v))); // ej: element_ids[]
        } else if (valor.uri) {
            // Foto elegida con expo-image-picker (en web viene el archivo en .file)
            form.append(campo, valor.file ?? { uri: valor.uri, name: valor.fileName ?? "foto.jpg", type: valor.mimeType ?? "image/jpeg" });
        } else {
            form.append(campo, String(valor));
        }
    }
    return api.post(url, form);
}

export { api };
export default api;
