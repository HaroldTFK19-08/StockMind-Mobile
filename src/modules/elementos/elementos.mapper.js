import { pick, toId, relName, compact } from "@/core";

/** Backend → App */
export function mapElemento(dto = {}) {
    return {
        id: toId(pick(dto, "id", "id_elemento")),
        nombre: pick(dto, "nombre", "elemento", "name"),
        placa: pick(dto, "placa", "codigo", "serial", "numero_inventario"),
        categoria: relName(pick(dto, "categoria", "categoria_nombre")) ?? "Otro",
        estado: relName(pick(dto, "estado", "estado_nombre")) ?? "Disponible",
        descripcion: pick(dto, "descripcion", "description") ?? "",
        marca: pick(dto, "marca"),
        ambienteId: toId(pick(dto, "ambiente_id", "ambienteId", "ambiente.id")),
        ambiente: relName(pick(dto, "ambiente", "ambiente_nombre")),
        fechaRegistro: pick(dto, "fecha_registro", "created_at", "createdAt"),
    };
}

/** App → Backend */
export const toElementoDTO = (values) =>
    compact({
        nombre: values.nombre?.trim(),
        placa: values.placa?.trim() || undefined,
        marca: values.marca?.trim() || undefined,
        categoria: values.categoria,
        estado: values.estado,
        descripcion: values.descripcion?.trim(),
        ambiente_id: values.ambienteId || undefined,
    });
