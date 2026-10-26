import { Alert, View, Image } from "react-native";
import { BottomSheet, InfoField, InfoGroup, Button } from "@/shared/ui";
import { useMutation } from "@/shared/hooks";
import { centrosService } from "../centros.service";

/**
 * Detalle de un centro en un BottomSheet.
 * @param {object}   centro
 * @param {Function} onClose
 * @param {Function} [onEdit]    - si se pasa, muestra botón Editar (solo admin)
 * @param {Function} [onDeleted] - callback(id) tras eliminar exitosamente
 */
export default function CentroDetail({ centro, onClose, onEdit, onDeleted }) {
    const eliminar = useMutation((id) => centrosService.remove(id));

    const handleDelete = () => {
        Alert.alert(
            "Eliminar centro",
            `¿Seguro que deseas eliminar "${centro?.nombre}"? Esta acción no se puede deshacer.`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await eliminar.mutate(centro.id);
                            onClose();
                            onDeleted?.(centro.id);
                        } catch (e) {
                            Alert.alert("Error", e.message);
                        }
                    },
                },
            ]
        );
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
                        <Button
                            title="Editar centro"
                            icon="pencil-outline"
                            variant="outline"
                            onPress={() => {
                                onClose();
                                onEdit(centro);
                            }}
                        />
                        <Button
                            title="Eliminar centro"
                            icon="trash-outline"
                            variant="danger"
                            loading={eliminar.loading}
                            onPress={handleDelete}
                            className="mt-3"
                        />
                    </>
                ) : null
            }
        >
            {centro ? (
                <>
                    {centro.foto_centro ? (
                        <View className="mb-4 rounded-2xl overflow-hidden bg-gray-100 h-44 w-full">
                            <Image
                                source={{ uri: centro.foto_centro }}
                                className="w-full h-full"
                                resizeMode="cover"
                            />
                        </View>
                    ) : null}

                    <InfoGroup>
                        <InfoField icon="business-outline" label="Nombre" value={centro.nombre} />
                        <InfoField icon="map-outline" label="Regional" value={centro.regional} />
                        <InfoField icon="navigate-outline" label="Ciudad" value={centro.ciudad} />
                        {centro.direccion ? (
                            <InfoField icon="location-outline" label="Dirección" value={centro.direccion} />
                        ) : null}
                        {centro.telefono ? (
                            <InfoField icon="call-outline" label="Teléfono" value={centro.telefono} />
                        ) : null}
                        {centro.sedes > 0 ? (
                            <InfoField icon="git-branch-outline" label="Sedes" value={String(centro.sedes)} />
                        ) : null}
                        {centro.ambientes > 0 ? (
                            <InfoField icon="easel-outline" label="Ambientes" value={String(centro.ambientes)} />
                        ) : null}
                    </InfoGroup>
                </>
            ) : null}
        </BottomSheet>
    );
}
