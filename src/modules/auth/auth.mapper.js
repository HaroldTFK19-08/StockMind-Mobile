import { pick, compact } from "@/core";
import { mapUsuario } from "@/modules/usuarios/usuarios.mapper";
/**
 * Respuesta de POST /auth/login. Se aceptan formas comunes:
 *   { token, user }  |  { access_token, usuario }  |  { data: { token, user } }
 */
export function mapSession(payload = {}) {
    const body = payload.data && !Array.isArray(payload.data) ? payload.data : payload;
    const token = pick(body, "token", "access_token", "accessToken", "jwt");
    const userDto = pick(body, "user", "usuario");
    return { token, user: userDto ? mapUsuario(userDto) : null };
}
/** App → Backend (login). Cambia los nombres aquí si tu API espera otros. */
export const toLoginDTO = ({ correo, contrasena }) => ({
    correo: correo.trim().toLowerCase(),
    contrasena,
});

/** App → Backend (registro). */
export const toRegisterDTO = ({ nombre, correo, documento, contrasena, rol }) =>
    compact({
        nombre: nombre.trim(),
        correo: correo.trim().toLowerCase(),
        documento: documento?.trim() || undefined,
        contrasena,
        rol,
    });
