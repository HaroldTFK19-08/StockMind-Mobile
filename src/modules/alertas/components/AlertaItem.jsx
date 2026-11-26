import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Badge, Card } from "@/shared/ui";
import { COLORS } from "@/shared/theme";
import { formatDate } from "@/shared/utils";

/** Alerta calculada: solo muestra datos que ya vienen en asignaciones o préstamos. */
export default function AlertaItem({ alerta }) {
    return (
        <Card>
            <View className="flex-row items-center">
                <View className="w-11 h-11 rounded-2xl bg-red-50 items-center justify-center">
                    <Ionicons name="warning-outline" size={22} color={COLORS.danger} />
                </View>
                <View className="flex-1 ml-3">
                    <Text className="text-base font-bold text-gray-900" numberOfLines={1}>
                        {alerta.titulo}
                    </Text>
                    <Text className="text-sm text-gray-500 mt-0.5" numberOfLines={1}>
                        {alerta.detalle}
                    </Text>
                </View>
                <Badge label="Vencida" />
            </View>
            <Text className="text-xs text-gray-400 mt-3">Fecha límite: {formatDate(alerta.fecha)}</Text>
        </Card>
    );
}
