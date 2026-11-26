import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheet } from "@/shared/ui";
import { COLORS } from "@/shared/theme";
import { homeOf } from "@/navigation/portals";
import { useAuth } from "../AuthProvider";
import { ROLE_LABELS, rolesAprobados } from "../roles";

/** Permite cambiar de portal cuando una persona tiene más de un rol aprobado. */
export default function RoleSwitcher({ visible, onClose }) {
    const { user, setRolActivo } = useAuth();
    const router = useRouter();
    const roles = rolesAprobados(user);

    const elegir = async (rol) => {
        await setRolActivo(rol);
        onClose();
        router.replace(homeOf(rol));
    };

    return (
        <BottomSheet visible={visible} onClose={onClose} title="Cambiar de rol" subtitle="Elige con qué portal quieres entrar" icon="swap-horizontal-outline">
            {roles.map((rol) => {
                const activo = rol.rol === user?.rol;
                return (
                    <Pressable
                        key={rol.rol}
                        onPress={() => elegir(rol.rol)}
                        accessibilityRole="radio"
                        accessibilityState={{ selected: activo }}
                        className={`flex-row items-center rounded-2xl border-[1.5px] px-4 py-3.5 mb-2 ${
                            activo ? "bg-sena-soft border-sena" : "bg-gray-50 border-gray-200"
                        }`}
                    >
                        <Ionicons
                            name={activo ? "checkmark-circle" : "ellipse-outline"}
                            size={20}
                            color={activo ? COLORS.primary : COLORS.gray400}
                        />
                        <Text className={`ml-3 text-sm font-semibold ${activo ? "text-sena-dark" : "text-gray-700"}`}>
                            {ROLE_LABELS[rol.rol] ?? rol.rol}
                        </Text>
                        {activo ? <Text className="ml-auto text-xs text-sena font-bold">Activo</Text> : null}
                    </Pressable>
                );
            })}
            <View className="h-2" />
        </BottomSheet>
    );
}
