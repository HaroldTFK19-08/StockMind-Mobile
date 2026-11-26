import { useAuth } from "@/modules/auth";
import { AsignacionesScreen } from "@/modules/asignaciones";

/** El cuentadante solo consulta los equipos de su ambiente (cuentadantes.id_ambiente). */
export default function DanteAsignaciones() {
    const { user } = useAuth();
    return <AsignacionesScreen ambienteId={user?.ambiente_id} />;
}
