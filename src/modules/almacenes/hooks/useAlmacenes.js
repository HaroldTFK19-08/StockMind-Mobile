import { useCrud } from "@/shared/hooks";
import { almacenesService } from "../almacenes.service";

/**
 * Datos de /almacenes listos para usar en una pantalla:
 * lista (data, loading, error, refresh) + crear / actualizar / eliminar.
 */
export function useAlmacenes(options) {
    return useCrud(almacenesService, options);
}
