import api, { datos, todas, enviar } from "@/core/config/api/consumo";

// Ruta /elementos → tabla `elements` del backend
const RUTA = "/elementos";

export const elementosService = {
    /** GET /elementos (junta todas las páginas del paginate) */
    async list(params) {
        return todas(RUTA, params);
    },

    /** GET /elementos/:id */
    async get(id) {
        return datos(await api.get(`${RUTA}/${id}`));
    },

    /** POST /elementos (si hay imagen se envía como multipart) */
    async create(values) {
        return datos(await enviar("post", RUTA, values));
    },

    /** PUT /elementos/:id (basta con enviar los campos que cambian) */
    async update(id, values) {
        return datos(await enviar("put", `${RUTA}/${id}`, values));
    },

    /** DELETE /elementos/:id */
    async remove(id) {
        await api.delete(`${RUTA}/${id}`);
        return id;
    },

    /** Cambia solo el estado (asignado y prestado los maneja el backend). */
    async cambiarEstado(elemento, estado) {
        return elementosService.update(elemento.id, { estado });
    },
};
