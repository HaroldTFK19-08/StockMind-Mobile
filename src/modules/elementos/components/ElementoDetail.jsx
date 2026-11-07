import { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import { BottomSheet, InfoField, InfoGroup, Badge, ChipSelect, Button, useToast } from "@/shared/ui";
import { useMutation } from "@/shared/hooks";
import { relacion, etiquetaEstado, opcionesDe } from "@/shared/utils";
import { elementosService } from "../elementos.service";
import { ESTADOS_MANUALES } from "../elementos.constants";

/** Detalle del elemento. Con `canManage` permite cambiar el estado. */
export default function ElementoDetail({ elemento, onClose, onUpdated, canManage = false }) {
    const toast = useToast();
    const [estado, setEstado] = useState(elemento?.estado);
    const actualizar = useMutation(elementosService.cambiarEstado);

    useEffect(() => setEstado(elemento?.estado), [elemento]);

    const guardar = async () => {
        try {
            const actualizado = await actualizar.mutate(elemento, estado); // PUT /elementos/:id { estado }
            toast.show("Estado actualizado");
            onUpdated?.(actualizado);
            onClose();
        } catch (error) {
            toast.show(error.message, "error");
        }
    };

    // Mientras esté asignado o prestado, el estado lo controla su asignación o préstamo
    const bloqueado = ["asignado", "prestado"].includes(elemento?.estado);
    const cambio = canManage && elemento && estado !== elemento.estado;

    return (
        <BottomSheet
            visible={Boolean(elemento)}
            onClose={onClose}
            title={elemento?.nombre ?? "Elemento"}
            subtitle={elemento?.codigo_inventario}
            icon="cube-outline"
            footer={cambio ? <Button title="Guardar cambios" icon="save-outline" loading={actualizar.loading} onPress={guardar} /> : null}
        >
            {elemento ? (
                <>
                    {elemento.img_elemento ? (
                        <View className="mb-4 rounded-2xl overflow-hidden bg-gray-100 h-44">
                            <Image source={{ uri: elemento.img_elemento }} className="w-full h-full" resizeMode="cover" />
                        </View>
                    ) : null}
                    <View className="mb-4">
                        <Badge label={elemento.estado} />
                    </View>
                    <InfoGroup>
                        <InfoField icon="pricetag-outline" label="Categoría" value={relacion(elemento, "category", "category_id", "Categoría")} />
                        <InfoField icon="ribbon-outline" label="Marca / modelo" value={[elemento.marca, elemento.modelo].filter(Boolean).join(" · ") || null} />
                        <InfoField icon="barcode-outline" label="Serial" value={elemento.serial} />
                        <InfoField icon="medkit-outline" label="Condición" value={etiquetaEstado(elemento.condicion)} />
                        <InfoField icon="location-outline" label="Ambiente" value={relacion(elemento, "environment", "environment_id", "Ambiente")} />
                        <InfoField icon="archive-outline" label="Almacén" value={relacion(elemento, "warehouse", "warehouse_id", "Almacén")} />
                        <InfoField icon="document-text-outline" label="Descripción" value={elemento.descripcion} />
                    </InfoGroup>
                    {canManage && !bloqueado ? (
                        <View className="mt-2">
                            <Text className="text-base font-bold text-ink mb-3">Cambiar estado</Text>
                            <ChipSelect options={opcionesDe(ESTADOS_MANUALES)} value={estado} onChange={setEstado} />
                        </View>
                    ) : null}
                    {canManage && bloqueado ? (
                        <Text className="text-sm text-gray-500">
                            El estado se libera cuando se cierre su {elemento.estado === "asignado" ? "asignación" : "préstamo"}.
                        </Text>
                    ) : null}
                </>
            ) : null}
        </BottomSheet>
    );
}
