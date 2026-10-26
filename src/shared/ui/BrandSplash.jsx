import { useEffect, useRef } from "react";
import { View, Image, Text, Animated, Easing, Platform } from "react-native";
import { LOGO_BLANCO } from "../theme/assets";

/** Pantalla de carga animada mientras se restaura la sesión. */
export default function BrandSplash() {
    const useNativeDriver = Platform.OS !== "web";
    const logo = useRef(new Animated.Value(0)).current;
    const texto = useRef(new Animated.Value(0)).current;
    const barra = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.timing(logo, { toValue: 1, duration: 650, easing: Easing.out(Easing.back(1.5)), useNativeDriver }),
            Animated.timing(texto, { toValue: 1, duration: 450, easing: Easing.out(Easing.ease), useNativeDriver }),
        ]).start();
        Animated.loop(
            Animated.timing(barra, { toValue: 1, duration: 1100, easing: Easing.inOut(Easing.ease), useNativeDriver })
        ).start();
    }, [logo, texto, barra]);

    return (
        <View className="flex-1 items-center justify-center bg-sena">
            <View className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-sena-light opacity-40" />
            <View className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-sena-dark opacity-30" />
            <Animated.View style={{ opacity: logo, transform: [{ scale: logo.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }] }}>
                <Image source={LOGO_BLANCO} style={{ width: 112, height: 112 }} resizeMode="contain" />
            </Animated.View>
            <Animated.View
                className="items-center"
                style={{ opacity: texto, transform: [{ translateY: texto.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}
            >
                <Text className="mt-4 text-4xl font-extrabold text-white">StockMind</Text>
                <Text className="mt-2 text-base text-green-100">Gestión inteligente de inventario</Text>
            </Animated.View>
            <Animated.View style={{ opacity: texto }} className="mt-10 w-40 h-1.5 overflow-hidden rounded-full bg-black/15">
                <Animated.View
                    className="h-1.5 w-16 rounded-full bg-white"
                    style={{ transform: [{ translateX: barra.interpolate({ inputRange: [0, 1], outputRange: [-64, 160] }) }] }}
                />
            </Animated.View>
        </View>
    );
}
