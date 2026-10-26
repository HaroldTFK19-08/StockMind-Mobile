import { Animated, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/** Contenedor base de todas las pantallas: área segura + fondo institucional. */
export default function Screen({ children, className = "", edges = ["top"], animationStyle }) {
    return (
        <SafeAreaView edges={edges} className="flex-1 bg-sena">
            <Animated.View style={[{ flex: 1 }, animationStyle]}>
                <View className={`flex-1 bg-surface ${className}`}>{children}</View>
            </Animated.View>
        </SafeAreaView>
    );
}
