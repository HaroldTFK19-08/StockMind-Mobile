import { useCrud } from "@/shared/hooks";
import { centrosService } from "../centros.service";

/**
 * Datos de /centros listos para usar en una pantalla:
 * lista (data, loading, error, refresh) + crear / actualizar / eliminar.
 */
export function useCentros(options) {
    return useCrud(centrosService, options);
}
