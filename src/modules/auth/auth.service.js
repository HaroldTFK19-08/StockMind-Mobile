import api from "@/core/config/api/consumo";
import { tokenStorage } from "@/core/storage/tokenStorage";
import { cuentasStorage } from "@/core";
import { ESTADO_ROL, ROLES, normalizarUsuario } from "./roles";

const TEST_PASSWORDS = {
    [ROLES.ADMIN]: "Admin123!",
    [ROLES.INSTRUCTOR]: "Instructor123!",
    [ROLES.CUENTADANTE]: "Cuentadante123!",
    [ROLES.APRENDIZ]: "Aprendiz123!",
};

const aprobado = (rol) => ({ rol, estado: ESTADO_ROL.APROBADO });

export const TEST_CREDENTIALS = [
    {
        rol: ROLES.ADMIN,
        nombre: "Administrador demo",
        documento: "1000000001",
        correo: "admin@stockmind.test",
        contrasena: TEST_PASSWORDS[ROLES.ADMIN],
        roles: [aprobado(ROLES.ADMIN)],
    },
    {
        // Un instructor también puede ser cuentadante (varios roles por persona).
        rol: ROLES.INSTRUCTOR,
        nombre: "Instructor demo",
        documento: "1000000002",
        correo: "instructor@stockmind.test",
        contrasena: TEST_PASSWORDS[ROLES.INSTRUCTOR],
        roles: [aprobado(ROLES.INSTRUCTOR), aprobado(ROLES.CUENTADANTE)],
    },
    {
        rol: ROLES.CUENTADANTE,
        nombre: "Cuentadante demo",
        documento: "1000000003",
        correo: "cuentadante@stockmind.test",
        contrasena: TEST_PASSWORDS[ROLES.CUENTADANTE],
        roles: [aprobado(ROLES.CUENTADANTE)],
    },
    {
        rol: ROLES.APRENDIZ,
        nombre: "Aprendiz demo",
        documento: "1000000004",
        correo: "aprendiz@stockmind.test",
        contrasena: TEST_PASSWORDS[ROLES.APRENDIZ],
        roles: [aprobado(ROLES.APRENDIZ)],
    },
];

const DEMO_TOKEN_PREFIX = "stockmind-demo-token";

const sesionDe = (cuenta, token) => {
    const { contrasena: _password, ...user } = cuenta;
    return { token, user: normalizarUsuario({ id: user.documento, ...user }) };
};

/** El backend devuelve nombre_1/apellido_1/email; la app espera nombre/correo/documento. */
const desdeBackend = (usuario = {}) => ({
    ...usuario,
    nombre: [usuario.nombre_1, usuario.nombre_2, usuario.apellido_1, usuario.apellido_2]
        .filter(Boolean)
        .join(" "),
    correo: usuario.email,
    documento: usuario.numero_identidad,
});

export const authService = {
    async login({ correo, contrasena }) {
        const correoNormal = correo.trim().toLowerCase();
        try {
            const { data } = await api.post("/auth/login", {
                email: correoNormal,
                password: contrasena,
            });
            if (!data?.token) throw new Error("El servidor no devolvió un token de sesión.");
            await tokenStorage.set(data.token);
            return { token: data.token, user: normalizarUsuario(desdeBackend(data.usuario)) };
        } catch (error) {
            // Si no hay servidor, no se disfraza el error de red.
            if (error.isNetworkError) throw error;
            // Las cuentas creadas localmente desde el registro siguen funcionando.
            const local = await cuentasStorage.findByCorreo(correoNormal);
            if (local && local.contrasena === contrasena) {
                return sesionDe(local, `${DEMO_TOKEN_PREFIX}-${local.rol}`);
            }
            throw error;
        }
    },

    /** Registro en dos pasos: datos primero, roles al final (siempre pendientes). */
    async register(values) {
        const correo = values.correo.trim().toLowerCase();
        if (await cuentasStorage.findByCorreo(correo)) {
            throw new Error("Ya existe una cuenta con ese correo.");
        }

        const roles = (values.roles ?? []).map((rol) => ({ rol, estado: ESTADO_ROL.PENDIENTE }));
        const cuenta = {
            id: values.documento.trim(),
            nombre: values.nombre.trim(),
            documento: values.documento.trim(),
            correo,
            contrasena: values.contrasena,
            rol: roles[0]?.rol ?? ROLES.APRENDIZ,
            roles,
        };
        await cuentasStorage.save(cuenta);
        return sesionDe(cuenta, `${DEMO_TOKEN_PREFIX}-pendiente`);
    },

    /** Vuelve a leer la cuenta guardada para ver si el administrador ya aprobó. */
    async refresh(id, usuarioActual) {
        const cuenta = await cuentasStorage.get(id);
        if (!cuenta) return usuarioActual;
        return sesionDe(cuenta, `${DEMO_TOKEN_PREFIX}-${cuenta.rol}`).user;
    },
};
