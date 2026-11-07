import { useCrud } from "@/shared/hooks";
import { reportesService } from "../reportes.service";

/**
 * Datos de /reportes listos para usar en una pantalla:
 * lista (data, loading, error, refresh) + crear / actualizar / eliminar.
 */
export function useReportes(options) {
    return useCrud(reportesService, options);
}
