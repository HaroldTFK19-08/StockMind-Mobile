import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { BottomSheet, InfoField, InfoGroup, Badge, ChipSelect, TextField, Button, useToast } from "@/shared/ui";
import { useMutation } from "@/shared/hooks";
import { formatDate } from "@/shared/utils";
import { reportesService } from "../reportes.service";
import { REPORTE_ESTADOS } from "../reportes.constants";

/** Detalle del reporte. Con `canManage` el admin puede cambiar el estado y responder. */
export default function ReporteDetail({ reporte, onClose, onUpdated, canManage = false }) {
    const toast = useToast();
    const [estado, setEstado] = useState(reporte?.estado);
    const [respuesta, setRespuesta] = useState(reporte?.respuesta ?? "");
    const actualizar = useMutation(reportesService.cambiarEstado);

    useEffect(() => {
        setEstado(reporte?.estado);
        setRespuesta(reporte?.respuesta ?? "");
    }, [reporte]);

    const guardar = async () => {
        try {
            const r = await actualizar.mutate(reporte.id, estado, respuesta);
            toast.show("Reporte actualizado");
            onUpdated?.(r);
            onClose();
        } catch (error) {
            toast.show(error.message, "error");
        }
    };

    const cambio = canManage && reporte && (estado !== reporte.estado || respuesta !== (reporte.respuesta ?? ""));

    return (
        <BottomSheet
            visible={Boolean(reporte)}
            onClose={onClose}
            title={reporte?.elemento ?? "Reporte"}
            subtitle={reporte ? `${reporte.tipo} · ${formatDate(reporte.fecha)}` : undefined}
            icon="document-text-outline"
            footer={cambio ? <Button title="Guardar cambios" icon="save-outline" loading={actualizar.loading} onPress={guardar} /> : null}
        >
            {reporte ? (
                <>
                    <View className="mb-4">
                        <Badge label={reporte.estado} />
                    </View>
                    <InfoGroup>
                        <InfoField icon="document-text-outline" label="Descripción" value={reporte.descripcion} />
                        <InfoField icon="barcode-outline" label="Placa" value={reporte.placa} />
                        <InfoField icon="location-outline" label="Ambiente" value={reporte.ambiente} />
                        <InfoField icon="person-outline" label="Reportado por" value={reporte.reportadoPor} />
                    </InfoGroup>
                    {!canManage && reporte.respuesta ? (
                        <InfoGroup>
                            <InfoField icon="chatbubble-ellipses-outline" label="Respuesta" value={reporte.respuesta} />
                        </InfoGroup>
                    ) : null}
                    {canManage ? (
                        <View className="mt-2">
                            <Text className="text-base font-bold text-ink mb-3">Gestionar reporte</Text>
                            <ChipSelect options={REPORTE_ESTADOS} value={estado} onChange={setEstado} />
                            <TextField label="Respuesta (opcional)" value={respuesta} onChangeText={setRespuesta} placeholder="Acciones tomadas…" multiline />
                        </View>
                    ) : null}
                </>
            ) : null}
        </BottomSheet>
    );
}
