import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, Badge } from "@/shared/ui";
import { COLORS } from "@/shared/theme";
import { formatDate } from "@/shared/utils";
import { TIPO_ICONOS } from "../reportes.constants";

export default function ReporteCard({ reporte, onPress, showAutor = false }) {
    return (
        <Card onPress={onPress}>
            <View className="flex-row items-start">
                <View className="w-12 h-12 rounded-2xl bg-red-50 items-center justify-center">
                    <Ionicons name={TIPO_ICONOS[reporte.tipo] ?? "alert-circle-outline"} size={22} color={COLORS.danger} />
                </View>
                <View className="flex-1 ml-3.5">
                    <View className="flex-row items-center justify-between">
                        <Text className="flex-1 text-base font-bold text-gray-900 mr-2" numberOfLines={1}>
                            {reporte.elemento}
                        </Text>
                        <Text className="text-xs text-gray-400">{formatDate(reporte.fecha)}</Text>
                    </View>
                    <Text className="text-xs font-semibold text-red-500 mt-0.5">{reporte.tipo}</Text>
                    <Text className="text-sm text-gray-600 mt-1.5 leading-5" numberOfLines={2}>
                        {reporte.descripcion}
                    </Text>
                </View>
            </View>
            <View className="flex-row items-center justify-between mt-4">
                <Badge label={reporte.estado} />
                {showAutor && reporte.reportadoPor ? (
                    <View className="flex-row items-center">
                        <Ionicons name="person-outline" size={13} color={COLORS.gray500} />
                        <Text className="text-xs text-gray-500 ml-1">{reporte.reportadoPor}</Text>
                    </View>
                ) : reporte.ambiente ? (
                    <Text className="text-xs text-gray-500">{reporte.ambiente}</Text>
                ) : null}
            </View>
        </Card>
    );
}
