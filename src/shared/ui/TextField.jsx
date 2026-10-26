import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../theme/colors";

/**
 * Campo de texto con etiqueta, ícono y error.
 * Con `formik` + `name` se conecta solo:  <TextField formik={formik} name="correo" label="Correo" />
 */
export default function TextField({
    label,
    icon,
    error,
    formik,
    name,
    value,
    onChangeText,
    onBlur,
    secureTextEntry,
    multiline,
    hint,
    ...inputProps
}) {
    const [focused, setFocused] = useState(false);
    const [hidden, setHidden] = useState(Boolean(secureTextEntry));

    const bound = formik && name;
    const currentValue = bound ? formik.values[name] : value;
    const currentError = bound ? formik.touched[name] && formik.errors[name] : error;

    const border = currentError ? "border-red-400" : focused ? "border-sena" : "border-gray-200";

    return (
        <View className="mb-4">
            {label ? <Text className="text-sm font-semibold text-gray-700 mb-2">{label}</Text> : null}
            <View
                className={`flex-row bg-white border-[1.5px] rounded-2xl px-4 ${border} ${
                    multiline ? "items-start py-3" : "items-center h-14"
                }`}
            >
                {icon ? (
                    <Ionicons name={icon} size={20} color={focused ? COLORS.primary : COLORS.gray400} />
                ) : null}
                <TextInput
                    value={currentValue == null ? "" : String(currentValue)}
                    onChangeText={bound ? formik.handleChange(name) : onChangeText}
                    onFocus={() => setFocused(true)}
                    onBlur={(e) => {
                        setFocused(false);
                        if (bound) formik.handleBlur(name)(e);
                        onBlur?.(e);
                    }}
                    placeholderTextColor={COLORS.gray400}
                    secureTextEntry={hidden}
                    multiline={multiline}
                    textAlignVertical={multiline ? "top" : "center"}
                    className={`flex-1 text-base text-ink ${icon ? "ml-3" : ""} ${multiline ? "min-h-[88px]" : ""}`}
                    {...inputProps}
                />
                {secureTextEntry ? (
                    <Pressable
                        onPress={() => setHidden((h) => !h)}
                        hitSlop={10}
                        accessibilityLabel={hidden ? "Mostrar contraseña" : "Ocultar contraseña"}
                    >
                        <Ionicons name={hidden ? "eye-outline" : "eye-off-outline"} size={20} color={COLORS.gray400} />
                    </Pressable>
                ) : null}
            </View>
            {currentError ? (
                <Text className="text-red-500 text-xs mt-1.5 ml-1">{currentError}</Text>
            ) : hint ? (
                <Text className="text-gray-400 text-xs mt-1.5 ml-1">{hint}</Text>
            ) : null}
        </View>
    );
}
