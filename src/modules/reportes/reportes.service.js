import api, { datos, todas, enviar } from "@/core/config/api/consumo";
import { serviceNotConfigured } from "@/core";

// Ruta /reportes → tabla `reports` del backend
const RUTA = "/reportes";

export const reportesService = {
    /** GET /reportes (junta todas las páginas del paginate) */
    async list(params) {
        return todas(RUTA, params);
    },

    /** GET /reportes/:id */
    async get(id) {
        return datos(await api.get(`${RUTA}/${id}`));
    },

    /** POST /reportes (si hay imagen se envía como multipart) */
    async create(values) {
        return datos(await enviar("post", RUTA, values));
    },

    /** PUT /reportes/:id (basta con enviar los campos que cambian) */
    async update(id, values) {
        return datos(await enviar("put", `${RUTA}/${id}`, values));
    },

    /** DELETE /reportes/:id */
    async remove(id) {
        await api.delete(`${RUTA}/${id}`);
        return id;
    },

    /** "Mis reportes" necesita saber quién inició sesión (auth), por eso queda pendiente. */
    mios() {
        return serviceNotConfigured("reportes.mios");
    },

    /** Cambia solo el estado (pendiente, en_revision, resuelto). */
    async cambiarEstado(reporte, estado) {
        return reportesService.update(reporte.id, { estado });
    },
};
