import { Animated, View, Image, Text, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { LOGO_BLANCO } from "@/shared/theme";
import { SafeAreaView } from "react-native-safe-area-context";

/** Fondo verde con círculos decorativos + tarjeta blanca, compartido por las pantallas de acceso. */
export default function AuthBackground({ children, showBrand = true, animationStyle }) {
    return (
        <SafeAreaView className="flex-1 bg-sena">
            <View className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-sena-light opacity-40" />
            <View className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-sena-dark opacity-30" />
            <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : undefined}>
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: 22, paddingVertical: 24 }}
                >
                    {showBrand ? (
                        <View className="items-center mb-6">
                            <Image source={LOGO_BLANCO} style={{ width: 64, height: 64 }} resizeMode="contain" />
                            <Text className="text-white text-3xl font-extrabold mt-3">StockMind</Text>
                            <Text className="text-green-100 text-sm mt-1">Gestión inteligente de inventario SENA</Text>
                        </View>
                    ) : null}
                    <Animated.View
                        className="bg-white rounded-[32px] border border-white/80 px-6 py-7"
                        style={[{ boxShadow: "0px 16px 40px rgba(0,0,0,0.18)" }, animationStyle]}
                    >
                        {children}
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
