import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, Badge } from "@/shared/ui";
import { COLORS } from "@/shared/theme";
import { formatDate } from "@/shared/utils";

export default function TrasladoCard({ traslado, onPress }) {
    return (
        <Card onPress={onPress}>
            <View className="flex-row items-center">
                <View className="flex-1">
                    <Text className="text-base font-bold text-gray-900" numberOfLines={1}>
                        {traslado.elemento}
                    </Text>
                    <Text className="text-xs text-gray-400 font-medium mt-0.5">{traslado.placa}</Text>
                </View>
                <Badge label={traslado.estado} />
            </View>

            <View className="flex-row items-center mt-4">
                <View className="flex-1 bg-gray-50 rounded-2xl p-3">
                    <Text className="text-[11px] text-gray-400 uppercase font-semibold">Origen</Text>
                    <Text className="text-sm text-gray-800 font-semibold mt-0.5" numberOfLines={1}>
                        {traslado.origen ?? "—"}
                    </Text>
                    <Text className="text-xs text-gray-500 mt-0.5">{formatDate(traslado.fechaSalida)}</Text>
                </View>
                <View className="w-8 h-8 rounded-full bg-sena-soft items-center justify-center mx-2">
                    <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
                </View>
                <View className="flex-1 bg-gray-50 rounded-2xl p-3">
                    <Text className="text-[11px] text-gray-400 uppercase font-semibold">Destino</Text>
                    <Text className="text-sm text-gray-800 font-semibold mt-0.5" numberOfLines={1}>
                        {traslado.destino ?? "—"}
                    </Text>
                    <Text className="text-xs text-gray-500 mt-0.5">{formatDate(traslado.fechaLlegada)}</Text>
                </View>
            </View>
        </Card>
    );
}
