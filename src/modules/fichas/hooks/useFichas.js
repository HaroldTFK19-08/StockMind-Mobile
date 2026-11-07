import { useCrud } from "@/shared/hooks";
import { fichasService } from "../fichas.service";

/**
 * Datos de /fichas listos para usar en una pantalla:
 * lista (data, loading, error, refresh) + crear / actualizar / eliminar.
 */
export function useFichas(options) {
    return useCrud(fichasService, options);
}
