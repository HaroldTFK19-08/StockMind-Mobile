import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CUENTAS = [
    { rol: "Administrador", icon: "shield-checkmark-outline", correo: "adminsena@soy.sena.edu", contrasena: "admin123" },
    { rol: "Instructor", icon: "school-outline", correo: "instructorsena@soy.sena.edu", contrasena: "instructor124" },
    { rol: "Cuentadante", icon: "key-outline", correo: "dantesena@soy.sena.edu", contrasena: "dante321" },
    { rol: "Aprendiz", icon: "person-outline", correo: "aprendizsena@soy.sena.edu", contrasena: "aprendiz2026" },
];

/** Accesos rápidos de prueba. El login es local mientras Laravel no tenga autenticación. */
export default function DemoAccounts({ onSelect }) {
    return (
        <View className="mt-6 pt-5 border-t border-gray-100">
            <Text className="text-xs text-gray-400 text-center mb-3">Modo demo · toca un rol para autocompletar</Text>
            <View className="flex-row flex-wrap gap-2 justify-center">
                {CUENTAS.map((c) => (
                    <Pressable
                        key={c.correo}
                        onPress={() => onSelect(c)}
                        className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 active:bg-sena-soft"
                    >
                        <Ionicons name={c.icon} size={15} color="#2E8500" />
                        <Text className="text-xs font-semibold text-gray-700 ml-1.5">{c.rol}</Text>
                    </Pressable>
                ))}
            </View>
        </View>
    );
}
