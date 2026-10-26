import { useState } from "react";
import { useResource, useFilteredList, useMutation } from "@/shared/hooks";
import { ListPage, ResourceList, Button, useToast } from "@/shared/ui";
import PortalHeader from "@/navigation/PortalHeader";
import { asignacionesService } from "../asignaciones.service";
import { useAsignacionesAnimation } from "../hooks/useAsignacionesAnimation";
import AsignacionCard from "../components/AsignacionCard";
import AsignacionDetail from "../components/AsignacionDetail";
import AsignacionForm from "../components/AsignacionForm";

const SEARCH_KEYS = ["aprendiz", "elemento", "placa", "ambiente"];

/** Gestión de asignaciones (cuentadante). */
export default function AsignacionesScreen() {
    const toast = useToast();
    const resource = useResource(() => asignacionesService.list(), []);
    const lista = useFilteredList(resource.data, { searchKeys: SEARCH_KEYS, filterKey: "estado" });
    const [form, setForm] = useState(false);
    const [detalle, setDetalle] = useState(null);
    const finalizar = useMutation(asignacionesService.finalizar);
    const animationStyle = useAsignacionesAnimation();

    const onFinalizar = async () => {
        try {
            const actualizada = await finalizar.mutate(detalle);
            resource.setData((prev) => prev.map((a) => (a.id === actualizada.id ? actualizada : a)));
            toast.show("Asignación finalizada. El elemento quedó disponible.");
            setDetalle(null);
        } catch (error) {
            toast.show(error.message, "error");
        }
    };

    return (
        <ListPage
            animationStyle={animationStyle}
            header={<PortalHeader />}
            title="Asignaciones"
            subtitle="Asigna elementos a los aprendices y controla su devolución"
            search={{
                value: lista.query,
                onChangeText: lista.setQuery,
                placeholder: "Buscar por aprendiz o elemento",
                onAdd: () => setForm(true),
                addLabel: "Nueva asignación",
            }}
            filters={{ options: lista.filterOptions, value: lista.filter, onChange: lista.setFilter }}
        >
            <ResourceList
                resource={resource}
                items={lista.items}
                filtered={Boolean(lista.query || lista.filter)}
                empty={{
                    icon: "clipboard-outline",
                    title: "Sin asignaciones",
                    message: "Aún no has asignado elementos.",
                    action: <Button title="Nueva asignación" icon="add" onPress={() => setForm(true)} />,
                }}
                renderItem={({ item }) => <AsignacionCard asignacion={item} onPress={() => setDetalle(item)} />}
            />
            <AsignacionForm visible={form} onClose={() => setForm(false)} onSaved={(a) => resource.setData((prev) => [a, ...(prev ?? [])])} />
            <AsignacionDetail
                asignacion={detalle}
                onClose={() => setDetalle(null)}
                actions={
                    detalle && detalle.estado !== "Finalizada" ? (
                        <Button title="Finalizar asignación" icon="checkmark-circle-outline" variant="danger" loading={finalizar.loading} onPress={onFinalizar} />
                    ) : null
                }
            />
        </ListPage>
    );
}
