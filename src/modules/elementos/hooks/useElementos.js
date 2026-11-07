import { useCrud } from "@/shared/hooks";
import { elementosService } from "../elementos.service";

/**
 * Datos de /elementos listos para usar en una pantalla:
 * lista (data, loading, error, refresh) + crear / actualizar / eliminar.
 */
export function useElementos(options) {
    return useCrud(elementosService, options);
}
