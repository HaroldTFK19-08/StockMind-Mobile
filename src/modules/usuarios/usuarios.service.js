import { env, http, ENDPOINTS, ApiError, unwrapList, unwrapItem } from "@/core";
import { mapUsuario } from "./usuarios.mapper";
import { MOCK_PASSWORDS, usuariosMock } from "./usuarios.mock";

export const usuariosService = {
    /** GET /usuarios?rol=aprendiz */
    async list({ rol } = {}) {
        if (env.isMock("usuarios")) {
            const rows = await usuariosMock.list(rol ? (u) => u.rol === rol : undefined);
            return rows.map(mapUsuario);
        }
        const data = await http.get(ENDPOINTS.usuarios.base, { params: { rol } });
        return unwrapList(data).map(mapUsuario);
    },

    async get(id) {
        if (env.isMock("usuarios")) return mapUsuario(await usuariosMock.get(id));
        return mapUsuario(unwrapItem(await http.get(ENDPOINTS.usuarios.byId(id))));
    },

    async update(id, values) {
        if (env.isMock("usuarios")) {
            const duplicado = await usuariosMock.list(
                (usuario) =>
                    usuario.correo?.toLowerCase() === values.correo?.toLowerCase() &&
                    String(usuario.id) !== String(id)
            );
            if (duplicado.length) throw new ApiError("Ya existe una cuenta con ese correo.", { status: 409 });

            const previo = await usuariosMock.get(id);
            const actualizado = await usuariosMock.update(id, values);
            if (previo.correo !== actualizado.correo && Object.prototype.hasOwnProperty.call(MOCK_PASSWORDS, previo.correo)) {
                MOCK_PASSWORDS[actualizado.correo] = MOCK_PASSWORDS[previo.correo];
                delete MOCK_PASSWORDS[previo.correo];
            }
            return mapUsuario(actualizado);
        }
        return mapUsuario(unwrapItem(await http.patch(ENDPOINTS.usuarios.byId(id), values)));
    },

    listAprendices() {
        return usuariosService.list({ rol: "aprendiz" });
    },
};
