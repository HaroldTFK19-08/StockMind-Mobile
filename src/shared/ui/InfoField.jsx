import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../theme/colors";

/** Par etiqueta / valor con ícono opcional. */
export default function InfoField({ label, value, icon, children, className = "" }) {
    return (
        <View className={`flex-row items-start ${className}`}>
            {icon ? (
                <View className="w-10 h-10 rounded-2xl bg-sena-soft items-center justify-center mr-3">
                    <Ionicons name={icon} size={17} color={COLORS.gray500} />
                </View>
            ) : null}
            <View className="flex-1">
                <Text className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">{label}</Text>
                {children ?? <Text className="text-[15px] text-ink font-medium mt-1">{value ?? "—"}</Text>}
            </View>
        </View>
    );
}

/** Bloque gris para agrupar InfoFields dentro de un detalle. */
export function InfoGroup({ children }) {
    return <View className="bg-slate-50 rounded-3xl p-4 gap-5 mb-4">{children}</View>;
}
