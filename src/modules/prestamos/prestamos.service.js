import api, { datos, todas, enviar } from "@/core/config/api/consumo";

// Ruta /prestamos → tabla `loans` del backend
const RUTA = "/prestamos";

export const prestamosService = {
    /** GET /prestamos (junta todas las páginas del paginate) */
    async list(params) {
        return todas(RUTA, params);
    },

    /** GET /prestamos/:id */
    async get(id) {
        return datos(await api.get(`${RUTA}/${id}`));
    },

    /** POST /prestamos (si hay imagen se envía como multipart) */
    async create(values) {
        return datos(await enviar("post", RUTA, values));
    },

    /** PUT /prestamos/:id (basta con enviar los campos que cambian) */
    async update(id, values) {
        return datos(await enviar("put", `${RUTA}/${id}`, values));
    },

    /** DELETE /prestamos/:id */
    async remove(id) {
        await api.delete(`${RUTA}/${id}`);
        return id;
    },
};
