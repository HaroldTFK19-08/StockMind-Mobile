import { View, Text, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, Badge } from "@/shared/ui";
import { COLORS } from "@/shared/theme";
import { CATEGORIA_ICONOS } from "../elementos.constants";

/** Tarjeta de un elemento (GET /elementos trae category, environment y warehouse). */
export default function ElementoCard({ elemento, onPress }) {
    const ubicacion = elemento.environment?.nombre ?? elemento.warehouse?.nombre;
    return (
        <Card onPress={onPress}>
            <View className="flex-row items-start">
                {elemento.img_elemento ? (
                    <Image source={{ uri: elemento.img_elemento }} className="w-12 h-12 rounded-2xl bg-gray-100" resizeMode="cover" />
                ) : (
                    <View className="w-12 h-12 rounded-2xl bg-sena-soft items-center justify-center">
                        <Ionicons name={CATEGORIA_ICONOS[elemento.category?.nombre] ?? "cube-outline"} size={22} color={COLORS.primary} />
                    </View>
                )}
                <View className="flex-1 ml-3.5">
                    <Text className="text-base font-bold text-gray-900" numberOfLines={1}>{elemento.nombre}</Text>
                    <Text className="text-xs text-gray-400 mt-0.5 font-medium">
                        {[elemento.codigo_inventario, elemento.category?.nombre].filter(Boolean).join(" · ")}
                    </Text>
                    {elemento.descripcion ? (
                        <Text className="text-sm text-gray-500 mt-1.5 leading-5" numberOfLines={2}>{elemento.descripcion}</Text>
                    ) : null}
                </View>
            </View>
            <View className="flex-row items-center justify-between mt-4">
                <Badge label={elemento.estado} />
                {ubicacion ? (
                    <View className="flex-row items-center">
                        <Ionicons name="location-outline" size={14} color={COLORS.gray500} />
                        <Text className="text-xs text-gray-500 ml-1">{ubicacion}</Text>
                    </View>
                ) : null}
            </View>
        </Card>
    );
}
