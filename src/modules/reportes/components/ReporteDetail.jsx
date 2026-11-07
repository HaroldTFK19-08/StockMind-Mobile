import { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import { BottomSheet, InfoField, InfoGroup, Badge, ChipSelect, Button, useToast } from "@/shared/ui";
import { useMutation } from "@/shared/hooks";
import { formatDate, nombrePersona, nombresElementos, etiquetaEstado, opcionesDe } from "@/shared/utils";
import { reportesService } from "../reportes.service";
import { REPORTE_ESTADOS } from "../reportes.constants";

/** Detalle del reporte. Con `canManage` el admin puede cambiar el estado. */
export default function ReporteDetail({ reporte, onClose, onUpdated, canManage = false }) {
    const toast = useToast();
    const [estado, setEstado] = useState(reporte?.estado);
    const actualizar = useMutation(reportesService.cambiarEstado);

    useEffect(() => setEstado(reporte?.estado), [reporte]);

    const guardar = async () => {
        try {
            const r = await actualizar.mutate(reporte, estado); // PUT /reportes/:id { estado }
            toast.show("Reporte actualizado");
            onUpdated?.(r);
            onClose();
        } catch (error) {
            toast.show(error.message, "error");
        }
    };

    const cambio = canManage && reporte && estado !== reporte.estado;

    return (
        <BottomSheet
            visible={Boolean(reporte)}
            onClose={onClose}
            title={reporte ? etiquetaEstado(reporte.tipo) : "Reporte"}
            subtitle={reporte ? formatDate(reporte.fecha_reporte) : undefined}
            icon="document-text-outline"
            footer={cambio ? <Button title="Guardar cambios" icon="save-outline" loading={actualizar.loading} onPress={guardar} /> : null}
        >
            {reporte ? (
                <>
                    {reporte.foto_probatorio ? (
                        <View className="mb-4 rounded-2xl overflow-hidden bg-gray-100 h-44">
                            <Image source={{ uri: reporte.foto_probatorio }} className="w-full h-full" resizeMode="cover" />
                        </View>
                    ) : null}
                    <View className="mb-4">
                        <Badge label={reporte.estado} />
                    </View>
                    <InfoGroup>
                        <InfoField icon="cube-outline" label="Elementos" value={nombresElementos(reporte.elements)} />
                        <InfoField icon="document-text-outline" label="Descripción" value={reporte.descripcion} />
                        <InfoField icon="person-outline" label="Reportado por" value={nombrePersona(reporte, "apprentice", "apprentice_id", "Aprendiz")} />
                    </InfoGroup>
                    {canManage ? (
                        <View className="mt-2">
                            <Text className="text-base font-bold text-ink mb-3">Cambiar estado</Text>
                            <ChipSelect options={opcionesDe(REPORTE_ESTADOS)} value={estado} onChange={setEstado} />
                        </View>
                    ) : null}
                </>
            ) : null}
        </BottomSheet>
    );
}
