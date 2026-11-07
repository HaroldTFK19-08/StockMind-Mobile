import { View } from "react-native";
import { BottomSheet, InfoField, InfoGroup, Badge } from "@/shared/ui";
import { formatDate, relacion, nombrePersona } from "@/shared/utils";

/** `actions` permite a cada pantalla inyectar sus botones (devolver, reportar…). */
export default function AsignacionDetail({ asignacion, onClose, actions }) {
    return (
        <BottomSheet
            visible={Boolean(asignacion)}
            onClose={onClose}
            title={relacion(asignacion, "element", "element_id", "Elemento") ?? "Asignación"}
            subtitle={asignacion?.element?.codigo_inventario}
            icon="clipboard-outline"
            footer={actions}
        >
            {asignacion ? (
                <>
                    <View className="mb-4">
                        <Badge label={asignacion.estado} />
                    </View>
                    <InfoGroup>
                        <InfoField icon="person-outline" label="Aprendiz" value={nombrePersona(asignacion, "apprentice", "apprentice_id", "Aprendiz")} />
                        <InfoField icon="school-outline" label="Instructor" value={nombrePersona(asignacion, "teacher", "teacher_id", "Instructor")} />
                    </InfoGroup>
                    <InfoGroup>
                        <InfoField icon="calendar-outline" label="Fecha de asignación" value={formatDate(asignacion.fecha_asignacion)} />
                        <InfoField icon="calendar-clear-outline" label="Devolución esperada" value={formatDate(asignacion.fecha_devolucion_esperada)} />
                        <InfoField icon="checkmark-done-outline" label="Devolución real" value={formatDate(asignacion.fecha_devolucion_real)} />
                        {asignacion.observaciones ? (
                            <InfoField icon="chatbox-ellipses-outline" label="Observaciones" value={asignacion.observaciones} />
                        ) : null}
                    </InfoGroup>
                </>
            ) : null}
        </BottomSheet>
    );
}
