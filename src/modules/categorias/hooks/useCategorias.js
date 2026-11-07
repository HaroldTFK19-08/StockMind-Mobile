import { useCrud } from "@/shared/hooks";
import { categoriasService } from "../categorias.service";

/**
 * Datos de /categorias listos para usar en una pantalla:
 * lista (data, loading, error, refresh) + crear / actualizar / eliminar.
 */
export function useCategorias(options) {
    return useCrud(categoriasService, options);
}
