import { View } from "react-native";
import { BottomSheet, InfoField, InfoGroup, Badge } from "@/shared/ui";

export default function AmbienteDetail({ ambiente, onClose }) {
    return (
        <BottomSheet visible={Boolean(ambiente)} onClose={onClose} title={ambiente?.nombre ?? "Ambiente"} subtitle={ambiente?.tipo} icon="easel-outline">
            {ambiente ? (
                <>
                    <View className="mb-4">
                        <Badge label={ambiente.estado} />
                    </View>
                    <InfoGroup>
                        <InfoField icon="business-outline" label="Centro" value={ambiente.centro} />
                        <InfoField icon="people-outline" label="Capacidad" value={ambiente.capacidad ? `${ambiente.capacidad} personas` : null} />
                        <InfoField icon="cube-outline" label="Elementos" value={ambiente.totalElementos != null ? String(ambiente.totalElementos) : null} />
                        <InfoField icon="key-outline" label="Cuentadante" value={ambiente.responsable} />
                    </InfoGroup>
                </>
            ) : null}
        </BottomSheet>
    );
}
