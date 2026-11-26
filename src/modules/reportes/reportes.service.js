import api, { datos, todas, enviar } from "@/core/config/api/consumo";

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

    /**
     * POST /reportes (si hay imagen se envía como multipart).
     * La lista de elementos se manda como IDs: el backend la guarda en la tabla
     * aparte de detalle del reporte (no se guarda dentro del reporte).
     */
    async create(values) {
        const cuerpo = { ...values, element_ids: (values.element_ids ?? []).map(Number) };
        return datos(await enviar("post", RUTA, cuerpo));
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

    /** "Mis reportes": se filtran los reportes por el usuario en sesión. */
    async mios(usuarioId) {
        const reportes = await reportesService.list();
        return reportes.filter(
            (r) =>
                String(r.apprentice_id) === String(usuarioId) ||
                String(r.apprentice?.user?.id ?? "") === String(usuarioId)
        );
    },

    /** Cambia solo el estado (pendiente, en_revision, resuelto). */
    async cambiarEstado(reporte, estado) {
        return reportesService.update(reporte.id, { estado });
    },
};
