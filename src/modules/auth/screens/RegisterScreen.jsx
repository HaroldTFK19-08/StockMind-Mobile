import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useFormik } from "formik";
import { Ionicons } from "@expo/vector-icons";
import { Button, TextField, ChipSelect, useToast } from "@/shared/ui";
import { COLORS } from "@/shared/theme";
import { useAuthAnimation } from "../hooks/useAuthAnimation";
import AuthBackground from "../components/AuthBackground";
import { useAuth } from "../AuthProvider";
import { registerSchema } from "../auth.schemas";
import { ROLES_REGISTRO, ROLES } from "../roles";

export default function RegisterScreen() {
    const router = useRouter();
    const toast = useToast();
    const { register } = useAuth();
    const [serverError, setServerError] = useState(null);
    const animationStyle = useAuthAnimation();

    const formik = useFormik({
        initialValues: {
            rol: ROLES.APRENDIZ,
            nombre: "",
            documento: "",
            correo: "",
            contrasena: "",
            confirmarContrasena: "",
        },
        validationSchema: registerSchema,
        onSubmit: async (values) => {
            setServerError(null);
            try {
                const result = await register(values);
                if (!result?.token) {
                    toast.show("Cuenta creada. Ahora inicia sesión.");
                    router.replace("/auth/login");
                }
            } catch (error) {
                setServerError(error.message);
            }
        },
    });

    return (
        <AuthBackground showBrand={false} animationStyle={animationStyle}>
            <Pressable onPress={() => router.back()} hitSlop={10} className="self-start mb-3" accessibilityLabel="Volver">
                <Ionicons name="arrow-back" size={24} color={COLORS.gray700} />
            </Pressable>
            <Text className="text-ink text-2xl font-extrabold">Crear cuenta</Text>
            <Text className="text-gray-500 text-[15px] mt-1 mb-5">Completa tus datos para empezar a usar StockMind.</Text>

            {serverError ? (
                <View className="flex-row items-center bg-red-50 border border-red-100 rounded-2xl p-3 mb-4">
                    <Ionicons name="alert-circle" size={20} color={COLORS.danger} />
                    <Text className="flex-1 text-red-600 text-sm ml-2">{serverError}</Text>
                </View>
            ) : null}

            <ChipSelect label="¿Cuál es tu rol?" options={ROLES_REGISTRO} formik={formik} name="rol" />
            <TextField formik={formik} name="nombre" label="Nombre completo" icon="person-outline" placeholder="Ej: Laura Martínez" autoComplete="name" />
            <TextField formik={formik} name="documento" label="Documento" icon="card-outline" placeholder="Número de documento" keyboardType="number-pad" />
            <TextField
                formik={formik}
                name="correo"
                label="Correo electrónico"
                icon="mail-outline"
                placeholder="usuario@soy.sena.edu"
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextField formik={formik} name="contrasena" label="Contraseña" icon="lock-closed-outline" placeholder="Mínimo 6 caracteres" secureTextEntry />
            <TextField
                formik={formik}
                name="confirmarContrasena"
                label="Confirmar contraseña"
                icon="checkmark-circle-outline"
                placeholder="Repite la contraseña"
                secureTextEntry
            />

            <Button title="Crear cuenta" icon="person-add-outline" loading={formik.isSubmitting} onPress={formik.handleSubmit} className="mt-2" />

            <View className="flex-row items-center justify-center mt-5">
                <Text className="text-gray-500 text-sm">¿Ya tienes cuenta?</Text>
                <Pressable onPress={() => router.replace("/auth/login")} hitSlop={8}>
                    <Text className="text-sena font-bold text-sm ml-1.5">Inicia sesión</Text>
                </Pressable>
            </View>
        </AuthBackground>
    );
}
