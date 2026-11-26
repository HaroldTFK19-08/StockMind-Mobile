import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useFormik } from "formik";
import { Ionicons } from "@expo/vector-icons";
import { Button, TextField, useToast } from "@/shared/ui";
import { COLORS } from "@/shared/theme";
import { useAuthAnimation } from "../hooks/useAuthAnimation";
import AuthBackground from "../components/AuthBackground";
import { useAuth } from "../AuthProvider";
import { datosRegistroSchema, rolesRegistroSchema } from "../validations/auth.schemas";
import { ROLES_REGISTRO } from "../roles";

function RolChip({ opcion, activo, onPress }) {
    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: activo }}
            className={`min-h-14 px-5 py-3 rounded-2xl border-[1.5px] flex-row items-center gap-2 ${
                activo ? "bg-sena-soft border-sena" : "bg-gray-50 border-gray-200"
            }`}
        >
            <Ionicons
                name={activo ? "checkmark-circle" : "ellipse-outline"}
                size={20}
                color={activo ? COLORS.primary : COLORS.gray400}
            />
            <Text className={`text-sm font-semibold ${activo ? "text-sena-dark" : "text-gray-600"}`}>
                {opcion.label}
            </Text>
        </Pressable>
    );
}

/** Registro en dos pasos: primero los datos, al final el rol en el SENA. */
export default function RegisterScreen() {
    const router = useRouter();
    const toast = useToast();
    const { register } = useAuth();
    const [paso, setPaso] = useState(1);
    const [serverError, setServerError] = useState(null);
    const animationStyle = useAuthAnimation();

    const formik = useFormik({
        initialValues: {
            nombre: "",
            documento: "",
            correo: "",
            contrasena: "",
            confirmarContrasena: "",
            roles: [],
        },
        validationSchema: paso === 1 ? datosRegistroSchema : rolesRegistroSchema,
        onSubmit: async (values) => {
            setServerError(null);
            if (paso === 1) {
                setPaso(2);
                return;
            }
            try {
                await register(values);
                router.replace("/auth/pendiente");
            } catch (error) {
                setServerError(error.message);
            }
        },
    });

    const alternarRol = (rol) => {
        const actuales = formik.values.roles;
        formik.setFieldValue(
            "roles",
            actuales.includes(rol) ? actuales.filter((r) => r !== rol) : [...actuales, rol]
        );
        formik.setFieldTouched("roles", true, false);
    };

    return (
        <AuthBackground showBrand={false} animationStyle={animationStyle}>
            <Pressable onPress={() => (paso === 1 ? router.back() : setPaso(1))} hitSlop={10} className="self-start mb-3" accessibilityLabel="Volver">
                <Ionicons name="arrow-back" size={24} color={COLORS.gray700} />
            </Pressable>
            <Text className="text-ink text-2xl font-extrabold">
                {paso === 1 ? "Crear cuenta" : "¿En el SENA eres…?"}
            </Text>
            <Text className="text-gray-500 text-[15px] mt-1 mb-5">
                {paso === 1
                    ? "Completa tus datos para empezar a usar StockMind."
                    : "Al final dinos si eres aprendiz o instructor. Podrás elegir otro rol después."}
            </Text>

            {serverError ? (
                <View className="flex-row items-center bg-red-50 border border-red-100 rounded-2xl p-3 mb-4">
                    <Ionicons name="alert-circle" size={20} color={COLORS.danger} />
                    <Text className="flex-1 text-red-600 text-sm ml-2">{serverError}</Text>
                </View>
            ) : null}

            {paso === 1 ? (
                <>
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
                </>
            ) : (
                <View className="mb-2">
                    <Text className="text-sm font-semibold text-gray-700 mb-2">Selecciona una o varias opciones</Text>
                    <View className="gap-3">
                        {ROLES_REGISTRO.map((opcion) => (
                            <RolChip
                                key={opcion.value}
                                opcion={opcion}
                                activo={formik.values.roles.includes(opcion.value)}
                                onPress={() => alternarRol(opcion.value)}
                            />
                        ))}
                    </View>
                    {formik.touched.roles && formik.errors.roles ? (
                        <Text className="text-red-500 text-xs mt-1.5 ml-1">{formik.errors.roles}</Text>
                    ) : null}
                </View>
            )}

            <Button
                title={paso === 1 ? "Continuar" : "Crear cuenta"}
                icon={paso === 1 ? "arrow-forward-outline" : "person-add-outline"}
                loading={formik.isSubmitting}
                onPress={formik.handleSubmit}
                className="mt-2"
            />

            <View className="flex-row items-center justify-center mt-5">
                <Text className="text-gray-500 text-sm">¿Ya tienes cuenta?</Text>
                <Pressable onPress={() => router.replace("/auth/login")} hitSlop={8}>
                    <Text className="text-sena font-bold text-sm ml-1.5">Inicia sesión</Text>
                </Pressable>
            </View>
        </AuthBackground>
    );
}
