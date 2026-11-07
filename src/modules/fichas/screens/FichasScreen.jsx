import { CrudScreen } from "@/shared/ui";
import PortalHeader from "@/navigation/PortalHeader";
import { nombreUsuario } from "@/shared/utils";
import { useFichas } from "../hooks/useFichas";
import { FICHA_CAMPOS } from "../fichas.config";

/** Pantalla de Fichas — GET, POST, PUT y DELETE /fichas. */
export default function FichasScreen({ puedeEditar = true }) {
    const fichas = useFichas();
    return (
        <CrudScreen
            header={<PortalHeader showBack />}
            recurso={fichas}
            campos={FICHA_CAMPOS}
            titulo="Fichas"
            nombre="Ficha"
            femenino
            icono="id-card-outline"
            tituloItem={(f) => `Ficha ${f.codigo}`}
            subtituloItem={(f) => [f.programa, nombreUsuario(f.teacher?.user)].filter(Boolean).join(" · ")}
            puedeEditar={puedeEditar}
        />
    );
}
