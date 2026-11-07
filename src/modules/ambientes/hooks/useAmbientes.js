import { useCrud } from "@/shared/hooks";
import { ambientesService } from "../ambientes.service";

/**
 * Datos de /ambientes listos para usar en una pantalla:
 * lista (data, loading, error, refresh) + crear / actualizar / eliminar.
 */
export function useAmbientes(options) {
    return useCrud(ambientesService, options);
}
