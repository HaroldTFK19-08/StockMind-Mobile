import { useState } from "react";
import { useFilteredList, useMutation } from "@/shared/hooks";
import { ListPage, ResourceList, Button, useToast } from "@/shared/ui";
import PortalHeader from "@/navigation/PortalHeader";
import { asignacionesService } from "../asignaciones.service";
import { useAsignaciones } from "../hooks/useAsignaciones";
import { useAsignacionesAnimation } from "../hooks/useAsignacionesAnimation";
import AsignacionCard from "../components/AsignacionCard";
import AsignacionDetail from "../components/AsignacionDetail";
import AsignacionForm from "../components/AsignacionForm";

const SEARCH_KEYS = ["observaciones", "apprentice_id"];

/**
 * Asignaciones: el instructor crea y controla devoluciones; el cuentadante solo consulta.
 * `ambienteId` (de la sesión) limita la lista a los elementos de su ambiente (cuentadantes.id_ambiente).
 */
export default function AsignacionesScreen({ puedeAsignar = false, instructorId = null, ambienteId = null }) {
    const toast = useToast();
    const resource = useAsignaciones(); // GET /asignaciones
    const lista = useFilteredList(resource.data, { searchKeys: SEARCH_KEYS, filterKey: "estado" });
    const visibles = ambienteId
        ? lista.items.filter((a) => String(a.element?.environment_id ?? "") === String(ambienteId))
        : lista.items;
    const [form, setForm] = useState(false);
    const [detalle, setDetalle] = useState(null);
    const finalizar = useMutation(asignacionesService.finalizar);
    const animationStyle = useAsignacionesAnimation();

    const onFinalizar = async () => {
        try {
            const actualizada = await finalizar.mutate(detalle);
            resource.reemplazar(actualizada);
            toast.show("Asignación devuelta. El elemento quedó disponible.");
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
            subtitle={
                puedeAsignar
                    ? "Asigna elementos a los aprendices y controla su devolución"
                    : "Consulta los equipos asignados y sus devoluciones"
            }
            search={{
                value: lista.query,
                onChangeText: lista.setQuery,
                placeholder: "Buscar por observación o ID de aprendiz",
                onAdd: puedeAsignar ? () => setForm(true) : undefined,
                addLabel: "Nueva asignación",
            }}
            filters={{ options: lista.filterOptions, value: lista.filter, onChange: lista.setFilter }}
        >
            <ResourceList
                resource={resource}
                items={visibles}
                filtered={Boolean(lista.query || lista.filter)}
                empty={{
                    icon: "clipboard-outline",
                    title: "Sin asignaciones",
                    message: puedeAsignar ? "Aún no has asignado elementos." : "No hay asignaciones en tu ambiente.",
                    action: puedeAsignar ? <Button title="Nueva asignación" icon="add" onPress={() => setForm(true)} /> : null,
                }}
                renderItem={({ item }) => <AsignacionCard asignacion={item} onPress={() => setDetalle(item)} />}
            />
            {puedeAsignar ? (
                <AsignacionForm visible={form} onClose={() => setForm(false)} onSaved={resource.agregar} instructorId={instructorId} />
            ) : null}
            <AsignacionDetail
                asignacion={detalle}
                onClose={() => setDetalle(null)}
                actions={
                    puedeAsignar && detalle && detalle.estado !== "devuelta" ? (
                        <Button title="Registrar devolución" icon="checkmark-circle-outline" variant="danger" loading={finalizar.loading} onPress={onFinalizar} />
                    ) : null
                }
            />
        </ListPage>
    );
}
