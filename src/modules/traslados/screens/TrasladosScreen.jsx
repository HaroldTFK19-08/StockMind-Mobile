import { useState } from "react";
import { View } from "react-native";
import { useFilteredList, useMutation } from "@/shared/hooks";
import { ListPage, ResourceList, Button, BottomSheet, InfoField, InfoGroup, Badge, useToast } from "@/shared/ui";
import { formatDate, nombresElementos, nombreUsuario } from "@/shared/utils";
import PortalHeader from "@/navigation/PortalHeader";
import { trasladosService } from "../traslados.service";
import { useTraslados } from "../hooks/useTraslados";
import { useTrasladosAnimation } from "../hooks/useTrasladosAnimation";
import TrasladoCard, { origenDe, destinoDe, elementosDe } from "../components/TrasladoCard";
import TrasladoForm from "../components/TrasladoForm";

const SEARCH_KEYS = ["motivo"];

/**
 * Acciones posibles según el estado (mismas reglas de TrasladoService):
 * pendiente → aprobado o rechazado · aprobado → completado · completado/rechazado no cambian.
 */
const ACCIONES = {
    pendiente: [
        { estado: "aprobado", titulo: "Aprobar traslado", icono: "checkmark-outline", variante: "primary" },
        { estado: "rechazado", titulo: "Rechazar", icono: "close-outline", variante: "danger" },
    ],
    aprobado: [{ estado: "completado", titulo: "Marcar como completado", icono: "checkmark-done-outline", variante: "primary" }],
};

export default function TrasladosScreen() {
    const toast = useToast();
    const resource = useTraslados(); // GET /traslados
    const lista = useFilteredList(resource.data, { searchKeys: SEARCH_KEYS, filterKey: "estado" });
    const [form, setForm] = useState(false);
    const [detalle, setDetalle] = useState(null);
    const cambiar = useMutation(trasladosService.cambiarEstado);
    const animationStyle = useTrasladosAnimation();

    const acciones = detalle ? ACCIONES[detalle.estado] ?? [] : [];

    const onCambiar = async (estado) => {
        try {
            const t = await cambiar.mutate(detalle, estado); // PUT /traslados/:id { estado }
            resource.reemplazar(t);
            toast.show(`Traslado ${estado}`);
            setDetalle(null);
        } catch (error) {
            toast.show(error.message, "error");
        }
    };

    return (
        <ListPage
            animationStyle={animationStyle}
            header={<PortalHeader />}
            title="Traslados"
            subtitle="Movimientos de elementos entre ambientes"
            search={{
                value: lista.query,
                onChangeText: lista.setQuery,
                placeholder: "Buscar por motivo",
                onAdd: () => setForm(true),
                addLabel: "Nuevo traslado",
            }}
            filters={{ options: lista.filterOptions, value: lista.filter, onChange: lista.setFilter }}
        >
            <ResourceList
                resource={resource}
                items={lista.items}
                filtered={Boolean(lista.query || lista.filter)}
                empty={{
                    icon: "swap-horizontal-outline",
                    title: "Sin traslados",
                    action: <Button title="Solicitar traslado" icon="add" onPress={() => setForm(true)} />,
                }}
                renderItem={({ item }) => <TrasladoCard traslado={item} onPress={() => setDetalle(item)} />}
            />
            <TrasladoForm visible={form} onClose={() => setForm(false)} onSaved={resource.agregar} />

            <BottomSheet
                visible={Boolean(detalle)}
                onClose={() => setDetalle(null)}
                title={detalle?.motivo ?? "Traslado"}
                icon="swap-horizontal-outline"
                footer={
                    acciones.length ? (
                        <View className="gap-3">
                            {acciones.map((a) => (
                                <Button key={a.estado} title={a.titulo} icon={a.icono} variant={a.variante}
                                    loading={cambiar.loading} onPress={() => onCambiar(a.estado)} />
                            ))}
                        </View>
                    ) : null
                }
            >
                {detalle ? (
                    <>
                        <View className="mb-4">
                            <Badge label={detalle.estado} />
                        </View>
                        <InfoGroup>
                            <InfoField icon="exit-outline" label="Origen" value={origenDe(detalle)} />
                            <InfoField icon="enter-outline" label="Destino" value={destinoDe(detalle)} />
                            <InfoField icon="cube-outline" label="Elementos" value={nombresElementos(elementosDe(detalle))} />
                        </InfoGroup>
                        <InfoGroup>
                            <InfoField icon="calendar-outline" label="Solicitud" value={formatDate(detalle.fecha_solicitud)} />
                            <InfoField icon="calendar-clear-outline" label="Traslado" value={formatDate(detalle.fecha_traslado)} />
                            <InfoField icon="key-outline" label="Cuenta-dante"
                                value={nombreUsuario(detalle.danteaccount?.user) ?? `#${detalle.danteaccount_id}`} />
                        </InfoGroup>
                    </>
                ) : null}
            </BottomSheet>
        </ListPage>
    );
}
