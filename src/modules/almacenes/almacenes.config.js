import { sedesService } from "@/modules/sedes/sedes.service";
import { relacion } from "@/shared/utils";

/** Campos de RegistroAlmacenRequest (tabla warehouses). */
export const ALMACEN_CAMPOS = [
    { name: "nombre", label: "Nombre", icon: "archive-outline", requerido: true },
    { name: "capacidad_elementos", label: "Capacidad (elementos)", icon: "cube-outline", tipo: "numero", requerido: true },
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
];
