import { CrudScreen } from "@/shared/ui";
import PortalHeader from "@/navigation/PortalHeader";
import { todayISO } from "@/shared/utils";
import { usePrestamos } from "../hooks/usePrestamos";
import { PRESTAMO_CAMPOS, tituloPrestamo, subtituloPrestamo } from "../prestamos.config";
import { prestamosSchema } from "../validations/prestamos.schema";

/** Pantalla de Préstamos — GET, POST, PUT y DELETE /prestamos. */
export default function PrestamosScreen({ puedeEditar = true }) {
    const prestamos = usePrestamos();
    return (
        <CrudScreen
            header={<PortalHeader showBack />}
            recurso={prestamos}
            campos={PRESTAMO_CAMPOS}
            crearEsquema={prestamosSchema}
            titulo="Préstamos"
            nombre="Préstamo"
            icono="hand-left-outline"
            tituloItem={tituloPrestamo}
            subtituloItem={subtituloPrestamo}
            campoEstado="estado"
            porDefecto={{ fecha_prestamo: todayISO(), estado: "activo" }}
            puedeEditar={puedeEditar}
        />
    );
}
