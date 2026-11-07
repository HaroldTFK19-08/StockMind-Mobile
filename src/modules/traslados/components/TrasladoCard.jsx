import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, Badge } from "@/shared/ui";
import { COLORS } from "@/shared/theme";
import { formatDate, relacion } from "@/shared/utils";

/** Nombres de los ambientes (relaciones originEnvironment / destinationEnvironment). */
export const origenDe = (t) => relacion(t, "origin_environment", "ambiente_origen_id", "Ambiente");
export const destinoDe = (t) => relacion(t, "destination_environment", "ambiente_destino_id", "Ambiente");
/** Elementos del traslado (vienen en motion.elements). */
export const elementosDe = (t) => t?.motion?.elements ?? [];

/** Tarjeta de un traslado (tabla transfers). */
export default function TrasladoCard({ traslado, onPress }) {
    const cantidad = elementosDe(traslado).length;
    return (
        <Card onPress={onPress}>
            <View className="flex-row items-center">
                <View className="flex-1">
                    <Text className="text-base font-bold text-gray-900" numberOfLines={1}>{traslado.motivo}</Text>
                    <Text className="text-xs text-gray-400 font-medium mt-0.5">
                        {cantidad} {cantidad === 1 ? "elemento" : "elementos"} · {formatDate(traslado.fecha_solicitud)}
                    </Text>
                </View>
                <Badge label={traslado.estado} />
            </View>

            <View className="flex-row items-center mt-4">
                <View className="flex-1 bg-gray-50 rounded-2xl p-3">
                    <Text className="text-[11px] text-gray-400 uppercase font-semibold">Origen</Text>
                    <Text className="text-sm text-gray-800 font-semibold mt-0.5" numberOfLines={1}>{origenDe(traslado) ?? "—"}</Text>
                </View>
                <View className="w-8 h-8 rounded-full bg-sena-soft items-center justify-center mx-2">
                    <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
                </View>
                <View className="flex-1 bg-gray-50 rounded-2xl p-3">
                    <Text className="text-[11px] text-gray-400 uppercase font-semibold">Destino</Text>
                    <Text className="text-sm text-gray-800 font-semibold mt-0.5" numberOfLines={1}>{destinoDe(traslado) ?? "—"}</Text>
                </View>
            </View>
        </Card>
    );
}
