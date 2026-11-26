import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { tokenStorage, userStorage } from "@/core";
import { authService } from "./auth.service";
import { usuariosService } from "@/modules/usuarios/usuarios.service";
import { normalizarUsuario, ROLES, rolesAprobados, tieneRol } from "./roles";

const AuthContext = createContext(null);
const ROLES_VALIDOS = Object.values(ROLES);

/**
 * Estado global de sesión.
 *   status: "restoring" (leyendo la sesión guardada) | "ready"
 *   user:   usuario autenticado o null
 *   user.roles: [{ rol, estado }] → un usuario puede tener varios roles
 *   user.rol: rol activo con el que se entra a los portales
 */
export function AuthProvider({ children }) {
    const [status, setStatus] = useState("restoring");
    const [user, setUser] = useState(null);

    const clearSession = useCallback(async () => {
        setUser(null);
        await Promise.all([tokenStorage.clear(), userStorage.clear()]);
    }, []);

    const saveUser = useCallback(async (nextUser) => {
        const normalizado = normalizarUsuario(nextUser);
        setUser(normalizado);
        await userStorage.set(normalizado);
        return normalizado;
    }, []);

    const startSession = useCallback(
        async ({ token, user: nextUser }) => {
            const normalizado = normalizarUsuario(nextUser);
            if (!normalizado?.rol || !ROLES_VALIDOS.includes(normalizado.rol)) {
                throw new Error("Tu cuenta no tiene un rol válido para usar la app.");
            }
            await tokenStorage.set(token);
            return saveUser(normalizado);
        },
        [saveUser]
    );

    // Restaurar sesión al abrir la app
    useEffect(() => {
        let activo = true;
        (async () => {
            try {
                const [token, cached] = await Promise.all([tokenStorage.get(), userStorage.get()]);
                if (!token || !cached) return;
                if (activo) setUser(normalizarUsuario(cached));
            } catch {
                await clearSession();
            } finally {
                if (activo) setStatus("ready");
            }
        })();
        return () => {
            activo = false;
        };
    }, [clearSession]);

    const login = useCallback(
        async (credentials) => {
            const session = await authService.login(credentials);
            await startSession(session);
            return session.user;
        },
        [startSession]
    );

    const register = useCallback(
        async (values) => {
            const result = await authService.register(values);
            if (result?.token && result?.user) await startSession(result);
            return result;
        },
        [startSession]
    );

    /** Cambia el portal activo cuando la persona tiene varios roles aprobados. */
    const setRolActivo = useCallback(
        async (rol) => {
            if (!user || !tieneRol(user, rol)) return null;
            return saveUser({ ...user, rol });
        },
        [user, saveUser]
    );

    /** Vuelve a leer la cuenta guardada después de la aprobación del administrador. */
    const recargarSesion = useCallback(async () => {
        if (!user?.id) return user;
        const actualizado = await authService.refresh(user.id, user);
        return saveUser(actualizado);
    }, [user, saveUser]);

    const updateProfile = useCallback(
        async (values) => {
            if (!user?.id) throw new Error("No se pudo identificar tu cuenta.");
            const updated = await usuariosService.update(user.id, values);
            const returnedFields = Object.fromEntries(
                Object.entries(updated).filter(([, value]) => value !== undefined)
            );
            const nextUser = { ...user, ...returnedFields, ...values };
            return saveUser(nextUser);
        },
        [user, saveUser]
    );

    const logout = clearSession;

    const value = useMemo(
        () => ({
            status,
            user,
            isAuthenticated: Boolean(user),
            rolesAprobados: rolesAprobados(user),
            login,
            register,
            setRolActivo,
            recargarSesion,
            updateProfile,
            logout,
        }),
        [status, user, login, register, setRolActivo, recargarSesion, updateProfile, logout]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
    return ctx;
}
