import api, { datos, todas, enviar } from "@/core/config/api/consumo";

// Ruta /fichas → tabla `coursegroups` del backend
const RUTA = "/fichas";

export const fichasService = {
    /** GET /fichas (junta todas las páginas del paginate) */
    async list(params) {
        return todas(RUTA, params);
    },

    /** GET /fichas/:id */
    async get(id) {
        return datos(await api.get(`${RUTA}/${id}`));
    },

    /** POST /fichas (si hay imagen se envía como multipart) */
    async create(values) {
        return datos(await enviar("post", RUTA, values));
    },

    /** PUT /fichas/:id (basta con enviar los campos que cambian) */
    async update(id, values) {
        return datos(await enviar("put", `${RUTA}/${id}`, values));
    },

    /** DELETE /fichas/:id */
    async remove(id) {
        await api.delete(`${RUTA}/${id}`);
        return id;
    },
};
