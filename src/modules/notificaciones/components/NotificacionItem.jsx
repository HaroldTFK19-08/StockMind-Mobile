import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatRelative } from "@/shared/utils";

const TIPOS = {
    elemento: { icon: "cube-outline", box: "bg-green-50", color: "#39A900" },
    reporte: { icon: "alert-circle-outline", box: "bg-red-50", color: "#EF4444" },
    usuario: { icon: "person-add-outline", box: "bg-blue-50", color: "#3B82F6" },
    traslado: { icon: "swap-horizontal-outline", box: "bg-purple-50", color: "#8B5CF6" },
    alerta: { icon: "warning-outline", box: "bg-amber-50", color: "#F59E0B" },
    info: { icon: "information-circle-outline", box: "bg-gray-100", color: "#6B7280" },
};

export default function NotificacionItem({ notificacion, onPress }) {
    const t = TIPOS[notificacion.tipo] ?? TIPOS.info;
    return (
        <Pressable
            onPress={onPress}
            className={`flex-row bg-white rounded-3xl p-4 border active:opacity-80 ${
                notificacion.leida ? "border-gray-100" : "border-sena/30"
            }`}
        >
            <View className={`w-11 h-11 rounded-2xl items-center justify-center ${t.box}`}>
                <Ionicons name={t.icon} size={22} color={t.color} />
            </View>
            <View className="flex-1 ml-3.5">
                <View className="flex-row items-center justify-between">
                    <Text className={`flex-1 text-[15px] ${notificacion.leida ? "font-semibold text-gray-700" : "font-bold text-gray-900"}`}>
                        {notificacion.titulo}
                    </Text>
                    {!notificacion.leida ? <View className="w-2.5 h-2.5 bg-sena rounded-full ml-2" /> : null}
                </View>
                <Text className="text-sm text-gray-500 mt-1 leading-5">{notificacion.mensaje}</Text>
                <Text className="text-xs text-gray-400 mt-2">{formatRelative(notificacion.fecha)}</Text>
            </View>
        </Pressable>
    );
}
