import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, Badge } from "@/shared/ui";
import { COLORS } from "@/shared/theme";
import { AMBIENTE_ICONOS } from "../ambientes.constants";

export default function AmbienteCard({ ambiente, onPress }) {
    return (
        <Card onPress={onPress}>
            <View className="flex-row items-center">
                <View className="w-12 h-12 rounded-2xl bg-sena-soft items-center justify-center">
                    <Ionicons name={AMBIENTE_ICONOS[ambiente.tipo] ?? "easel-outline"} size={22} color={COLORS.primary} />
                </View>
                <View className="flex-1 ml-3.5">
                    <Text className="text-base font-bold text-gray-900">{ambiente.nombre}</Text>
                    <Text className="text-sm text-gray-500 mt-0.5" numberOfLines={1}>
                        {ambiente.tipo} · {ambiente.centro}
                    </Text>
                </View>
            </View>
            <View className="flex-row items-center justify-between mt-4">
                <Badge label={ambiente.estado} />
                <View className="flex-row items-center gap-4">
                    {ambiente.capacidad ? (
                        <View className="flex-row items-center">
                            <Ionicons name="people-outline" size={15} color={COLORS.gray500} />
                            <Text className="text-sm text-gray-600 ml-1">{ambiente.capacidad}</Text>
                        </View>
                    ) : null}
                    {ambiente.totalElementos != null ? (
                        <View className="flex-row items-center">
                            <Ionicons name="cube-outline" size={15} color={COLORS.gray500} />
                            <Text className="text-sm text-gray-600 ml-1">{ambiente.totalElementos}</Text>
                        </View>
                    ) : null}
                </View>
            </View>
        </Card>
    );
}
