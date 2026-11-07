import { useCrud } from "@/shared/hooks";
import { prestamosService } from "../prestamos.service";

/**
 * Datos de /prestamos listos para usar en una pantalla:
 * lista (data, loading, error, refresh) + crear / actualizar / eliminar.
 */
export function usePrestamos(options) {
    return useCrud(prestamosService, options);
}
