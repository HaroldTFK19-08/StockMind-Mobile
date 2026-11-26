import api, { datos, todas, enviar } from "@/core/config/api/consumo";
import { cuentasStorage } from "@/core";
import { ESTADO_ROL, ROLES, normalizarUsuario, normalizeRole } from "@/modules/auth/roles";

// Ruta /usuarios → tabla `users` del backend
const RUTA = "/usuarios";

const sinContrasena = (cuenta) => {
    const { contrasena: _password, ...user } = cuenta;
    return normalizarUsuario(user);
};

export const usuariosService = {
    /** GET /usuarios (junta todas las páginas del paginate) + cuentas creadas en el dispositivo. */
    async list() {
        let backend = [];
        let errorBackend = null;
        try {
            backend = await todas(RUTA);
        } catch (error) {
            errorBackend = error;
        }

        const locales = (await cuentasStorage.list()).map(sinContrasena);
        if (!locales.length && errorBackend) throw errorBackend;

        const usuarios = [...backend.map(normalizarUsuario), ...locales];
        const vistos = new Set();
        return usuarios.filter((usuario) => {
            const clave = String(usuario.id ?? usuario.documento ?? usuario.correo ?? "").toLowerCase();
            if (!clave || vistos.has(clave)) return false;
            vistos.add(clave);
            return true;
        });
    },

    /** GET /usuarios/:id */
    async get(id) {
        return datos(await api.get(`${RUTA}/${id}`));
    },

    /** PUT /usuarios/:id */
    async update(id, values) {
        return datos(await enviar("put", `${RUTA}/${id}`, values));
    },

    /**
     * Aprueba un rol de una cuenta creada desde la app.
     * El campo `estado` vive en la relación usuario-rol (tabla de roles del modelo).
     */
    async aprobarRol(id, rol) {
        const cuenta = await cuentasStorage.get(id);
        if (!cuenta) {
            throw new Error("Esta cuenta viene del servidor; su rol se aprueba allí.");
        }
        const roles = (cuenta.roles ?? []).map((item) =>
            item.rol === rol ? { ...item, estado: ESTADO_ROL.APROBADO } : item
        );
        const rolActivo = roles.find((item) => item.estado === ESTADO_ROL.APROBADO)?.rol ?? cuenta.rol;
        await cuentasStorage.save({ ...cuenta, roles, rol: rolActivo });
        return sinContrasena({ ...cuenta, roles, rol: rolActivo });
    },

    /** Aprendices: se sacan del mismo listado, filtrando por el rol aprobado. */
    async listAprendices() {
        const usuarios = await usuariosService.list();
        return usuarios.filter((u) =>
            (u.roles ?? []).some(
                (r) => r.rol === ROLES.APRENDIZ && r.estado === ESTADO_ROL.APROBADO
            ) || normalizeRole(u.rol ?? u.rolLabel ?? u.role) === ROLES.APRENDIZ
        );
    },
};
