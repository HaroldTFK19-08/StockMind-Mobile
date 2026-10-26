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

/** Roles que se pueden elegir al registrarse desde la app. */
export const ROLES_REGISTRO = [
    { label: "Aprendiz", value: ROLES.APRENDIZ },
    { label: "Instructor", value: ROLES.INSTRUCTOR },
];

/**
 * Convierte el rol que envía el backend ("ADMIN", "Administrador",
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

export const roleLabel = (rol) => ROLE_LABELS[rol] ?? "Usuario";
