import { pick, toId, relName, compact } from "@/core";
import { toISODate } from "@/shared/utils";

/** Backend → App */
export function mapTraslado(dto = {}) {
    return {
        id: toId(pick(dto, "id", "id_traslado")),
        elementoId: toId(pick(dto, "elemento_id", "elementoId", "elemento.id")),
        elemento: relName(pick(dto, "elemento", "elemento_nombre")),
        placa: pick(dto, "placa", "elemento.placa"),
        origen: relName(pick(dto, "origen", "ambiente_origen", "ambiente_origen_nombre")),
        destinoId: toId(pick(dto, "destino_id", "ambiente_destino_id", "destinoId")),
        destino: relName(pick(dto, "destino", "ambiente_destino", "ambiente_destino_nombre")),
        fechaSalida: pick(dto, "fecha_salida", "fechaSalida", "dia"),
        fechaLlegada: pick(dto, "fecha_llegada", "fechaLlegada", "dia_llegada"),
        estado: pick(dto, "estado") ?? "Programado",
        motivo: pick(dto, "motivo", "observaciones"),
        responsable: relName(pick(dto, "responsable", "usuario")),
    };
}

/** App → Backend */
export const toTrasladoDTO = (values) =>
    compact({
        elemento_id: values.elementoId,
        ambiente_destino_id: values.destinoId,
        fecha_salida: toISODate(values.fechaSalida),
        fecha_llegada: toISODate(values.fechaLlegada),
        motivo: values.motivo?.trim() || undefined,
    });

export const TRASLADO_ESTADOS = ["Programado", "En tránsito", "Entregado"];
