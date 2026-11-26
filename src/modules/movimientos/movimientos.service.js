import api, { datos, todas, enviar } from "@/core/config/api/consumo";

// Ruta /movimientos → tabla `motions` del backend
const RUTA = "/movimientos";

export const movimientosService = {
    /** GET /movimientos (junta todas las páginas del paginate) */
    async list(params) {
        return todas(RUTA, params);
    },

    /** GET /movimientos/:id */
    async get(id) {
        return datos(await api.get(`${RUTA}/${id}`));
    },

    /**
     * POST /movimientos (si hay imagen se envía como multipart).
     * La lista de elementos se manda como IDs: el backend la guarda en la tabla
     * aparte de detalle del movimiento (no se guarda dentro del movimiento).
     */
    async create(values) {
        const cuerpo = { ...values, element_ids: (values.element_ids ?? []).map(Number) };
        return datos(await enviar("post", RUTA, cuerpo));
    },

    /** PUT /movimientos/:id (basta con enviar los campos que cambian) */
    async update(id, values) {
        return datos(await enviar("put", `${RUTA}/${id}`, values));
    },

    /** DELETE /movimientos/:id */
    async remove(id) {
        await api.delete(`${RUTA}/${id}`);
        return id;
    },
};
