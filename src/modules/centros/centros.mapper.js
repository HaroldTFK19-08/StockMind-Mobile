import { pick, toId, compact } from "@/core";

/** Backend → App */
export function mapCentro(dto = {}) {
    const ciudad = pick(dto, "ciudad", "municipio");
    const regional = pick(dto, "regional", "region");

    return {
        id: toId(pick(dto, "id", "id_centro")),
        nombre: pick(dto, "nombre", "centro", "name"),
        ciudad: ciudad ?? "",
        regional: regional ?? "",
        ubicacion: [ciudad, regional ? `Regional ${regional}` : null].filter(Boolean).join(" · ") || pick(dto, "ubicacion") || "",
        foto_centro: pick(dto, "foto_centro", "foto", "imagen") || null,
        direccion: pick(dto, "direccion", "address") || "",
        telefono: pick(dto, "telefono") || "",
        sedes: Number(pick(dto, "sedes", "total_sedes", "_count.sedes") ?? 0),
        ambientes: Number(pick(dto, "ambientes", "total_ambientes", "_count.ambientes") ?? 0),
    };
}

/** App → Backend */
export const toCentroDTO = (values) =>
    compact({
        nombre: values.nombre?.trim(),
        ciudad: values.ciudad?.trim(),
        regional: values.regional?.trim(),
        foto_centro: values.foto_centro?.trim() || undefined,
    });
