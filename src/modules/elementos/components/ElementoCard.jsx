import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, Badge } from "@/shared/ui";
import { COLORS } from "@/shared/theme";
import { CATEGORIA_ICONOS } from "../elementos.constants";

export default function ElementoCard({ elemento, onPress }) {
    return (
        <Card onPress={onPress}>
            <View className="flex-row items-start">
                <View className="w-12 h-12 rounded-2xl bg-sena-soft items-center justify-center">
                    <Ionicons name={CATEGORIA_ICONOS[elemento.categoria] ?? "cube-outline"} size={22} color={COLORS.primary} />
                </View>
                <View className="flex-1 ml-3.5">
                    <Text className="text-base font-bold text-gray-900" numberOfLines={1}>
                        {elemento.nombre}
                    </Text>
                    <Text className="text-xs text-gray-400 mt-0.5 font-medium">{elemento.placa ?? elemento.categoria}</Text>
                    <Text className="text-sm text-gray-500 mt-1.5 leading-5" numberOfLines={2}>
                        {elemento.descripcion}
                    </Text>
                </View>
            </View>
            <View className="flex-row items-center justify-between mt-4">
                <Badge label={elemento.estado} />
                {elemento.ambiente ? (
                    <View className="flex-row items-center">
                        <Ionicons name="location-outline" size={14} color={COLORS.gray500} />
                        <Text className="text-xs text-gray-500 ml-1">{elemento.ambiente}</Text>
                    </View>
                ) : null}
            </View>
        </Card>
    );
}
