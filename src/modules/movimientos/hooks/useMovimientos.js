import { useCrud } from "@/shared/hooks";
import { movimientosService } from "../movimientos.service";

/**
 * Datos de /movimientos listos para usar en una pantalla:
 * lista (data, loading, error, refresh) + crear / actualizar / eliminar.
 */
export function useMovimientos(options) {
    return useCrud(movimientosService, options);
}
