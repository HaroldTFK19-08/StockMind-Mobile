import { View, Image } from "react-native";
import { BottomSheet, InfoField, InfoGroup, Button, useToast } from "@/shared/ui";
import { useMutation } from "@/shared/hooks";
import { confirmar } from "@/shared/ui/crud/campos";
import { centrosService } from "../centros.service";

/**
 * Detalle de un centro en un BottomSheet.
 * @param {Function} [onEdit]    - si se pasa, muestra Editar y Eliminar (solo admin)
 * @param {Function} [onDeleted] - callback(id) tras eliminar
 */
export default function CentroDetail({ centro, onClose, onEdit, onDeleted }) {
    const toast = useToast();
    const eliminar = useMutation((id) => centrosService.remove(id));

    const handleDelete = async () => {
        const ok = await confirmar("Eliminar centro", `¿Seguro que deseas eliminar "${centro?.nombre}"?`);
        if (!ok) return;
        try {
            await eliminar.mutate(centro.id); // DELETE /centros/:id
            onClose();
            onDeleted?.(centro.id);
            toast.show("Centro eliminado");
        } catch (e) {
            toast.show(e.message, "error");
        }
    };

    return (
        <BottomSheet
            visible={Boolean(centro)}
            onClose={onClose}
            title={centro?.nombre ?? "Centro"}
            subtitle="Centro de formación SENA"
            icon="business-outline"
            footer={
                onEdit ? (
                    <>
                        <Button title="Editar centro" icon="pencil-outline" variant="outline"
                            onPress={() => { onClose(); onEdit(centro); }} />
                        <Button title="Eliminar centro" icon="trash-outline" variant="danger" className="mt-3"
                            loading={eliminar.loading} onPress={handleDelete} />
                    </>
                ) : null
            }
        >
            {centro ? (
                <>
                    {centro.foto_centro ? (
                        <View className="mb-4 rounded-2xl overflow-hidden bg-gray-100 h-44">
                            <Image source={{ uri: centro.foto_centro }} className="w-full h-full" resizeMode="cover" />
                        </View>
                    ) : null}
                    <InfoGroup>
                        <InfoField icon="business-outline" label="Nombre" value={centro.nombre} />
                        <InfoField icon="map-outline" label="Regional" value={centro.regional} />
                        <InfoField icon="navigate-outline" label="Ciudad" value={centro.ciudad} />
                    </InfoGroup>
                </>
            ) : null}
        </BottomSheet>
    );
}
