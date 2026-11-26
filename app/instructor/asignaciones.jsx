import { useAuth } from "@/modules/auth";
import { AsignacionesScreen } from "@/modules/asignaciones";

/** El instructor registra las asignaciones; el id del instructor se toma de la sesión. */
export default function InstructorAsignaciones() {
    const { user } = useAuth();
    return <AsignacionesScreen puedeAsignar instructorId={user?.id} />;
}
