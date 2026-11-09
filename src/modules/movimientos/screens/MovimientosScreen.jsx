import { CrudScreen } from "@/shared/ui";
import PortalHeader from "@/navigation/PortalHeader";
import { useMovimientos } from "../hooks/useMovimientos";
import { MOVIMIENTO_CAMPOS, tituloMovimiento, subtituloMovimiento, movimientoEditable } from "../movimientos.config";
import { movimientosSchema } from "../validations/movimientos.schema";

/** Pantalla de Movimientos — GET, POST, PUT y DELETE /movimientos. */
export default function MovimientosScreen({ puedeEditar = true }) {
    const movimientos = useMovimientos();
    return (
        <CrudScreen
            header={<PortalHeader showBack />}
            recurso={movimientos}
            campos={MOVIMIENTO_CAMPOS}
            crearEsquema={movimientosSchema}
            titulo="Movimientos"
            nombre="Movimiento"
            icono="git-compare-outline"
            tituloItem={tituloMovimiento}
            subtituloItem={subtituloMovimiento}
            editable={movimientoEditable}
            puedeEditar={puedeEditar}
        />
    );
}
