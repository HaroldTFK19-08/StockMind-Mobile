import { ROLES } from "@/modules/auth/roles";

/**
 * Qué muestra el inicio de cada rol.
 * stats[].key corresponde a un campo de mapResumen().
 */
export const HOME_CONFIG = {
    [ROLES.ADMIN]: {
        subtitle: "Este es el estado general del inventario.",
        stats: [
            { key: "elementos", label: "Elementos", icon: "cube-outline", tone: "green", href: "/admin/elementos" },
            { key: "reportesPendientes", label: "Reportes pendientes", icon: "alert-circle-outline", tone: "red", href: "/admin/reportes" },
            { key: "centros", label: "Centros", icon: "business-outline", tone: "blue", href: "/admin/centros" },
            { key: "usuarios", label: "Usuarios", icon: "people-outline", tone: "purple", href: "/admin/usuarios" },
        ],
        actions: [
            { icon: "cube-outline", title: "Gestionar inventario", description: "Registra elementos y actualiza su estado.", href: "/admin/elementos" },
            { icon: "people-outline", title: "Usuarios", description: "Consulta las personas registradas.", href: "/admin/usuarios" },
        ],
        recientes: { title: "Reportes recientes", href: "/admin/reportes" },
    },
    [ROLES.INSTRUCTOR]: {
        subtitle: "Consulta ambientes y reporta novedades de los elementos.",
        stats: [
            { key: "ambientes", label: "Ambientes", icon: "easel-outline", tone: "blue", href: "/instructor/ambientes" },
            { key: "misReportesAbiertos", label: "Mis reportes abiertos", icon: "document-text-outline", tone: "amber", href: "/instructor/reportes" },
        ],
        actions: [
            { icon: "easel-outline", title: "Ambientes", description: "Revisa disponibilidad y capacidad.", href: "/instructor/ambientes" },
            { icon: "alert-circle-outline", title: "Reportar una novedad", description: "Daños, fallas o pérdidas de elementos.", href: "/instructor/reportes" },
        ],
        recientes: { title: "Mis últimos reportes", href: "/instructor/reportes" },
    },
    [ROLES.CUENTADANTE]: {
        subtitle: "Controla asignaciones y traslados de tus ambientes.",
        stats: [
            { key: "asignacionesActivas", label: "Asignaciones activas", icon: "clipboard-outline", tone: "green", href: "/cuentaDante/asignaciones" },
            { key: "asignacionesPorVencer", label: "Por vencer", icon: "time-outline", tone: "amber", href: "/cuentaDante/asignaciones" },
            { key: "trasladosEnCurso", label: "Traslados en curso", icon: "swap-horizontal-outline", tone: "purple", href: "/cuentaDante/traslados" },
            { key: "ambientes", label: "Ambientes", icon: "easel-outline", tone: "blue", href: "/cuentaDante/ambientes" },
        ],
        actions: [
            { icon: "clipboard-outline", title: "Asignar un elemento", description: "Entrega elementos a los aprendices.", href: "/cuentaDante/asignaciones" },
            { icon: "swap-horizontal-outline", title: "Programar traslado", description: "Mueve elementos entre ambientes.", href: "/cuentaDante/traslados" },
        ],
        recientes: { title: "Traslados recientes", href: "/cuentaDante/traslados" },
    },
    [ROLES.APRENDIZ]: {
        subtitle: "Consulta y cuida los elementos que tienes asignados.",
        stats: [
            { key: "misElementos", label: "Mis elementos", icon: "cube-outline", tone: "green", href: "/aprendiz/elementos" },
            { key: "misReportesAbiertos", label: "Reportes abiertos", icon: "document-text-outline", tone: "amber", href: "/aprendiz/reportes" },
        ],
        actions: [
            { icon: "cube-outline", title: "Mis elementos", description: "Lo que tienes asignado y hasta cuándo.", href: "/aprendiz/elementos" },
            { icon: "alert-circle-outline", title: "Reportar una novedad", description: "¿Algo dejó de funcionar? Avísanos.", href: "/aprendiz/reportes" },
        ],
        recientes: { title: "Mis últimos reportes", href: "/aprendiz/reportes" },
    },
};
