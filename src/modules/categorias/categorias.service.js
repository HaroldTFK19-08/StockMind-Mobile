import api, { datos, todas, enviar } from "@/core/config/api/consumo";

// Ruta /categorias → tabla `categories` del backend
const RUTA = "/categorias";

export const categoriasService = {
    /** GET /categorias (junta todas las páginas del paginate) */
    async list(params) {
        return todas(RUTA, params);
    },

    /** GET /categorias/:id */
    async get(id) {
        return datos(await api.get(`${RUTA}/${id}`));
    },

    /** POST /categorias (si hay imagen se envía como multipart) */
    async create(values) {
        return datos(await enviar("post", RUTA, values));
    },

    /** PUT /categorias/:id (basta con enviar los campos que cambian) */
    async update(id, values) {
        return datos(await enviar("put", `${RUTA}/${id}`, values));
    },

    /** DELETE /categorias/:id */
    async remove(id) {
        await api.delete(`${RUTA}/${id}`);
        return id;
    },
};
