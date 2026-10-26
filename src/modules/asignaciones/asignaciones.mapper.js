import { pick, toId, relName, compact } from "@/core";
import { parseDate, toISODate } from "@/shared/utils";

/** Si el backend no envía estado, se deduce por la fecha de finalización. */
function estadoPorFecha(fechaFin) {
    const fin = parseDate(fechaFin);
    if (!fin) return "Activa";
    const dias = (fin.getTime() - Date.now()) / 86400000;
    if (dias < 0) return "Finalizada";
    if (dias <= 7) return "Por vencer";
    return "Activa";
}

/** Backend → App */
export function mapAsignacion(dto = {}) {
    const elemento = pick(dto, "elemento");
    const fechaFin = pick(dto, "fecha_fin", "fechaFin", "final", "fecha_devolucion");
    return {
        id: toId(pick(dto, "id", "id_asignacion")),
        aprendizId: toId(pick(dto, "aprendiz_id", "aprendizId", "usuario_id", "aprendiz.id")),
        aprendiz: relName(pick(dto, "aprendiz", "aprendiz_nombre", "usuario")),
        elementoId: toId(pick(dto, "elemento_id", "elementoId", "elemento.id")),
        elemento: relName(elemento) ?? pick(dto, "elemento_nombre"),
        placa: pick(dto, "placa", "elemento.placa"),
        categoria: pick(dto, "categoria", "tipo", "elemento.categoria"),
        ambiente: relName(pick(dto, "ambiente", "ambiente_nombre", "elemento.ambiente")),
        fechaInicio: pick(dto, "fecha_inicio", "fechaInicio", "inicio", "fecha_asignacion"),
        fechaFin,
        estado: pick(dto, "estado") ?? estadoPorFecha(fechaFin),
        observaciones: pick(dto, "observaciones", "observacion"),
    };
}

/** App → Backend */
export const toAsignacionDTO = (values) =>
    compact({
        aprendiz_id: values.aprendizId,
        elemento_id: values.elementoId,
        fecha_inicio: toISODate(values.fechaInicio),
        fecha_fin: toISODate(values.fechaFin),
        observaciones: values.observaciones?.trim() || undefined,
    });
