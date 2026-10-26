import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../theme/colors";

/** Acceso rápido de las pantallas de inicio. */
export default function ActionCard({ icon, title, description, onPress }) {
    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            className="flex-row items-center bg-white rounded-[28px] p-4 border border-slate-100 active:opacity-90"
        >
            <View className="w-12 h-12 rounded-2xl bg-sena-soft items-center justify-center">
                <Ionicons name={icon} size={24} color={COLORS.primary} />
            </View>
            <View className="flex-1 mx-3.5">
                <Text className="text-base font-bold text-ink">{title}</Text>
                {description ? <Text className="text-gray-500 text-sm mt-0.5 leading-5">{description}</Text> : null}
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray400} />
        </Pressable>
    );
}
