/**
 * Contrato de rutas del backend.
 * Si tu API usa otros nombres, cámbialos SOLO aquí.
 * El login todavía no existe en Laravel: auth funciona local (auth.service.js).
 */
export const ENDPOINTS = {
    dashboard: {
        resumen: "/dashboard/resumen",
    },
    usuarios: {
        base: "/usuarios",
        byId: (id) => `/usuarios/${id}`,
    },
    centros: {
        base: "/centros",
        byId: (id) => `/centros/${id}`,
    },
    ambientes: {
        base: "/ambientes",
        byId: (id) => `/ambientes/${id}`,
    },
    elementos: {
        base: "/elementos",
        byId: (id) => `/elementos/${id}`,
    },
    asignaciones: {
        base: "/asignaciones",
        mias: "/asignaciones/mias",
        byId: (id) => `/asignaciones/${id}`,
    },
    traslados: {
        base: "/traslados",
        byId: (id) => `/traslados/${id}`,
    },
    reportes: {
        base: "/reportes",
        mios: "/reportes/mios",
        byId: (id) => `/reportes/${id}`,
    },
    notificaciones: {
        base: "/notificaciones",
        marcarLeida: (id) => `/notificaciones/${id}/leida`,
        marcarTodas: "/notificaciones/leer-todas",
    },
};
