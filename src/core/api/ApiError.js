export class ApiError extends Error {
    /**
     * @param {string} message  Mensaje listo para mostrar al usuario
     * @param {object} [options]
     * @param {number} [options.status]  Código HTTP (0 = sin conexión / timeout)
     * @param {any}    [options.details] Cuerpo de la respuesta del backend
     */
    constructor(message, { status = 0, details = null } = {}) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.details = details;
        /** Errores por campo (Laravel 422): { correo: ["El correo ya existe."] } */
        this.fieldErrors = fieldErrorsFrom(details);
    }

    get isValidationError() {
        return this.status === 422;
    }

    get isUnauthorized() {
        return this.status === 401;
    }

    get isNetworkError() {
        return this.status === 0;
    }
}

const MENSAJES_HTTP = {
    400: "La solicitud tiene datos inválidos.",
    401: "Tu sesión expiró. Inicia sesión de nuevo.",
    403: "No tienes permisos para realizar esta acción.",
    404: "El recurso solicitado no existe.",
    409: "El registro ya existe o está en conflicto.",
    422: "Revisa los datos enviados.",
    500: "Error interno del servidor.",
};

/** Laravel devuelve { message, errors: { campo: ["msg", ...] } } en las validaciones. */
function fieldErrorsFrom(body) {
    const errors = body && typeof body === "object" ? body.errors : null;
    if (!errors || typeof errors !== "object" || Array.isArray(errors)) return {};
    return Object.fromEntries(
        Object.entries(errors).map(([campo, msgs]) => [campo, Array.isArray(msgs) ? msgs : [String(msgs)]])
    );
}

/** Obtiene el mensaje más útil posible de una respuesta de error. */
export function messageFromResponse(status, body) {
    if (body && typeof body === "object") {
        // Validación de Laravel: se muestran los mensajes de cada campo
        const porCampo = Object.values(fieldErrorsFrom(body)).map((msgs) => msgs[0]).filter(Boolean);
        if (porCampo.length) return porCampo.join("\n");

        const msg = body.message ?? body.mensaje ?? body.error ?? body.detail;
        if (typeof msg === "string" && msg.trim()) return msg;
        if (Array.isArray(msg) && msg.length) return msg.join("\n");
    }
    return MENSAJES_HTTP[status] ?? `Error inesperado (${status}).`;
}
