import api, { datos, todas, enviar } from "@/core/config/api/consumo";
import { serviceNotConfigured } from "@/core";
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

    /** "Mis elementos" necesita saber quién inició sesión (auth), por eso queda pendiente. */
    mias() {
        return serviceNotConfigured("asignaciones.mias");
    },

    /** Marca la asignación como devuelta; el backend deja el elemento disponible. */
    async finalizar(asignacion) {
        return asignacionesService.update(asignacion.id, { estado: "devuelta", fecha_devolucion_real: todayISO() });
    },
};
