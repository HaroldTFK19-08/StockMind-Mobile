import { env, http, ENDPOINTS, unwrapList, unwrapItem } from "@/core";
import { ambientesService } from "@/modules/ambientes/ambientes.service";
import { mapElemento, toElementoDTO } from "./elementos.mapper";
import { elementosMock } from "./elementos.mock";

export const elementosService = {
    /** GET /elementos?estado=&ambiente_id= */
    async list({ estado, ambienteId } = {}) {
        if (env.isMock("elementos")) {
            const rows = await elementosMock.list(
                (e) => (!estado || e.estado === estado) && (!ambienteId || e.ambienteId === ambienteId)
            );
            return rows.map(mapElemento);
        }
        const data = await http.get(ENDPOINTS.elementos.base, { params: { estado, ambiente_id: ambienteId } });
        return unwrapList(data).map(mapElemento);
    },

    /** POST /elementos */
    async create(values) {
        const dto = toElementoDTO(values);
        if (env.isMock("elementos")) {
            const ambiente = dto.ambiente_id ? await ambientesService.get(dto.ambiente_id) : null;
            const row = await elementosMock.create({
                ...values,
                placa: values.placa || `SENA-${Date.now().toString().slice(-6)}`,
                ambiente: ambiente?.nombre,
            });
            return mapElemento(row);
        }
        return mapElemento(unwrapItem(await http.post(ENDPOINTS.elementos.base, dto)));
    },

    /** PATCH /elementos/:id  (actualización parcial, p. ej. solo el estado) */
    async update(id, values) {
        if (env.isMock("elementos")) return mapElemento(await elementosMock.update(id, values));
        const dto = toElementoDTO(values);
        return mapElemento(unwrapItem(await http.patch(ENDPOINTS.elementos.byId(id), dto)));
    },

    /** DELETE /elementos/:id */
    async remove(id) {
        if (env.isMock("elementos")) return elementosMock.remove(id);
        return http.delete(ENDPOINTS.elementos.byId(id));
    },
};
