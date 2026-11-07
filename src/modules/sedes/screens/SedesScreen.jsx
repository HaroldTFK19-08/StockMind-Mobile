import { CrudScreen } from "@/shared/ui";
import PortalHeader from "@/navigation/PortalHeader";
import { etiquetaEstado } from "@/shared/utils";
import { useSedes } from "../hooks/useSedes";
import { SEDE_CAMPOS } from "../sedes.config";

/** Pantalla de Sedes — GET, POST, PUT y DELETE /sedes. */
export default function SedesScreen({ puedeEditar = true }) {
    const sedes = useSedes();
    return (
        <CrudScreen
            header={<PortalHeader showBack />}
            recurso={sedes}
            campos={SEDE_CAMPOS}
            titulo="Sedes"
            nombre="Sede"
            femenino
            icono="git-branch-outline"
            tituloItem={(s) => s.nombre}
            subtituloItem={(s) => [s.trainingcenter?.nombre, etiquetaEstado(s.zona)].filter(Boolean).join(" · ")}
            puedeEditar={puedeEditar}
        />
    );
}
