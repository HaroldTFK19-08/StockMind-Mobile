import { elementosService } from "@/modules/elementos/elementos.service";
import { formatDate, relacion, nombrePersona } from "@/shared/utils";

/** Campos de RegistroPrestamoRequest (tabla loans). */
export const PRESTAMO_CAMPOS = [
    {
        name: "element_id",
        label: "Elemento",
        icon: "cube-outline",
        tipo: "relacion",
        requerido: true,
        cargar: () => elementosService.list(),
        etiqueta: (e) => e.nombre,
        descripcion: (e) => `${e.codigo_inventario} · ${e.estado}`,
        mostrar: (p) => relacion(p, "element", "element_id", "Elemento"),
    },
    {
        // No hay ruta /instructores: se escribe el id (tabla teachers)
        name: "teacher_id",
        label: "ID del instructor",
        icon: "person-outline",
        tipo: "numero",
        requerido: true,
        mostrar: (p) => nombrePersona(p, "teacher", "teacher_id", "Instructor"),
    },
    { name: "fecha_prestamo", label: "Fecha del préstamo", tipo: "fecha" },
    { name: "fecha_devolucion_esperada", label: "Devolución esperada", tipo: "fecha", icon: "calendar-clear-outline", requerido: true },
    { name: "fecha_devolucion_real", label: "Devolución real", tipo: "fecha", icon: "checkmark-done-outline" },
    { name: "estado", label: "Estado", tipo: "opciones", opciones: ["activo", "devuelto", "vencido"], requerido: true },
    { name: "observaciones", label: "Observaciones", icon: "chatbox-ellipses-outline", tipo: "largo" },
];

export const tituloPrestamo = (p) => relacion(p, "element", "element_id", "Elemento") ?? `Préstamo #${p.id}`;
export const subtituloPrestamo = (p) =>
    `${formatDate(p.fecha_prestamo)} → ${formatDate(p.fecha_devolucion_esperada, "sin fecha")}`;
