import { useState } from "react";
import { useResource, useFilteredList } from "@/shared/hooks";
import { ListPage, ResourceList, Button } from "@/shared/ui";
import PortalHeader from "@/navigation/PortalHeader";
import { reportesService } from "../reportes.service";
import { useReportesAnimation } from "../hooks/useReportesAnimation";
import ReporteCard from "../components/ReporteCard";
import ReporteDetail from "../components/ReporteDetail";
import ReporteForm from "../components/ReporteForm";

const SEARCH_KEYS = ["elemento", "placa", "tipo", "descripcion", "reportadoPor", "ambiente"];

/**
 * scope="all":  todos los reportes (admin) · scope="mine": los míos
 * elementScope: de qué elementos puede reportar ("mine" = asignados al aprendiz)
 */
export default function ReportesScreen({ scope = "mine", elementScope = "all", canCreate = true, canManage = false }) {
    const resource = useResource(() => (scope === "all" ? reportesService.list() : reportesService.mios()), [scope]);
    const lista = useFilteredList(resource.data, { searchKeys: SEARCH_KEYS, filterKey: "estado" });
    const [form, setForm] = useState(false);
    const [detalle, setDetalle] = useState(null);
    const animationStyle = useReportesAnimation();

    const pendientes = (resource.data ?? []).filter((r) => r.estado === "Pendiente").length;

    return (
        <ListPage
            animationStyle={animationStyle}
            header={<PortalHeader />}
            title="Reportes"
            subtitle={
                scope === "all"
                    ? `${pendientes} pendientes de ${lista.total} reportes`
                    : "Novedades que has reportado sobre los elementos"
            }
            search={{
                value: lista.query,
                onChangeText: lista.setQuery,
                placeholder: "Buscar reportes",
                onAdd: canCreate ? () => setForm(true) : undefined,
                addLabel: "Nuevo reporte",
            }}
            filters={{ options: lista.filterOptions, value: lista.filter, onChange: lista.setFilter }}
        >
            <ResourceList
                resource={resource}
                items={lista.items}
                filtered={Boolean(lista.query || lista.filter)}
                empty={{
                    icon: "document-text-outline",
                    title: "Sin reportes",
                    message: canCreate ? "¿Algún elemento tiene una falla? Repórtala aquí." : "No hay novedades registradas.",
                    action: canCreate ? <Button title="Reportar novedad" icon="add" onPress={() => setForm(true)} /> : null,
                }}
                renderItem={({ item }) => <ReporteCard reporte={item} showAutor={scope === "all"} onPress={() => setDetalle(item)} />}
            />
            {canCreate ? (
                <ReporteForm
                    scope={elementScope}
                    visible={form}
                    onClose={() => setForm(false)}
                    onSaved={(r) => resource.setData((prev) => [r, ...(prev ?? [])])}
                />
            ) : null}
            <ReporteDetail
                reporte={detalle}
                canManage={canManage}
                onClose={() => setDetalle(null)}
                onUpdated={(r) => resource.setData((prev) => prev.map((x) => (x.id === r.id ? r : x)))}
            />
        </ListPage>
    );
}
