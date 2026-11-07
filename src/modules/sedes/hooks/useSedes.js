import { useCrud } from "@/shared/hooks";
import { sedesService } from "../sedes.service";

/**
 * Datos de /sedes listos para usar en una pantalla:
 * lista (data, loading, error, refresh) + crear / actualizar / eliminar.
 */
export function useSedes(options) {
    return useCrud(sedesService, options);
}
