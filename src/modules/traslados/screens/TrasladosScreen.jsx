import { useState } from "react";
import { View } from "react-native";
import { useResource, useFilteredList, useMutation } from "@/shared/hooks";
import { ListPage, ResourceList, Button, BottomSheet, InfoField, InfoGroup, Badge, useToast } from "@/shared/ui";
import { formatDate } from "@/shared/utils";
import PortalHeader from "@/navigation/PortalHeader";
import { trasladosService } from "../traslados.service";
import { useTrasladosAnimation } from "../hooks/useTrasladosAnimation";
import TrasladoCard from "../components/TrasladoCard";
import TrasladoForm from "../components/TrasladoForm";

const SEARCH_KEYS = ["elemento", "placa", "origen", "destino"];
const SIGUIENTE = { Programado: "En tránsito", "En tránsito": "Entregado" };

export default function TrasladosScreen() {
    const toast = useToast();
    const resource = useResource(() => trasladosService.list(), []);
    const lista = useFilteredList(resource.data, { searchKeys: SEARCH_KEYS, filterKey: "estado" });
    const [form, setForm] = useState(false);
    const [detalle, setDetalle] = useState(null);
    const avanzar = useMutation(trasladosService.cambiarEstado);
    const animationStyle = useTrasladosAnimation();

    const siguiente = detalle ? SIGUIENTE[detalle.estado] : null;

    const onAvanzar = async () => {
        try {
            const t = await avanzar.mutate(detalle, siguiente);
            resource.setData((prev) => prev.map((x) => (x.id === t.id ? t : x)));
            toast.show(`Traslado marcado como "${siguiente}"`);
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
                placeholder: "Buscar por elemento o ambiente",
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
                    action: <Button title="Programar traslado" icon="add" onPress={() => setForm(true)} />,
                }}
                renderItem={({ item }) => <TrasladoCard traslado={item} onPress={() => setDetalle(item)} />}
            />
            <TrasladoForm visible={form} onClose={() => setForm(false)} onSaved={(t) => resource.setData((prev) => [t, ...(prev ?? [])])} />

            <BottomSheet
                visible={Boolean(detalle)}
                onClose={() => setDetalle(null)}
                title={detalle?.elemento ?? "Traslado"}
                subtitle={detalle?.placa}
                icon="swap-horizontal-outline"
                footer={
                    siguiente ? (
                        <Button
                            title={siguiente === "Entregado" ? "Confirmar entrega" : "Marcar en tránsito"}
                            icon={siguiente === "Entregado" ? "checkmark-done-outline" : "car-outline"}
                            loading={avanzar.loading}
                            onPress={onAvanzar}
                        />
                    ) : null
                }
            >
                {detalle ? (
                    <>
                        <View className="mb-4">
                            <Badge label={detalle.estado} />
                        </View>
                        <InfoGroup>
                            <InfoField icon="exit-outline" label="Origen" value={detalle.origen} />
                            <InfoField icon="enter-outline" label="Destino" value={detalle.destino} />
                        </InfoGroup>
                        <InfoGroup>
                            <InfoField icon="calendar-outline" label="Salida" value={formatDate(detalle.fechaSalida)} />
                            <InfoField icon="calendar-clear-outline" label="Llegada" value={formatDate(detalle.fechaLlegada)} />
                            <InfoField icon="chatbox-ellipses-outline" label="Motivo" value={detalle.motivo} />
                            <InfoField icon="person-outline" label="Responsable" value={detalle.responsable} />
                        </InfoGroup>
                    </>
                ) : null}
            </BottomSheet>
        </ListPage>
    );
}
