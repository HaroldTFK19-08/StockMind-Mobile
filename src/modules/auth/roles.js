import { normalize } from "@/shared/utils/text";

export const ROLES = {
    ADMIN: "admin",
    INSTRUCTOR: "instructor",
    CUENTADANTE: "cuentadante",
    APRENDIZ: "aprendiz",
};

export const ROLE_LABELS = {
    admin: "Administrador",
    instructor: "Instructor",
    cuentadante: "Cuentadante",
    aprendiz: "Aprendiz",
};

/**
 * Cada rol de una persona tiene su propio estado.
 * El backend debe guardar este campo en la relación usuario-rol (tabla de roles
 * del modelo) para que el administrador pueda aprobarlo.
 */
export const ESTADO_ROL = {
    APROBADO: "aprobado",
    PENDIENTE: "pendiente",
};

/** Roles que se pueden elegir al registrarse desde la app. */
export const ROLES_REGISTRO = [
    { label: "Aprendiz", value: ROLES.APRENDIZ },
    { label: "Instructor", value: ROLES.INSTRUCTOR },
];

/**
 * Convierte el rol recibido ("ADMIN", "Administrador",
 * "Cuenta dante", { nombre: "Instructor" }…) a una clave interna.
 */
export function normalizeRole(raw) {
    const value = normalize(typeof raw === "object" && raw ? raw.nombre ?? raw.name : raw).replace(/[\s_-]/g, "");
    if (!value) return null;
    if (value.startsWith("admin")) return ROLES.ADMIN;
    if (value.startsWith("instructor")) return ROLES.INSTRUCTOR;
    if (value.includes("dante")) return ROLES.CUENTADANTE;
    if (value.startsWith("aprendiz")) return ROLES.APRENDIZ;
    return null;
}

/** Convierte uno o varios roles (texto u objeto) a la forma { rol, estado }. */
export function normalizarRoles(raw, rolFallback) {
    const entradas = Array.isArray(raw) ? raw : raw == null ? [] : [raw];
    const roles = [];

    for (const entrada of entradas) {
        const esObjeto = Boolean(entrada) && typeof entrada === "object";
        const rol = normalizeRole(
            esObjeto ? entrada.rol ?? entrada.role ?? entrada.nombre ?? entrada.name : entrada
        );
        if (!rol || roles.some((r) => r.rol === rol)) continue;

        const estadoRaw = esObjeto ? entrada.estado ?? entrada.estatus : null;
        const estado =
            String(estadoRaw ?? "").trim().toLowerCase() === ESTADO_ROL.PENDIENTE
                ? ESTADO_ROL.PENDIENTE
                : ESTADO_ROL.APROBADO;
        roles.push({ rol, estado });
    }

    // Cuentas antiguas que solo tenían un rol: se respetan como aprobadas.
    if (!roles.length) {
        const rol = normalizeRole(rolFallback);
        if (rol) roles.push({ rol, estado: ESTADO_ROL.APROBADO });
    }
    return roles;
}

/** Deja el usuario en la forma que espera el resto de la app (user.rol sigue siendo el activo). */
export function normalizarUsuario(raw) {
    if (!raw) return raw;
    const roles = normalizarRoles(raw.roles, raw.rol ?? raw.role ?? raw.rolLabel);
    const aprobados = roles.filter((r) => r.estado === ESTADO_ROL.APROBADO);
    const rol = aprobados.some((r) => r.rol === raw.rol)
        ? raw.rol
        : aprobados[0]?.rol ?? roles[0]?.rol ?? null;
    return { ...raw, roles, rol, rolLabel: ROLE_LABELS[rol] ?? "Usuario" };
}

export const rolesAprobados = (user) =>
    (user?.roles ?? []).filter((r) => r.estado === ESTADO_ROL.APROBADO);

export const rolesPendientes = (user) =>
    (user?.roles ?? []).filter((r) => r.estado === ESTADO_ROL.PENDIENTE);

/** No tiene ningún rol aprobado: debe esperar en la pantalla de autenticación. */
export const usuarioPendiente = (user) =>
    (user?.roles ?? []).length > 0 && rolesAprobados(user).length === 0;

/** Rol con el que se entra a los portales (el activo si sigue aprobado). */
export const rolActivo = (user) => {
    const actual = user?.rol;
    if (rolesAprobados(user).some((r) => r.rol === actual)) return actual;
    return rolesAprobados(user)[0]?.rol ?? actual ?? null;
};

export const tieneRol = (user, rol) => rolesAprobados(user).some((r) => r.rol === rol);

export const roleLabel = (rol) => ROLE_LABELS[rol] ?? "Usuario";

export const etiquetasRoles = (user) =>
    (user?.roles ?? []).map((r) => ({ ...r, etiqueta: ROLE_LABELS[r.rol] ?? r.rol }));
