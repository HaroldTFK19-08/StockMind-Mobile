import { nombrePersona } from "@/shared/utils";

/** Campos de RegistroFichaRequest (tabla coursegroups). */
export const FICHA_CAMPOS = [
    { name: "codigo", label: "Código de ficha", icon: "id-card-outline", requerido: true },
    { name: "programa", label: "Programa", icon: "school-outline", requerido: true },
    { name: "fecha_inicio", label: "Fecha de inicio", tipo: "fecha", requerido: true },
    { name: "fecha_fin", label: "Fecha de fin", tipo: "fecha", icon: "calendar-clear-outline", requerido: true },
    {
        // No hay ruta /instructores: se escribe el id (tabla teachers)
        name: "teacher_id",
        label: "ID del instructor",
        icon: "person-outline",
        tipo: "numero",
        requerido: true,
        mostrar: (f) => nombrePersona(f, "teacher", "teacher_id", "Instructor"),
    },
];
