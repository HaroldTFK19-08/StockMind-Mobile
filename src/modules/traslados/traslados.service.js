import api, { datos, todas, enviar } from "@/core/config/api/consumo";

// Ruta /traslados → tabla `transfers` del backend
const RUTA = "/traslados";

export const trasladosService = {
    /** GET /traslados (junta todas las páginas del paginate) */
    async list(params) {
        return todas(RUTA, params);
    },

    /** GET /traslados/:id */
    async get(id) {
        return datos(await api.get(`${RUTA}/${id}`));
    },

    /** POST /traslados (si hay imagen se envía como multipart) */
    async create(values) {
        return datos(await enviar("post", RUTA, values));
    },

    /** PUT /traslados/:id (basta con enviar los campos que cambian) */
    async update(id, values) {
        return datos(await enviar("put", `${RUTA}/${id}`, values));
    },

    /** DELETE /traslados/:id */
    async remove(id) {
        await api.delete(`${RUTA}/${id}`);
        return id;
    },

    /** Cambia el estado: pendiente → aprobado → completado, o pendiente → rechazado. */
    async cambiarEstado(traslado, estado) {
        return trasladosService.update(traslado.id, { estado });
    },
};
