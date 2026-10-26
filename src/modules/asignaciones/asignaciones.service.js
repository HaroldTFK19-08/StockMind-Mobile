import { env, http, ENDPOINTS, unwrapList, unwrapItem, mockSession } from "@/core";
import { usuariosService } from "@/modules/usuarios/usuarios.service";
import { elementosService } from "@/modules/elementos/elementos.service";
import { elementosMock } from "@/modules/elementos/elementos.mock";
import { mapAsignacion, toAsignacionDTO } from "./asignaciones.mapper";
import { asignacionesMock } from "./asignaciones.mock";

export const asignacionesService = {
    /** GET /asignaciones  (cuentadante / admin) */
    async list() {
        if (env.isMock("asignaciones")) return (await asignacionesMock.list()).map(mapAsignacion);
        return unwrapList(await http.get(ENDPOINTS.asignaciones.base)).map(mapAsignacion);
    },

    /** GET /asignaciones/mias  (aprendiz autenticado, identificado por el token) */
    async mias() {
        if (env.isMock("asignaciones")) {
            const yo = mockSession.get();
            return (await asignacionesMock.list((a) => a.aprendizId === yo?.id)).map(mapAsignacion);
        }
        return unwrapList(await http.get(ENDPOINTS.asignaciones.mias)).map(mapAsignacion);
    },

    /** POST /asignaciones */
    async create(values) {
        const dto = toAsignacionDTO(values);
        if (env.isMock("asignaciones")) {
            const [aprendiz, elemento] = await Promise.all([
                usuariosService.get(values.aprendizId),
                elementosMock.get(values.elementoId),
            ]);
            await elementosService.update(elemento.id, { estado: "En uso" });
            const row = await asignacionesMock.create({
                aprendizId: aprendiz.id,
                aprendiz: aprendiz.nombre,
                elementoId: elemento.id,
                elemento: elemento.nombre,
                placa: elemento.placa,
                categoria: elemento.categoria,
                ambiente: elemento.ambiente,
                fechaInicio: dto.fecha_inicio,
                fechaFin: dto.fecha_fin,
                observaciones: dto.observaciones,
            });
            return mapAsignacion(row);
        }
        return mapAsignacion(unwrapItem(await http.post(ENDPOINTS.asignaciones.base, dto)));
    },

    /** PATCH /asignaciones/:id  { estado: "Finalizada" } — devuelve el elemento */
    async finalizar(asignacion) {
        if (env.isMock("asignaciones")) {
            const row = await asignacionesMock.update(asignacion.id, { estado: "Finalizada" });
            if (asignacion.elementoId) await elementosService.update(asignacion.elementoId, { estado: "Disponible" });
            return mapAsignacion(row);
        }
        return mapAsignacion(unwrapItem(await http.patch(ENDPOINTS.asignaciones.byId(asignacion.id), { estado: "Finalizada" })));
    },
};
