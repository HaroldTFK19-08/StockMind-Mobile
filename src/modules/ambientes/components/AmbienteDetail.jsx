import { View } from "react-native";
import { BottomSheet, InfoField, InfoGroup, Badge } from "@/shared/ui";
import { relacion } from "@/shared/utils";

/** Detalle de un ambiente. */
export default function AmbienteDetail({ ambiente, onClose }) {
    return (
        <BottomSheet visible={Boolean(ambiente)} onClose={onClose} title={ambiente?.nombre ?? "Ambiente"}
            subtitle={ambiente?.tipo} icon="easel-outline">
            {ambiente ? (
                <>
                    <View className="mb-4">
                        <Badge label={ambiente.estado} />
                    </View>
                    <InfoGroup>
                        <InfoField icon="git-branch-outline" label="Sede" value={relacion(ambiente, "headquarter", "headquarter_id", "Sede")} />
                        <InfoField icon="people-outline" label="Capacidad" value={`${ambiente.capacidad} personas`} />
                        <InfoField icon="cube-outline" label="Elementos" value={String(ambiente.elements_count ?? 0)} />
                        <InfoField icon="person-outline" label="Instructor"
                            value={ambiente.teacher_id != null ? `Instructor #${ambiente.teacher_id}` : "Sin asignar"} />
                    </InfoGroup>
                </>
            ) : null}
        </BottomSheet>
    );
}
