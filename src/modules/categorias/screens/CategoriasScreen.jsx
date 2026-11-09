import { CrudScreen } from "@/shared/ui";
import PortalHeader from "@/navigation/PortalHeader";
import { useCategorias } from "../hooks/useCategorias";
import { CATEGORIA_CAMPOS } from "../categorias.config";
import { categoriasSchema } from "../validaciones/categorias.schema";

/** Pantalla de Categorías — GET, POST, PUT y DELETE /categorias. */
export default function CategoriasScreen({ puedeEditar = true }) {
    const categorias = useCategorias();
    return (
        <CrudScreen
            header={<PortalHeader showBack />}
            recurso={categorias}
            campos={CATEGORIA_CAMPOS}
            crearEsquema={categoriasSchema}
            titulo="Categorías"
            nombre="Categoría"
            femenino
            icono="pricetags-outline"
            tituloItem={(c) => c.nombre}
            subtituloItem={(c) => c.descripcion}
            puedeEditar={puedeEditar}
        />
    );
}
