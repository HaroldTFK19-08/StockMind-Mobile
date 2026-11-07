import { View, Text, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "@/shared/ui";
import { COLORS } from "@/shared/theme";

function Tag({ icon, label, value }) {
    if (!value) return null;
    return (
        <View className="flex-1 flex-row items-center bg-gray-50 rounded-2xl px-3 py-2.5">
            <Ionicons name={icon} size={16} color={COLORS.primary} />
            <View className="ml-2 flex-1">
                <Text className="text-[10px] uppercase font-semibold text-gray-400">{label}</Text>
                <Text className="text-xs font-bold text-ink" numberOfLines={1}>{value}</Text>
            </View>
        </View>
    );
}

/** Tarjeta de un centro (tabla trainingcenters). */
export default function CentroCard({ centro, onPress }) {
    return (
        <Card onPress={onPress}>
            <View className="flex-row items-center">
                {centro.foto_centro ? (
                    <Image source={{ uri: centro.foto_centro }} className="w-12 h-12 rounded-2xl bg-gray-100" resizeMode="cover" />
                ) : (
                    <View className="w-12 h-12 rounded-2xl bg-sena-soft items-center justify-center">
                        <Ionicons name="business" size={22} color={COLORS.primary} />
                    </View>
                )}
                <Text className="flex-1 ml-3.5 text-base font-bold text-gray-900 leading-5">{centro.nombre}</Text>
            </View>
            <View className="flex-row gap-2 mt-4">
                <Tag icon="map-outline" label="Regional" value={centro.regional} />
                <Tag icon="navigate-outline" label="Ciudad" value={centro.ciudad} />
            </View>
        </Card>
    );
}
