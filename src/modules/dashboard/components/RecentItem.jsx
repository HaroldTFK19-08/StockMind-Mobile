import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Badge } from "@/shared/ui";
import { COLORS } from "@/shared/theme";
import { formatDate } from "@/shared/utils";

export default function RecentItem({ item, last }) {
    return (
        <View className={`flex-row items-center py-3.5 ${last ? "" : "border-b border-gray-100"}`}>
            <View className="w-10 h-10 rounded-2xl bg-gray-50 items-center justify-center">
                <Ionicons name={item.icon} size={19} color={COLORS.gray500} />
            </View>
            <View className="flex-1 mx-3">
                <Text className="text-[15px] font-semibold text-gray-800" numberOfLines={1}>
                    {item.titulo}
                </Text>
                <Text className="text-xs text-gray-500 mt-0.5" numberOfLines={1}>
                    {item.subtitulo}
                </Text>
            </View>
            <View className="items-end">
                {item.estado ? <Badge label={item.estado} /> : null}
                <Text className="text-[11px] text-gray-400 mt-1">{formatDate(item.fecha, "")}</Text>
            </View>
        </View>
    );
}
