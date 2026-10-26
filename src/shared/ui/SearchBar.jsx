import { View, TextInput, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../theme/colors";

/** Barra de búsqueda controlada, con acción opcional (botón "+") a la derecha. */
export default function SearchBar({ value, onChangeText, placeholder = "Buscar…", onAdd, addLabel = "Agregar" }) {
    return (
        <View className="flex-row items-center gap-3">
            <View
                className="flex-1 h-14 flex-row items-center rounded-2xl border border-slate-100 bg-white px-4"
                style={{ boxShadow: "0px 4px 14px rgba(23, 33, 23, 0.08)" }}
            >
                <Ionicons name="search-outline" size={20} color={COLORS.primary} />
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={COLORS.gray400}
                    returnKeyType="search"
                    autoCorrect={false}
                    className="flex-1 ml-3 text-base text-gray-800"
                />
                {value ? (
                    <Pressable
                        onPress={() => onChangeText("")}
                        hitSlop={8}
                        accessibilityLabel="Limpiar búsqueda"
                        className="w-7 h-7 items-center justify-center rounded-full bg-gray-100"
                    >
                        <Ionicons name="close" size={15} color={COLORS.gray500} />
                    </Pressable>
                ) : null}
            </View>
            {onAdd ? (
                <Pressable
                    onPress={onAdd}
                    accessibilityRole="button"
                    accessibilityLabel={addLabel}
                    className="w-14 h-14 items-center justify-center rounded-2xl bg-sena-dark active:opacity-90"
                    style={{ boxShadow: "0px 4px 14px rgba(46, 133, 0, 0.35)" }}
                >
                    <Ionicons name="add" size={26} color={COLORS.white} />
                </Pressable>
            ) : null}
        </View>
    );
}
