import { pick, toId } from "@/core";

const num = (v) => (v === undefined || v === null ? undefined : Number(v));

/** Backend → App. GET /dashboard/resumen devuelve contadores según el rol del token. */
export function mapResumen(dto = {}) {
    return {
        elementos: num(pick(dto, "elementos", "total_elementos")),
        reportesPendientes: num(pick(dto, "reportes_pendientes", "reportesPendientes")),
        centros: num(pick(dto, "centros", "total_centros")),
        usuarios: num(pick(dto, "usuarios", "total_usuarios")),
        ambientes: num(pick(dto, "ambientes", "total_ambientes")),
        asignacionesActivas: num(pick(dto, "asignaciones_activas", "asignacionesActivas")),
        asignacionesPorVencer: num(pick(dto, "asignaciones_por_vencer", "asignacionesPorVencer")),
        trasladosEnCurso: num(pick(dto, "traslados_en_curso", "trasladosEnCurso")),
        misElementos: num(pick(dto, "mis_elementos", "misElementos")),
        misReportesAbiertos: num(pick(dto, "mis_reportes_abiertos", "misReportesAbiertos")),
        recientes: (pick(dto, "recientes", "actividad_reciente") ?? []).map((r) => ({
            id: toId(pick(r, "id")),
            titulo: pick(r, "titulo", "title"),
            subtitulo: pick(r, "subtitulo", "descripcion"),
            fecha: pick(r, "fecha", "created_at"),
            estado: pick(r, "estado"),
            icon: pick(r, "icon", "icono") ?? "time-outline",
        })),
    };
}
