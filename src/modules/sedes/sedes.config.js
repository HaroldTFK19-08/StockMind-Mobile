import { centrosService } from "@/modules/centros/centros.service";
import { relacion } from "@/shared/utils";

/** Campos de RegistroSedeRequest (tabla headquarters). */
export const SEDE_CAMPOS = [
    { name: "nombre", label: "Nombre", icon: "git-branch-outline", requerido: true },
    { name: "direccion", label: "Dirección", icon: "location-outline", requerido: true },
    { name: "zona", label: "Zona", tipo: "opciones", opciones: ["urbana", "rural"], requerido: true },
    {
        name: "trainingcenter_id",
        label: "Centro de formación",
        icon: "business-outline",
        tipo: "relacion",
        requerido: true,
        cargar: () => centrosService.list(),
        mostrar: (s) => relacion(s, "trainingcenter", "trainingcenter_id", "Centro"),
    },
];
