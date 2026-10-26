import { env, http, ENDPOINTS, unwrapList, unwrapItem, mockSession } from "@/core";
import { todayISO } from "@/shared/utils";
import { elementosMock } from "@/modules/elementos/elementos.mock";
import { mapReporte, toReporteDTO } from "./reportes.mapper";
import { reportesMock } from "./reportes.mock";

const porFecha = (a, b) => String(b.fecha).localeCompare(String(a.fecha));

export const reportesService = {
    /** GET /reportes  (todos; admin) */
    async list() {
        const rows = env.isMock("reportes") ? await reportesMock.list() : unwrapList(await http.get(ENDPOINTS.reportes.base));
        return rows.map(mapReporte).sort(porFecha);
    },

    /** GET /reportes/mios  (los que creó el usuario autenticado) */
    async mios() {
        if (env.isMock("reportes")) {
            const yo = mockSession.get();
            return (await reportesMock.list((r) => r.reportadoPorId === yo?.id)).map(mapReporte).sort(porFecha);
        }
        return unwrapList(await http.get(ENDPOINTS.reportes.mios)).map(mapReporte).sort(porFecha);
    },

    /** POST /reportes */
    async create(values) {
        const dto = toReporteDTO(values);
        if (env.isMock("reportes")) {
            const elemento = await elementosMock.get(values.elementoId);
            const yo = mockSession.get();
            const row = await reportesMock.create({
                elementoId: elemento.id,
                elemento: elemento.nombre,
                placa: elemento.placa,
                categoria: elemento.categoria,
                ambiente: elemento.ambiente,
                tipo: dto.tipo,
                descripcion: dto.descripcion,
                fecha: todayISO(),
                estado: "Pendiente",
                reportadoPorId: yo?.id,
                reportadoPor: yo?.nombre,
            });
            return mapReporte(row);
        }
        return mapReporte(unwrapItem(await http.post(ENDPOINTS.reportes.base, dto)));
    },

    /** PATCH /reportes/:id  { estado, respuesta } */
    async cambiarEstado(id, estado, respuesta) {
        const body = { estado, respuesta: respuesta?.trim() || undefined };
        if (env.isMock("reportes")) return mapReporte(await reportesMock.update(id, body));
        return mapReporte(unwrapItem(await http.patch(ENDPOINTS.reportes.byId(id), body)));
    },
};
