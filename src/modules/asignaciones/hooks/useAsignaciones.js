import { useCrud } from "@/shared/hooks";
import { asignacionesService } from "../asignaciones.service";

/**
 * Datos de /asignaciones listos para usar en una pantalla:
 * lista (data, loading, error, refresh) + crear / actualizar / eliminar.
 */
export function useAsignaciones(options) {
    return useCrud(asignacionesService, options);
}
