import { pick, toId, relName } from "@/core";
import { normalizeRole, roleLabel } from "@/modules/auth/roles";

/** Backend → App */
export function mapUsuario(dto = {}) {
    const nombres = pick(dto, "nombres", "first_name");
    const apellidos = pick(dto, "apellidos", "last_name");
    const rol = normalizeRole(pick(dto, "rol", "role", "rol_nombre", "tipo_usuario", "roles.0"));
    return {
        id: toId(pick(dto, "id", "id_usuario", "_id")),
        nombre: pick(dto, "nombre", "nombre_completo", "name") ?? [nombres, apellidos].filter(Boolean).join(" "),
        correo: pick(dto, "correo", "email"),
        documento: pick(dto, "documento", "numero_documento", "cedula"),
        telefono: pick(dto, "telefono", "celular"),
        programa: relName(pick(dto, "programa", "programa_formacion", "ficha.programa")),
        ficha: relName(pick(dto, "ficha", "numero_ficha"), "numero", "codigo"),
        centro: relName(pick(dto, "centro", "centro_nombre")),
        rol,
        rolLabel: roleLabel(rol),
        estado: pick(dto, "estado") ?? "Activo",
    };
}
