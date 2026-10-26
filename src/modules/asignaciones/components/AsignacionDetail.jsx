import { View } from "react-native";
import { BottomSheet, InfoField, InfoGroup, Badge } from "@/shared/ui";
import { formatDate } from "@/shared/utils";

/** `actions` permite a cada pantalla inyectar sus botones (finalizar, reportar…). */
export default function AsignacionDetail({ asignacion, onClose, actions }) {
    return (
        <BottomSheet
            visible={Boolean(asignacion)}
            onClose={onClose}
            title={asignacion?.elemento ?? "Asignación"}
            subtitle={asignacion?.placa}
            icon="clipboard-outline"
            footer={actions}
        >
            {asignacion ? (
                <>
                    <View className="mb-4">
                        <Badge label={asignacion.estado} />
                    </View>
                    <InfoGroup>
                        <InfoField icon="person-outline" label="Aprendiz" value={asignacion.aprendiz} />
                        <InfoField icon="cube-outline" label="Elemento" value={asignacion.elemento} />
                        <InfoField icon="location-outline" label="Ambiente" value={asignacion.ambiente} />
                    </InfoGroup>
                    <InfoGroup>
                        <InfoField icon="calendar-outline" label="Fecha de inicio" value={formatDate(asignacion.fechaInicio)} />
                        <InfoField icon="calendar-clear-outline" label="Fecha de finalización" value={formatDate(asignacion.fechaFin)} />
                        {asignacion.observaciones ? (
                            <InfoField icon="chatbox-ellipses-outline" label="Observaciones" value={asignacion.observaciones} />
                        ) : null}
                    </InfoGroup>
                </>
            ) : null}
        </BottomSheet>
    );
}

