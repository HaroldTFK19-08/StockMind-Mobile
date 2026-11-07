import api, { datos, todas, enviar } from "@/core/config/api/consumo";

// Ruta /almacenes → tabla `warehouses` del backend
const RUTA = "/almacenes";

export const almacenesService = {
    /** GET /almacenes (junta todas las páginas del paginate) */
    async list(params) {
        return todas(RUTA, params);
    },

    /** GET /almacenes/:id */
    async get(id) {
        return datos(await api.get(`${RUTA}/${id}`));
    },

    /** POST /almacenes (si hay imagen se envía como multipart) */
    async create(values) {
        return datos(await enviar("post", RUTA, values));
    },

    /** PUT /almacenes/:id (basta con enviar los campos que cambian) */
    async update(id, values) {
        return datos(await enviar("put", `${RUTA}/${id}`, values));
    },

    /** DELETE /almacenes/:id */
    async remove(id) {
        await api.delete(`${RUTA}/${id}`);
        return id;
    },
};
