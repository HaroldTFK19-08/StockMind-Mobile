import { Pressable, View } from "react-native";

/** Tarjeta blanca. Si recibe onPress se vuelve presionable con feedback. */
export default function Card({ children, onPress, className = "", ...rest }) {
    const base = `bg-white rounded-[28px] p-5 border border-slate-100 shadow-sm shadow-slate-900/5 ${className}`;
    if (!onPress) {
        return (
            <View className={base} {...rest}>
                {children}
            </View>
        );
    }
    return (
        <Pressable
            onPress={onPress}
            className={`${base} active:opacity-90`}
            accessibilityRole="button"
            {...rest}
        >
            {children}
        </Pressable>
    );
}
