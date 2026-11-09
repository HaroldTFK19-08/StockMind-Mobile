import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useFormik } from "formik";
import { Ionicons } from "@expo/vector-icons";
import { Button, Card, TextField } from "@/shared/ui";
import { COLORS } from "@/shared/theme";
import { useAuthAnimation } from "../hooks/useAuthAnimation";
import AuthBackground from "../components/AuthBackground";
import { DEMO_CREDENTIALS } from "../auth.service";
import { useAuth } from "../AuthProvider";
import { loginSchema } from "../validations/auth.schemas";
import { ROLE_LABELS } from "../roles";

export default function LoginScreen() {
    const router = useRouter();
    const { login } = useAuth();
    const [serverError, setServerError] = useState(null);
    const animationStyle = useAuthAnimation();

    const formik = useFormik({
        initialValues: { correo: "", contrasena: "" },
        validationSchema: loginSchema,
        onSubmit: async (values) => {
            setServerError(null);
            try {
                await login(values);
                // La navegación al portal del rol la hace app/_layout.jsx (rutas protegidas)
            } catch (error) {
                setServerError(error.message);
            }
        },
    });

    return (
        <AuthBackground animationStyle={animationStyle}>
            <Pressable onPress={() => router.back()} hitSlop={10} className="self-start mb-3" accessibilityLabel="Volver">
                <Ionicons name="arrow-back" size={24} color={COLORS.gray700} />
            </Pressable>
            <Text className="text-ink text-2xl font-extrabold">Iniciar sesión</Text>
            <Text className="text-gray-500 text-[15px] mt-1 mb-6">Ingresa con tu correo institucional.</Text>

            {serverError ? (
                <View className="flex-row items-center bg-red-50 border border-red-100 rounded-2xl p-3 mb-4">
                    <Ionicons name="alert-circle" size={20} color={COLORS.danger} />
                    <Text className="flex-1 text-red-600 text-sm ml-2">{serverError}</Text>
                </View>
            ) : null}

            <TextField
                formik={formik}
                name="correo"
                label="Correo electrónico"
                icon="mail-outline"
                placeholder="usuario@soy.sena.edu"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
            />
            <TextField
                formik={formik}
                name="contrasena"
                label="Contraseña"
                icon="lock-closed-outline"
                placeholder="••••••••"
                secureTextEntry
                autoComplete="password"
                textContentType="password"
                returnKeyType="go"
                onSubmitEditing={formik.handleSubmit}
            />

            <Button
                title="Ingresar"
                icon="log-in-outline"
                loading={formik.isSubmitting}
                onPress={formik.handleSubmit}
                className="mt-2"
            />

            <Card className="bg-slate-50 border-slate-100 rounded-2xl p-4 mt-5">
                <Text className="text-ink font-bold text-sm">Cuentas demo</Text>
                <Text className="text-gray-500 text-xs mt-1 mb-3">
                    Toca una cuenta para cargar sus datos. Son solo para pruebas locales.
                </Text>
                {DEMO_CREDENTIALS.map((credential) => (
                    <Pressable
                        key={credential.rol}
                        onPress={() =>
                            formik.setValues({
                                correo: credential.correo,
                                contrasena: credential.contrasena,
                            })
                        }
                        className="flex-row items-center py-2 border-t border-slate-200"
                        accessibilityRole="button"
                        accessibilityLabel={`Usar cuenta demo de ${ROLE_LABELS[credential.rol]}`}
                    >
                        <Text className="flex-1 text-gray-700 text-xs font-semibold">
                            {ROLE_LABELS[credential.rol]}
                        </Text>
                        <Text className="text-sena text-xs" numberOfLines={1}>
                            {credential.correo}
                        </Text>
                    </Pressable>
                ))}
            </Card>

            <View className="flex-row items-center justify-center mt-5">
                <Text className="text-gray-500 text-sm">¿No tienes cuenta?</Text>
                <Pressable onPress={() => router.replace("/auth/register")} hitSlop={8}>
                    <Text className="text-sena font-bold text-sm ml-1.5">Regístrate</Text>
                </Pressable>
            </View>

        </AuthBackground>
    );
}
