import { CrudScreen } from "@/shared/ui";
import PortalHeader from "@/navigation/PortalHeader";
import { useAlmacenes } from "../hooks/useAlmacenes";
import { ALMACEN_CAMPOS } from "../almacenes.config";

/** Pantalla de Almacenes — GET, POST, PUT y DELETE /almacenes. */
export default function AlmacenesScreen({ puedeEditar = true }) {
    const almacenes = useAlmacenes();
    return (
        <CrudScreen
            header={<PortalHeader showBack />}
            recurso={almacenes}
            campos={ALMACEN_CAMPOS}
            titulo="Almacenes"
            nombre="Almacén"
            icono="archive-outline"
            tituloItem={(a) => a.nombre}
            subtituloItem={(a) => [a.headquarter?.nombre, `Capacidad: ${a.capacidad_elementos}`].filter(Boolean).join(" · ")}
            campoEstado="estado"
            puedeEditar={puedeEditar}
        />
    );
}
