import { useCrud } from "@/shared/hooks";
import { trasladosService } from "../traslados.service";

/**
 * Datos de /traslados listos para usar en una pantalla:
 * lista (data, loading, error, refresh) + crear / actualizar / eliminar.
 */
export function useTraslados(options) {
    return useCrud(trasladosService, options);
}
