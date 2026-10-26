import { View, Text, Pressable } from "react-native";

/**
 * Selector de opciones cortas en forma de chips (estados, tipos, roles…).
 * options: ["A", "B"]  o  [{ label, value }]
 */
export default function ChipSelect({ label, options = [], value, onChange, formik, name, error }) {
    const bound = formik && name;
    const current = bound ? formik.values[name] : value;
    const currentError = bound ? formik.touched[name] && formik.errors[name] : error;

    const select = (v) => {
        if (bound) {
            formik.setFieldValue(name, v);
            formik.setFieldTouched(name, true, false);
        } else onChange?.(v);
    };

    return (
        <View className="mb-4">
            {label ? <Text className="text-sm font-semibold text-gray-700 mb-2">{label}</Text> : null}
            <View className="flex-row flex-wrap gap-2">
                {options.map((opt) => {
                    const o = typeof opt === "string" ? { label: opt, value: opt } : opt;
                    const active = current === o.value;
                    return (
                        <Pressable
                            key={String(o.value)}
                            onPress={() => select(o.value)}
                            accessibilityRole="radio"
                            accessibilityState={{ selected: active }}
                            className={`min-h-11 px-4 py-2.5 rounded-2xl border-[1.5px] ${
                                active ? "bg-sena-soft border-sena" : "bg-gray-50 border-gray-200"
                            }`}
                        >
                            <Text className={`text-sm font-semibold ${active ? "text-sena-dark" : "text-gray-600"}`}>
                                {o.label}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
            {currentError ? <Text className="text-red-500 text-xs mt-1.5 ml-1">{currentError}</Text> : null}
        </View>
    );
}
