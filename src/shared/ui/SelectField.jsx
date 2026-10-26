import { useMemo, useState } from "react";
import { View, Text, Pressable, TextInput, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../theme/colors";
import { normalize } from "../utils/text";

/**
 * Lista desplegable con búsqueda, pensada para relaciones (aprendiz, elemento, ambiente…).
 * options: [{ label, value, description? }]
 */
export default function SelectField({
    label,
    placeholder = "Selecciona una opción",
    options = [],
    loading = false,
    formik,
    name,
    value,
    onChange,
    error,
    icon,
}) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");

    const bound = formik && name;
    const current = bound ? formik.values[name] : value;
    const currentError = bound ? formik.touched[name] && formik.errors[name] : error;
    const selected = options.find((o) => String(o.value) === String(current));

    const visibles = useMemo(() => {
        const q = normalize(query);
        const list = q
            ? options.filter((o) => normalize(`${o.label} ${o.description ?? ""}`).includes(q))
            : options;
        return list.slice(0, 30);
    }, [options, query]);

    const choose = (opt) => {
        if (bound) {
            formik.setFieldValue(name, opt.value);
            formik.setFieldTouched(name, true, false);
        }
        onChange?.(opt.value, opt);
        setOpen(false);
        setQuery("");
    };

    return (
        <View className="mb-4">
            {label ? <Text className="text-sm font-semibold text-gray-700 mb-2">{label}</Text> : null}
            <Pressable
                onPress={() => setOpen((o) => !o)}
                accessibilityRole="button"
                className={`h-14 flex-row items-center bg-white border-[1.5px] rounded-2xl px-4 ${
                    currentError ? "border-red-400" : open ? "border-sena" : "border-gray-200"
                }`}
            >
                {icon ? <Ionicons name={icon} size={20} color={COLORS.gray400} /> : null}
                <Text
                    numberOfLines={1}
                    className={`flex-1 text-base ${icon ? "ml-3" : ""} ${selected ? "text-gray-800" : "text-gray-400"}`}
                >
                    {selected?.label ?? placeholder}
                </Text>
                {loading ? (
                    <ActivityIndicator size="small" color={COLORS.primary} />
                ) : (
                    <Ionicons name={open ? "chevron-up" : "chevron-down"} size={20} color={COLORS.gray400} />
                )}
            </Pressable>

            {open ? (
                <View className="mt-2 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm shadow-slate-900/5">
                    {options.length > 6 ? (
                        <View className="flex-row items-center px-3 h-11 border-b border-gray-100">
                            <Ionicons name="search-outline" size={17} color={COLORS.gray400} />
                            <TextInput
                                value={query}
                                onChangeText={setQuery}
                                placeholder="Buscar…"
                                placeholderTextColor={COLORS.gray400}
                                className="flex-1 ml-2 text-sm text-gray-800"
                            />
                        </View>
                    ) : null}
                    {visibles.length === 0 ? (
                        <Text className="text-gray-400 text-sm p-4 text-center">
                            {loading ? "Cargando…" : "Sin resultados"}
                        </Text>
                    ) : (
                        visibles.map((opt, idx) => {
                            const active = String(opt.value) === String(current);
                            return (
                                <Pressable
                                    key={String(opt.value)}
                                    onPress={() => choose(opt)}
                                    className={`flex-row items-center px-4 py-3 active:bg-gray-50 ${
                                        idx > 0 ? "border-t border-gray-100" : ""
                                    } ${active ? "bg-sena-soft" : ""}`}
                                >
                                    <View className="flex-1">
                                        <Text className={`text-[15px] ${active ? "font-bold text-sena-dark" : "text-gray-800"}`}>
                                            {opt.label}
                                        </Text>
                                        {opt.description ? (
                                            <Text className="text-xs text-gray-500 mt-0.5">{opt.description}</Text>
                                        ) : null}
                                    </View>
                                    {active ? <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} /> : null}
                                </Pressable>
                            );
                        })
                    )}
                </View>
            ) : null}
            {currentError ? <Text className="text-red-500 text-xs mt-1.5 ml-1">{currentError}</Text> : null}
        </View>
    );
}
