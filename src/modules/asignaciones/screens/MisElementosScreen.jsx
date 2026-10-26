import { useState } from "react";
import { useResource, useFilteredList } from "@/shared/hooks";
import { ListPage, ResourceList, Button } from "@/shared/ui";
import PortalHeader from "@/navigation/PortalHeader";
import ReporteForm from "@/modules/reportes/components/ReporteForm";
import { asignacionesService } from "../asignaciones.service";
import { useAsignacionesAnimation } from "../hooks/useAsignacionesAnimation";
import AsignacionCard from "../components/AsignacionCard";
import AsignacionDetail from "../components/AsignacionDetail";

const SEARCH_KEYS = ["elemento", "placa", "ambiente", "categoria"];

/** Elementos asignados al aprendiz autenticado. */
export default function MisElementosScreen() {
    const resource = useResource(() => asignacionesService.mias(), []);
    const lista = useFilteredList(resource.data, { searchKeys: SEARCH_KEYS, filterKey: "estado" });
    const [detalle, setDetalle] = useState(null);
    const [reportar, setReportar] = useState(null);
    const animationStyle = useAsignacionesAnimation();

    return (
        <ListPage
            animationStyle={animationStyle}
            header={<PortalHeader />}
            title="Mis elementos"
            subtitle="Elementos que tienes a tu cargo"
            search={{ value: lista.query, onChangeText: lista.setQuery, placeholder: "Buscar mis elementos" }}
            filters={{ options: lista.filterOptions, value: lista.filter, onChange: lista.setFilter }}
        >
            <ResourceList
                resource={resource}
                items={lista.items}
                filtered={Boolean(lista.query || lista.filter)}
                empty={{ icon: "cube-outline", title: "No tienes elementos asignados", message: "Cuando el cuentadante te asigne uno aparecerá aquí." }}
                renderItem={({ item }) => <AsignacionCard variant="aprendiz" asignacion={item} onPress={() => setDetalle(item)} />}
            />
            <AsignacionDetail
                asignacion={detalle}
                onClose={() => setDetalle(null)}
                actions={
                    detalle ? (
                        <Button
                            title="Reportar una novedad"
                            icon="alert-circle-outline"
                            variant="outline"
                            onPress={() => {
                                setReportar(detalle.elementoId);
                                setDetalle(null);
                            }}
                        />
                    ) : null
                }
            />
            <ReporteForm scope="mine" visible={Boolean(reportar)} elementoId={reportar} onClose={() => setReportar(null)} />
        </ListPage>
    );
}
