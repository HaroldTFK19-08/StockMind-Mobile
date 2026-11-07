import { sedesService } from "@/modules/sedes/sedes.service";
import { relacion } from "@/shared/utils";

/** Campos de RegistroAmbienteRequest (tabla environments). */
export const AMBIENTE_CAMPOS = [
    { name: "nombre", label: "Nombre", icon: "easel-outline", requerido: true },
    { name: "tipo", label: "Tipo", icon: "albums-outline", requerido: true },
    { name: "capacidad", label: "Capacidad (personas)", icon: "people-outline", tipo: "numero", requerido: true },
    { name: "estado", label: "Estado", tipo: "opciones", opciones: ["activo", "inactivo"], requerido: true },
    {
        name: "headquarter_id",
        label: "Sede",
        icon: "git-branch-outline",
        tipo: "relacion",
        requerido: true,
        cargar: () => sedesService.list(),
        mostrar: (a) => relacion(a, "headquarter", "headquarter_id", "Sede"),
    },
    { name: "teacher_id", label: "ID del instructor (opcional)", icon: "person-outline", tipo: "numero" },
];
