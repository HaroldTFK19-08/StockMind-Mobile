import { useAuth } from "@/modules/auth";
import { useResource } from "@/shared/hooks";
import { ListPage, ResourceList } from "@/shared/ui";
import PortalHeader from "@/navigation/PortalHeader";
import { alertasService } from "../alertas.service";
import AlertaItem from "../components/AlertaItem";

/** Alertas del ambiente del cuentadante, calculadas desde /asignaciones y /prestamos. */
export default function AlertasScreen() {
    const { user } = useAuth();
    const ambienteId = user?.ambiente_id ?? null;
    const resource = useResource(() => alertasService.list(ambienteId), [ambienteId]);

    return (
        <ListPage header={<PortalHeader />} title="Alertas" subtitle="Devoluciones que necesitan atención">
            <ResourceList
                resource={resource}
                items={resource.data}
                renderItem={({ item }) => <AlertaItem alerta={item} />}
                empty={{
                    icon: "checkmark-circle-outline",
                    title: "Sin alertas",
                    message: "No hay devoluciones vencidas en tu ambiente.",
                }}
            />
        </ListPage>
    );
}
