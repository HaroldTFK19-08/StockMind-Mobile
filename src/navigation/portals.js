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
        // Rutas que existen en /app/admin pero no van en la barra inferior (se abren desde el menú)
        hidden: ["usuarios", "notificaciones", "perfil", "ambientes", "sedes", "almacenes", "categorias", "fichas", "movimientos", "prestamos"],
        notifications: "/admin/notificaciones",
        menu: [
            { label: "Usuarios", description: "Personas registradas", icon: "people-outline", href: "/admin/usuarios" },
            { label: "Notificaciones", description: "Novedades del sistema", icon: "notifications-outline", href: "/admin/notificaciones" },
            { label: "Sedes", description: "Sedes de cada centro", icon: "git-branch-outline", href: "/admin/sedes" },
            { label: "Ambientes", description: "Salones, talleres y laboratorios", icon: "easel-outline", href: "/admin/ambientes" },
            { label: "Almacenes", description: "Dónde se guardan los elementos", icon: "archive-outline", href: "/admin/almacenes" },
            { label: "Categorías", description: "Tipos de elementos", icon: "pricetags-outline", href: "/admin/categorias" },
            { label: "Fichas", description: "Grupos de formación", icon: "id-card-outline", href: "/admin/fichas" },
            { label: "Movimientos", description: "Entradas y salidas", icon: "git-compare-outline", href: "/admin/movimientos" },
            { label: "Préstamos", description: "Elementos prestados", icon: "hand-left-outline", href: "/admin/prestamos" },
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
        hidden: ["perfil", "prestamos", "movimientos"],
        menu: [
            { label: "Préstamos", description: "Elementos prestados", icon: "hand-left-outline", href: "/cuentaDante/prestamos" },
            { label: "Movimientos", description: "Entradas y salidas", icon: "git-compare-outline", href: "/cuentaDante/movimientos" },
        ],
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
