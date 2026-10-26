import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/shared/ui";
import { COLORS } from "@/shared/theme";
import { useAuthAnimation } from "../hooks/useAuthAnimation";
import AuthBackground from "../components/AuthBackground";

const BENEFICIOS = [
    { icon: "cube-outline", texto: "Controla el inventario de cada ambiente" },
    { icon: "swap-horizontal-outline", texto: "Registra asignaciones y traslados" },
    { icon: "document-text-outline", texto: "Reporta novedades en segundos" },
];

export default function WelcomeScreen() {
    const router = useRouter();
    const animationStyle = useAuthAnimation();
    return (
        <AuthBackground animationStyle={animationStyle}>
            <Text className="text-ink text-2xl font-extrabold text-center">¡Bienvenido!</Text>
            <Text className="text-gray-500 text-center text-[15px] mt-2 leading-5">
                Gestiona el inventario del SENA de forma rápida, sencilla y segura.
            </Text>

            <View className="my-6 gap-3">
                {BENEFICIOS.map((b) => (
                    <View key={b.texto} className="flex-row items-center">
                        <View className="w-9 h-9 rounded-xl bg-sena-soft items-center justify-center">
                            <Ionicons name={b.icon} size={18} color={COLORS.primary} />
                        </View>
                        <Text className="text-gray-700 ml-3 flex-1">{b.texto}</Text>
                    </View>
                ))}
            </View>

            <Button title="Iniciar sesión" icon="log-in-outline" onPress={() => router.push("/auth/login")} />
            <Button
                title="Crear cuenta"
                icon="person-add-outline"
                variant="outline"
                className="mt-3"
                onPress={() => router.push("/auth/register")}
            />

            <View className="flex-row items-center justify-center mt-6">
                <Ionicons name="shield-checkmark-outline" size={15} color={COLORS.primary} />
                <Text className="text-gray-400 text-xs ml-2">Plataforma segura del SENA · Popayán</Text>
            </View>
        </AuthBackground>
    );
}
