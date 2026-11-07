import { useMemo, useState } from "react";
import { View, Text, Pressable, TextInput, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../theme/colors";
import { normalize } from "../utils/text";

/**
 * Selección de VARIOS registros (ej: element_ids de reportes, traslados y movimientos).
 * El valor en formik es un arreglo de ids. options: [{ label, value, description? }]
 */
export default function MultiSelectField({ formik, name, label, icon = "cube-outline", options = [], loading = false, placeholder = "Selecciona" }) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const seleccion = formik.values[name] ?? [];
    const error = formik.touched[name] && formik.errors[name];

    const esta = (v) => seleccion.some((s) => String(s) === String(v));
    const alternar = (v) => {
        const nueva = esta(v) ? seleccion.filter((s) => String(s) !== String(v)) : [...seleccion, v];
        formik.setFieldValue(name, nueva);
        formik.setFieldTouched(name, true, false);
    };

    const visibles = useMemo(() => {
        const q = normalize(query);
        return (q ? options.filter((o) => normalize(`${o.label} ${o.description ?? ""}`).includes(q)) : options).slice(0, 40);
    }, [options, query]);

    const elegidos = options.filter((o) => esta(o.value));

    return (
        <View className="mb-4">
            {label ? <Text className="text-sm font-semibold text-gray-700 mb-2">{label}</Text> : null}
            <Pressable
                onPress={() => setOpen((o) => !o)}
                className={`min-h-14 flex-row items-center bg-white border-[1.5px] rounded-2xl px-4 py-2 ${
                    error ? "border-red-400" : open ? "border-sena" : "border-gray-200"
                }`}
            >
                <Ionicons name={icon} size={20} color={COLORS.gray400} />
                <Text className={`flex-1 ml-3 text-base ${elegidos.length ? "text-gray-800" : "text-gray-400"}`} numberOfLines={2}>
                    {elegidos.length ? elegidos.map((o) => o.label).join(", ") : placeholder}
                </Text>
                {loading ? <ActivityIndicator size="small" color={COLORS.primary} /> : (
                    <Text className="text-xs font-bold text-sena">{elegidos.length || ""}</Text>
                )}
            </Pressable>

            {open ? (
                <View className="mt-2 bg-white border border-slate-200 rounded-2xl overflow-hidden">
                    {options.length > 6 ? (
                        <View className="flex-row items-center px-3 h-11 border-b border-gray-100">
                            <Ionicons name="search-outline" size={17} color={COLORS.gray400} />
                            <TextInput value={query} onChangeText={setQuery} placeholder="Buscar…"
                                placeholderTextColor={COLORS.gray400} className="flex-1 ml-2 text-sm text-gray-800" />
                        </View>
                    ) : null}
                    {visibles.length === 0 ? (
                        <Text className="text-gray-400 text-sm p-4 text-center">{loading ? "Cargando…" : "Sin resultados"}</Text>
                    ) : visibles.map((opt, idx) => {
                        const activo = esta(opt.value);
                        return (
                            <Pressable key={String(opt.value)} onPress={() => alternar(opt.value)}
                                className={`flex-row items-center px-4 py-3 ${idx > 0 ? "border-t border-gray-100" : ""} ${activo ? "bg-sena-soft" : ""}`}>
                                <Ionicons name={activo ? "checkbox" : "square-outline"} size={20} color={activo ? COLORS.primary : COLORS.gray400} />
                                <View className="flex-1 ml-3">
                                    <Text className="text-[15px] text-gray-800">{opt.label}</Text>
                                    {opt.description ? <Text className="text-xs text-gray-500 mt-0.5">{opt.description}</Text> : null}
                                </View>
                            </Pressable>
                        );
                    })}
                </View>
            ) : null}
            {error ? <Text className="text-red-500 text-xs mt-1.5 ml-1">{error}</Text> : null}
        </View>
    );
}
