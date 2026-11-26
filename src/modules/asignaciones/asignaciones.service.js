import api, { datos, todas, enviar } from "@/core/config/api/consumo";
import { todayISO } from "@/shared/utils";

// Ruta /asignaciones → tabla `assignments` del backend
const RUTA = "/asignaciones";

export const asignacionesService = {
    /** GET /asignaciones (junta todas las páginas del paginate) */
    async list(params) {
        return todas(RUTA, params);
    },

    /** GET /asignaciones/:id */
    async get(id) {
        return datos(await api.get(`${RUTA}/${id}`));
    },

    /** POST /asignaciones (si hay imagen se envía como multipart) */
    async create(values) {
        return datos(await enviar("post", RUTA, values));
    },

    /** PUT /asignaciones/:id (basta con enviar los campos que cambian) */
    async update(id, values) {
        return datos(await enviar("put", `${RUTA}/${id}`, values));
    },

    /** DELETE /asignaciones/:id */
    async remove(id) {
        await api.delete(`${RUTA}/${id}`);
        return id;
    },

    /** "Mis elementos": se filtran las asignaciones por el aprendiz en sesión. */
    async mias(apprenticeId) {
        const asignaciones = await asignacionesService.list();
        return asignaciones.filter(
            (a) =>
                String(a.apprentice_id) === String(apprenticeId) ||
                String(a.apprentice?.user?.id ?? "") === String(apprenticeId)
        );
    },

    /** Marca la asignación como devuelta; el backend deja el elemento disponible. */
    async finalizar(asignacion) {
        return asignacionesService.update(asignacion.id, { estado: "devuelta", fecha_devolucion_real: todayISO() });
    },
};
