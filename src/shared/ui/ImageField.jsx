import { View, Text, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { COLORS } from "../theme/colors";

/**
 * Selector de imagen (galería) conectado a formik.
 * El valor puede ser:
 *   - un string (URL que ya está guardada en el backend)
 *   - un objeto { uri, fileName, mimeType } recién elegido → se sube como archivo
 */
export default function ImageField({ formik, name, label = "Foto" }) {
    const valor = formik.values[name];
    const error = formik.touched[name] && formik.errors[name];
    const uri = typeof valor === "string" ? valor : valor?.uri;

    const elegir = async () => {
        const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permiso.granted) {
            formik.setFieldError(name, "Debes permitir el acceso a tus fotos.");
            return;
        }
        const resultado = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            quality: 0.7, // el backend acepta máximo 5 MB
        });
        if (!resultado.canceled) {
            formik.setFieldValue(name, resultado.assets[0]);
            formik.setFieldTouched(name, true, false);
        }
    };

    return (
        <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">{label}</Text>
            <Pressable
                onPress={elegir}
                accessibilityRole="button"
                className={`h-40 rounded-2xl border-[1.5px] border-dashed items-center justify-center overflow-hidden ${
                    error ? "border-red-400" : "border-gray-300"
                } bg-gray-50`}
            >
                {uri ? (
                    <Image source={{ uri }} className="w-full h-full" resizeMode="cover" />
                ) : (
                    <>
                        <Ionicons name="image-outline" size={32} color={COLORS.gray400} />
                        <Text className="text-gray-500 text-sm mt-2">Toca para elegir una imagen</Text>
                    </>
                )}
            </Pressable>
            {error ? <Text className="text-red-500 text-xs mt-1.5 ml-1">{error}</Text> : null}
        </View>
    );
}
