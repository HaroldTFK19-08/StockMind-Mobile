import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { BottomSheet, InfoField, InfoGroup, Badge, ChipSelect, Button, useToast } from "@/shared/ui";
import { useMutation } from "@/shared/hooks";
import { elementosService } from "../elementos.service";
import { ELEMENTO_ESTADOS } from "../elementos.constants";

/** Detalle del elemento. Con `canManage` permite cambiar el estado. */
export default function ElementoDetail({ elemento, onClose, onUpdated, canManage = false }) {
    const toast = useToast();
    const [estado, setEstado] = useState(elemento?.estado);
    const actualizar = useMutation(elementosService.update);

    useEffect(() => setEstado(elemento?.estado), [elemento]);

    const guardar = async () => {
        try {
            const actualizado = await actualizar.mutate(elemento.id, { estado });
            toast.show("Estado actualizado");
            onUpdated?.(actualizado);
            onClose();
        } catch (error) {
            toast.show(error.message, "error");
        }
    };

    const cambio = canManage && elemento && estado !== elemento.estado;

    return (
        <BottomSheet
            visible={Boolean(elemento)}
            onClose={onClose}
            title={elemento?.nombre ?? "Elemento"}
            subtitle={elemento?.placa}
            icon="cube-outline"
            footer={cambio ? <Button title="Guardar cambios" icon="save-outline" loading={actualizar.loading} onPress={guardar} /> : null}
        >
            {elemento ? (
                <>
                    <View className="mb-4">
                        <Badge label={elemento.estado} />
                    </View>
                    <InfoGroup>
                        <InfoField icon="pricetag-outline" label="Categoría" value={elemento.categoria} />
                        {elemento.marca ? <InfoField icon="ribbon-outline" label="Marca" value={elemento.marca} /> : null}
                        <InfoField icon="location-outline" label="Ambiente" value={elemento.ambiente} />
                        <InfoField icon="document-text-outline" label="Descripción" value={elemento.descripcion} />
                    </InfoGroup>
                    {canManage ? (
                        <View className="mt-2">
                            <Text className="text-base font-bold text-ink mb-3">Cambiar estado</Text>
                            <ChipSelect options={ELEMENTO_ESTADOS} value={estado} onChange={setEstado} />
                        </View>
                    ) : null}
                </>
            ) : null}
        </BottomSheet>
    );
}
