import { pick, toId } from "@/core";

export function mapNotificacion(dto = {}) {
    return {
        id: toId(pick(dto, "id", "id_notificacion")),
        titulo: pick(dto, "titulo", "title") ?? "Notificación",
        mensaje: pick(dto, "mensaje", "message", "descripcion") ?? "",
        tipo: pick(dto, "tipo", "type") ?? "info",
        fecha: pick(dto, "fecha", "created_at", "createdAt"),
        leida: Boolean(pick(dto, "leida", "read", "is_read")),
    };
}
