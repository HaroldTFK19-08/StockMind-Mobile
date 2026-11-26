import { useState } from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Badge, Button, Card } from "@/shared/ui";
import { COLORS } from "@/shared/theme";
import { useAuthAnimation } from "../hooks/useAuthAnimation";
import AuthBackground from "../components/AuthBackground";
import { useAuth } from "../AuthProvider";
import { etiquetasRoles, rolesPendientes } from "../roles";

/** Mientras no haya un rol aprobado, la persona no puede entrar a ningún portal. */
export default function PendingScreen() {
    const { user, recargarSesion, logout } = useAuth();
    const [actualizando, setActualizando] = useState(false);
    const animationStyle = useAuthAnimation();

    const actualizar = async () => {
        setActualizando(true);
        try {
            await recargarSesion();
        } finally {
            setActualizando(false);
        }
    };

    return (
        <AuthBackground animationStyle={animationStyle}>
            <Card className="items-center py-8 px-6">
                <View className="w-20 h-20 rounded-full bg-amber-50 items-center justify-center">
                    <Ionicons name="time-outline" size={42} color="#F59E0B" />
                </View>
                <Text className="text-xl font-extrabold text-ink mt-5 text-center">
                    Esperando aprobación
                </Text>
                <Text className="text-gray-600 text-[15px] leading-6 text-center mt-3">
                    Estás en proceso de autenticación; un administrador te otorgará los permisos
                </Text>
            </Card>

            <Card className="mt-4">
                <Text className="text-sm font-bold text-ink mb-3">Tus roles solicitados</Text>
                {etiquetasRoles(user).length ? (
                    etiquetasRoles(user).map((rol) => (
                        <View key={rol.rol} className="flex-row items-center justify-between py-2">
                            <Text className="text-gray-700 text-sm">{rol.etiqueta}</Text>
                            <Badge
                                label={rol.estado === "pendiente" ? "Pendiente" : "Aprobado"}
                                tone={rol.estado === "pendiente" ? "warning" : "success"}
                            />
                        </View>
                    ))
                ) : (
                    <Text className="text-gray-500 text-sm">No hay roles registrados.</Text>
                )}
                {rolesPendientes(user).length > 0 ? (
                    <Text className="text-xs text-gray-400 mt-3 leading-5">
                        Cuando el administrador apruebe uno de estos roles, podrás entrar a tu portal.
                    </Text>
                ) : null}
            </Card>

            <Button
                title="Ya fui aprobado, actualizar"
                icon="refresh-outline"
                variant="outline"
                loading={actualizando}
                onPress={actualizar}
                className="mt-5"
            />
            <Button title="Cerrar sesión" icon="log-out-outline" variant="ghost" onPress={logout} className="mt-2" />
        </AuthBackground>
    );
}
