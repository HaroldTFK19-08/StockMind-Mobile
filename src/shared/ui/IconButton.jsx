import { Pressable, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../theme/colors";

const VARIANTS = {
    light: { box: "bg-white", color: COLORS.gray700 },
    primary: { box: "bg-sena", color: COLORS.white },
    translucent: { box: "bg-white/15", color: COLORS.white },
    soft: { box: "bg-gray-100", color: COLORS.gray500 },
};

export default function IconButton({ icon, onPress, variant = "light", size = 44, badge, label, className = "" }) {
    const v = VARIANTS[variant] ?? VARIANTS.light;
    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={label}
            hitSlop={6}
            style={{ width: size, height: size }}
            className={`rounded-2xl items-center justify-center active:opacity-70 ${v.box} ${className}`}
        >
            <Ionicons name={icon} size={Math.round(size * 0.5)} color={v.color} />
            {badge ? (
                <View className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 items-center justify-center border-2 border-sena">
                    <Text className="text-[10px] font-bold text-white">{badge > 9 ? "9+" : badge}</Text>
                </View>
            ) : null}
        </Pressable>
    );
}
