import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, Badge, Avatar } from "@/shared/ui";
import { COLORS } from "@/shared/theme";
import { formatDate, relacion, nombrePersona } from "@/shared/utils";

/**
 * variant="aprendiz": el foco es el elemento (vista del aprendiz)
 * variant="gestion":  el foco es la persona (vista del cuentadante)
 * GET /asignaciones trae element, apprentice.user y teacher.user.
 */
export default function AsignacionCard({ asignacion, onPress, variant = "gestion" }) {
    const esAprendiz = variant === "aprendiz";
    const elemento = relacion(asignacion, "element", "element_id", "Elemento");
    const aprendiz = nombrePersona(asignacion, "apprentice", "apprentice_id", "Aprendiz");
    return (
        <Card onPress={onPress}>
            <View className="flex-row items-center">
                {esAprendiz ? (
                    <View className="w-12 h-12 rounded-2xl bg-sena-soft items-center justify-center">
                        <Ionicons name="cube-outline" size={22} color={COLORS.primary} />
                    </View>
                ) : (
                    <Avatar name={aprendiz} size={48} />
                )}
                <View className="flex-1 ml-3.5">
                    <Text className="text-base font-bold text-gray-900" numberOfLines={1}>{esAprendiz ? elemento : aprendiz}</Text>
                    <Text className="text-sm text-gray-500 mt-0.5" numberOfLines={1}>
                        {esAprendiz ? asignacion.element?.codigo_inventario : elemento}
                    </Text>
                </View>
                <Badge label={asignacion.estado} />
            </View>
            <View className="flex-row mt-4 bg-gray-50 rounded-2xl p-3">
                <View className="flex-1">
                    <Text className="text-[11px] text-gray-400 uppercase font-semibold">Desde</Text>
                    <Text className="text-sm text-gray-800 font-semibold mt-0.5">{formatDate(asignacion.fecha_asignacion)}</Text>
                </View>
                <Ionicons name="arrow-forward" size={16} color={COLORS.gray400} style={{ alignSelf: "center" }} />
                <View className="flex-1 items-end">
                    <Text className="text-[11px] text-gray-400 uppercase font-semibold">Devolver</Text>
                    <Text className="text-sm text-gray-800 font-semibold mt-0.5">{formatDate(asignacion.fecha_devolucion_esperada)}</Text>
                </View>
            </View>
        </Card>
    );
}
