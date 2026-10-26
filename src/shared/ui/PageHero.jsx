import { View, Text } from "react-native";

/** Banner verde curvo con título y subtítulo. `children` se pinta debajo (p. ej. estadísticas). */
export default function PageHero({ title, subtitle, children, compact = false }) {
    return (
        <View className={`bg-sena rounded-b-[36px] px-6 pt-5 ${compact ? "pb-12" : "pb-14"}`}>
            <Text className="text-[30px] leading-9 font-extrabold tracking-tight text-white">{title}</Text>
            {subtitle ? (
                <Text className="text-green-50 mt-2 text-[15px] leading-5">{subtitle}</Text>
            ) : null}
            {children}
        </View>
    );
}
