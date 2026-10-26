import { pick, toId, relName, compact } from "@/core";

/** Backend → App */
export function mapReporte(dto = {}) {
    return {
        id: toId(pick(dto, "id", "id_reporte")),
        elementoId: toId(pick(dto, "elemento_id", "elementoId", "elemento.id")),
        elemento: relName(pick(dto, "elemento", "elemento_nombre")),
        placa: pick(dto, "placa", "elemento.placa"),
        categoria: pick(dto, "categoria", "elemento.categoria"),
        ambiente: relName(pick(dto, "ambiente", "ambiente_nombre", "elemento.ambiente")),
        tipo: relName(pick(dto, "tipo", "tipo_reporte")) ?? "Daño",
        descripcion: pick(dto, "descripcion", "description") ?? "",
        estado: relName(pick(dto, "estado")) ?? "Pendiente",
        fecha: pick(dto, "fecha", "fecha_reporte", "created_at", "createdAt"),
        reportadoPorId: toId(pick(dto, "usuario_id", "reportado_por_id", "usuario.id")),
        reportadoPor: relName(pick(dto, "reportado_por", "usuario", "usuario_nombre")),
        respuesta: pick(dto, "respuesta", "observacion_admin"),
    };
}

/** App → Backend */
export const toReporteDTO = (values) =>
    compact({
        elemento_id: values.elementoId,
        tipo: values.tipo,
        descripcion: values.descripcion?.trim(),
    });
