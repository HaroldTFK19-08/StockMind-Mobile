import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { tokenStorage, userStorage, mockSession, ApiError } from "@/core";
import { authService } from "./auth.service";
import { usuariosService } from "@/modules/usuarios/usuarios.service";
import { ROLES } from "./roles";

const AuthContext = createContext(null);
const ROLES_VALIDOS = Object.values(ROLES);

/**
 * Estado global de sesión.
 *   status: "restoring" (leyendo la sesión guardada) | "ready"
 *   user:   usuario autenticado o null
 *
 * La sesión es LOCAL (Laravel aún no tiene login). mockSession guarda el
 * usuario para que los módulos demo filtren por él (p. ej. "mis asignaciones").
 */
export function AuthProvider({ children }) {
    const [status, setStatus] = useState("restoring");
    const [user, setUser] = useState(null);

    const clearSession = useCallback(async () => {
        mockSession.clear();
        setUser(null);
        await Promise.all([tokenStorage.clear(), userStorage.clear()]);
    }, []);

    const saveUser = useCallback(async (nextUser) => {
        mockSession.set(nextUser);
        setUser(nextUser);
        await userStorage.set(nextUser);
    }, []);

    const startSession = useCallback(
        async ({ token, user: nextUser }) => {
            if (!ROLES_VALIDOS.includes(nextUser?.rol)) {
                throw new ApiError("Tu cuenta no tiene un rol válido para usar la app.");
            }
            await tokenStorage.set(token);
            await saveUser(nextUser);
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
                mockSession.set(cached);
                if (activo) setUser(cached);
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
            // Si el backend inicia sesión al registrarse, se aprovecha
            if (result?.token && result?.user) await startSession(result);
            return result;
        },
        [startSession]
    );

    const updateProfile = useCallback(
        async (values) => {
            if (!user?.id) throw new ApiError("No se pudo identificar tu cuenta.");
            const updated = await usuariosService.update(user.id, values);
            const returnedFields = Object.fromEntries(
                Object.entries(updated).filter(([, value]) => value !== undefined)
            );
            const nextUser = { ...user, ...returnedFields, ...values };
            await saveUser(nextUser);
            return nextUser;
        },
        [user, saveUser]
    );

    const logout = clearSession;

    const value = useMemo(
        () => ({ status, user, isAuthenticated: Boolean(user), login, register, updateProfile, logout }),
        [status, user, login, register, updateProfile, logout]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
    return ctx;
}
