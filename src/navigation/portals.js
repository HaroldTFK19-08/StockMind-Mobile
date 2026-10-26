import { ROLES } from "@/modules/auth/roles";

/**
 * Un "portal" por rol: qué pestañas ve, a dónde lleva su perfil y
 * qué opciones extra aparecen en el menú lateral.
 * Las rutas deben existir en /app/<carpeta>/.
 */
export const PORTALS = {
    [ROLES.ADMIN]: {
        base: "/admin",
        tabs: [
            { name: "home", title: "Inicio", icon: "home" },
            { name: "elementos", title: "Inventario", icon: "cube" },
            { name: "reportes", title: "Reportes", icon: "document-text" },
            { name: "centros", title: "Centros", icon: "business" },
        ],
        hidden: ["usuarios", "notificaciones", "perfil"],
        notifications: "/admin/notificaciones",
        menu: [
            { label: "Usuarios", description: "Personas registradas", icon: "people-outline", href: "/admin/usuarios" },
            { label: "Notificaciones", description: "Novedades del sistema", icon: "notifications-outline", href: "/admin/notificaciones" },
        ],
    },
    [ROLES.INSTRUCTOR]: {
        base: "/instructor",
        tabs: [
            { name: "home", title: "Inicio", icon: "home" },
            { name: "ambientes", title: "Ambientes", icon: "easel" },
            { name: "reportes", title: "Reportes", icon: "document-text" },
        ],
        hidden: ["perfil"],
        menu: [],
    },
    [ROLES.CUENTADANTE]: {
        base: "/cuentaDante",
        tabs: [
            { name: "home", title: "Inicio", icon: "home" },
            { name: "ambientes", title: "Ambientes", icon: "easel" },
            { name: "asignaciones", title: "Asignaciones", icon: "clipboard" },
            { name: "traslados", title: "Traslados", icon: "swap-horizontal" },
        ],
        hidden: ["perfil"],
        menu: [],
    },
    [ROLES.APRENDIZ]: {
        base: "/aprendiz",
        tabs: [
            { name: "home", title: "Inicio", icon: "home" },
            { name: "elementos", title: "Mis elementos", icon: "cube" },
            { name: "reportes", title: "Reportes", icon: "document-text" },
        ],
        hidden: ["perfil"],
        menu: [],
    },
};

export const homeOf = (rol) => (PORTALS[rol] ? `${PORTALS[rol].base}/home` : "/auth/inicio");
export const profileOf = (rol) => (PORTALS[rol] ? `${PORTALS[rol].base}/perfil` : "/auth/inicio");
