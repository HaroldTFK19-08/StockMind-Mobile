import { CrudScreen } from "@/shared/ui";
import PortalHeader from "@/navigation/PortalHeader";
import { useAmbientes } from "../hooks/useAmbientes";
import { AMBIENTE_CAMPOS } from "../ambientes.config";
import { ambientesSchema } from "../validaciones/ambientes.schema";

/** Gestión de Ambientes para el admin — GET, POST, PUT y DELETE /ambientes. */
export default function AmbientesAdminScreen() {
    const ambientes = useAmbientes();
    return (
        <CrudScreen
            header={<PortalHeader showBack />}
            recurso={ambientes}
            campos={AMBIENTE_CAMPOS}
            crearEsquema={ambientesSchema}
            titulo="Ambientes"
            nombre="Ambiente"
            icono="easel-outline"
            tituloItem={(a) => a.nombre}
            subtituloItem={(a) => [a.tipo, a.headquarter?.nombre, `${a.elements_count ?? 0} elementos`].filter(Boolean).join(" · ")}
            campoEstado="estado"
            porDefecto={{ estado: "activo" }}
        />
    );
}
