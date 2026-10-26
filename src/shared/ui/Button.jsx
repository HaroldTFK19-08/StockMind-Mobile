import { ActivityIndicator, Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../theme/colors";

const VARIANTS = {
    primary: { box: "bg-sena", text: "text-white", icon: COLORS.white },
    outline: { box: "border-2 border-sena bg-white", text: "text-sena", icon: COLORS.primary },
    soft: { box: "bg-sena-soft", text: "text-sena-dark", icon: COLORS.primaryDark },
    danger: { box: "bg-red-50", text: "text-red-600", icon: COLORS.danger },
    ghost: { box: "bg-transparent", text: "text-gray-600", icon: COLORS.gray500 },
};

export default function Button({
    title,
    onPress,
    icon,
    variant = "primary",
    loading = false,
    disabled = false,
    size = "lg",
    className = "",
}) {
    const v = VARIANTS[variant] ?? VARIANTS.primary;
    const inactive = disabled || loading;
    const pad = size === "sm" ? "min-h-11 py-2.5 px-4" : "min-h-14 py-4 px-5";
    return (
        <Pressable
            onPress={onPress}
            disabled={inactive}
            accessibilityRole="button"
            accessibilityState={{ disabled: inactive, busy: loading }}
            className={`flex-row items-center justify-center rounded-2xl ${pad} ${v.box} ${
                inactive ? "opacity-60" : "active:opacity-90"
            } ${className}`}
        >
            {loading ? (
                <ActivityIndicator color={v.icon} />
            ) : (
                <>
                    {icon ? <Ionicons name={icon} size={size === "sm" ? 17 : 20} color={v.icon} /> : null}
                    <Text className={`font-bold ${size === "sm" ? "text-sm" : "text-base"} ${v.text} ${icon ? "ml-2" : ""}`}>
                        {title}
                    </Text>
                </>
            )}
        </Pressable>
    );
}
