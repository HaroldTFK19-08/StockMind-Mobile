import { ApiError, mockDelay, mockSession } from "@/core";
import { mapUsuario } from "@/modules/usuarios/usuarios.mapper";
import { usuariosMock, MOCK_PASSWORDS } from "@/modules/usuarios/usuarios.mock";
import { toLoginDTO, toRegisterDTO } from "./auth.mapper";

/**
 * Autenticación LOCAL.
 * Laravel todavía no tiene login, así que la sesión se maneja en el
 * dispositivo con las cuentas demo. No se hace ninguna petición a la API.
 * Cuando exista el login en el backend, solo hay que cambiar este archivo.
 */
export const authService = {
    /** Inicia sesión con las cuentas del sistema (demo). */
    async login(credentials) {
        const dto = toLoginDTO(credentials);
        await mockDelay(300);

        const [row] = await usuariosMock.list((u) => u.correo?.toLowerCase() === dto.correo?.toLowerCase());
        if (!row || MOCK_PASSWORDS[dto.correo] !== dto.contrasena) {
            throw new ApiError("Correo o contraseña incorrectos.", { status: 401 });
        }

        const user = mapUsuario(row);
        mockSession.set(user);
        // Token local: solo sirve para recordar la sesión en el celular.
        return { token: `local-token-${user.id}`, user };
    },

    /** Registra un usuario nuevo en memoria. */
    async register(values) {
        const dto = toRegisterDTO(values);
        await mockDelay(300);

        const existe = await usuariosMock.list((u) => u.correo?.toLowerCase() === dto.correo?.toLowerCase());
        if (existe.length) throw new ApiError("Ya existe una cuenta con ese correo.", { status: 409 });

        const row = await usuariosMock.create({
            ...dto,
            contrasena: undefined,
            programa: "Sin asignar",
            estado: "Activo",
        });
        MOCK_PASSWORDS[dto.correo] = dto.contrasena;
        return { token: null, user: mapUsuario(row) };
    },

    /** Usuario con sesión activa. */
    async me() {
        return mockSession.get();
    },
};
