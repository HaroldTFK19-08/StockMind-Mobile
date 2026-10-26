import { pick, toId, relName } from "@/core";

export function mapAmbiente(dto = {}) {
    return {
        id: toId(pick(dto, "id", "id_ambiente")),
        nombre: pick(dto, "nombre", "name", "codigo"),
        tipo: relName(pick(dto, "tipo", "tipo_ambiente")) ?? "Salón",
        centroId: toId(pick(dto, "centro_id", "centroId", "centro.id")),
        centro: relName(pick(dto, "centro", "centro_nombre")),
        capacidad: pick(dto, "capacidad", "aforo"),
        estado: pick(dto, "estado") ?? "Disponible",
        totalElementos: pick(dto, "total_elementos", "elementos_count", "_count.elementos"),
        responsable: relName(pick(dto, "responsable", "cuentadante")),
    };
}
