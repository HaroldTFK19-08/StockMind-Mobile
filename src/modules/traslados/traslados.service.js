import { env, http, ENDPOINTS, unwrapList, unwrapItem, mockSession } from "@/core";
import { ambientesService } from "@/modules/ambientes/ambientes.service";
import { elementosService } from "@/modules/elementos/elementos.service";
import { elementosMock } from "@/modules/elementos/elementos.mock";
import { mapTraslado, toTrasladoDTO } from "./traslados.mapper";
import { trasladosMock } from "./traslados.mock";

export const trasladosService = {
    /** GET /traslados */
    async list() {
        if (env.isMock("traslados")) return (await trasladosMock.list()).map(mapTraslado);
        return unwrapList(await http.get(ENDPOINTS.traslados.base)).map(mapTraslado);
    },

    /** POST /traslados */
    async create(values) {
        const dto = toTrasladoDTO(values);
        if (env.isMock("traslados")) {
            const [elemento, destino] = await Promise.all([elementosMock.get(values.elementoId), ambientesService.get(values.destinoId)]);
            const row = await trasladosMock.create({
                elementoId: elemento.id,
                elemento: elemento.nombre,
                placa: elemento.placa,
                origen: elemento.ambiente,
                destinoId: destino.id,
                destino: destino.nombre,
                fechaSalida: dto.fecha_salida,
                fechaLlegada: dto.fecha_llegada,
                estado: "Programado",
                motivo: dto.motivo,
                responsable: mockSession.get()?.nombre,
            });
            return mapTraslado(row);
        }
        return mapTraslado(unwrapItem(await http.post(ENDPOINTS.traslados.base, dto)));
    },

    /** PATCH /traslados/:id  { estado } */
    async cambiarEstado(traslado, estado) {
        if (env.isMock("traslados")) {
            const row = await trasladosMock.update(traslado.id, { estado });
            if (estado === "Entregado" && traslado.elementoId) {
                await elementosService.update(traslado.elementoId, { ambiente: traslado.destino, ambienteId: traslado.destinoId });
            }
            return mapTraslado(row);
        }
        return mapTraslado(unwrapItem(await http.patch(ENDPOINTS.traslados.byId(traslado.id), { estado })));
    },
};
