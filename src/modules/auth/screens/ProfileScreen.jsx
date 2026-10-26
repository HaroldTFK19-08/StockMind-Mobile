import { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Screen, Avatar, Badge, Card, InfoField, Button, BottomSheet, TextField, useToast } from "@/shared/ui";
import { useMutation } from "@/shared/hooks";
import { COLORS } from "@/shared/theme";
import { env } from "@/core";
import { useAuthAnimation } from "../hooks/useAuthAnimation";
import PortalHeader from "@/navigation/PortalHeader";
import { useAuth } from "../AuthProvider";

const valoresPerfil = (user) => ({
    nombre: user?.nombre ?? "",
    correo: user?.correo ?? "",
    telefono: user?.telefono ?? "",
});

const perfilSchema = Yup.object({
    nombre: Yup.string().trim().min(3, "Mínimo 3 caracteres").required("El nombre es obligatorio"),
    correo: Yup.string().trim().email("Ingresa un correo válido").required("El correo es obligatorio"),
    telefono: Yup.string()
        .trim()
        .matches(/^[\d\s+()-]{7,15}$/, { message: "Teléfono inválido", excludeEmptyString: true }),
});

function Opcion({ icon, label, description, onPress }) {
    return (
        <Pressable onPress={onPress} className="flex-row items-center py-3.5 active:opacity-70">
            <View className="w-10 h-10 rounded-2xl bg-sena-soft items-center justify-center">
                <Ionicons name={icon} size={19} color={COLORS.primary} />
            </View>
            <View className="flex-1 ml-3">
                <Text className="text-[15px] font-semibold text-gray-800">{label}</Text>
                {description ? <Text className="text-xs text-gray-500 mt-0.5">{description}</Text> : null}
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.gray400} />
        </Pressable>
    );
}

export default function ProfileScreen() {
    const router = useRouter();
    const { user, logout, updateProfile } = useAuth();
    const toast = useToast();
    const [confirmar, setConfirmar] = useState(false);
    const [saliendo, setSaliendo] = useState(false);
    const [editando, setEditando] = useState(false);
    const animationStyle = useAuthAnimation();
    const guardarPerfil = useMutation(updateProfile);
    const formik = useFormik({
        initialValues: valoresPerfil(user),
        enableReinitialize: true,
        validationSchema: perfilSchema,
        onSubmit: async (values, helpers) => {
            const perfil = {
                nombre: values.nombre.trim(),
                correo: values.correo.trim().toLowerCase(),
                telefono: values.telefono.trim(),
            };
            try {
                await guardarPerfil.mutate(perfil);
                helpers.resetForm({ values: perfil });
                setEditando(false);
                toast.show("Perfil actualizado correctamente");
            } catch (error) {
                toast.show(error.message, "error");
            }
        },
    });
    const abrirEditor = () => {
        formik.resetForm({ values: valoresPerfil(user) });
        setEditando(true);
    };
    const cerrarEditor = () => {
        if (guardarPerfil.loading) return;
        formik.resetForm({ values: valoresPerfil(user) });
        setEditando(false);
    };
    const salir = async () => {
        setSaliendo(true);
        await logout();
    };
    return (
        <Screen animationStyle={animationStyle}>
            <PortalHeader showBack />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
                <View className="bg-sena rounded-b-[32px] items-center pt-4 pb-14">
                    <View className="p-1.5 rounded-full bg-white/20">
                        <Avatar name={user?.nombre} size={92} variant="light" />
                    </View>
                    <Text className="text-2xl font-extrabold text-white mt-4 text-center px-6">{user?.nombre}</Text>
                    <Text className="text-green-100 mt-1">{user?.correo}</Text>
                    <Pressable
                        onPress={abrirEditor}
                        accessibilityRole="button"
                        className="flex-row items-center mt-4 rounded-xl bg-white px-4 py-2.5 active:opacity-80"
                    >
                        <Ionicons name="create-outline" size={18} color={COLORS.primary} />
                        <Text className="text-sena font-bold ml-2">Editar perfil</Text>
                    </Pressable>
                </View>

                <View className="px-5 -mt-8 gap-4">
                    <Card>
                        <Text className="text-lg font-bold text-ink mb-4">Información personal</Text>
                        <View className="gap-4">
                            <InfoField icon="shield-checkmark-outline" label="Rol">
                                <View className="mt-1">
                                    <Badge label={user?.rolLabel} tone="success" />
                                </View>
                            </InfoField>
                            {user?.documento ? <InfoField icon="card-outline" label="Documento" value={user.documento} /> : null}
                            {user?.telefono ? <InfoField icon="call-outline" label="Teléfono" value={user.telefono} /> : null}
                            {user?.programa ? <InfoField icon="school-outline" label="Programa" value={user.programa} /> : null}
                            {user?.ficha ? <InfoField icon="people-outline" label="Ficha" value={user.ficha} /> : null}
                            {user?.centro ? <InfoField icon="business-outline" label="Centro" value={user.centro} /> : null}
                        </View>
                    </Card>

                    <Card className="py-1">
                        <Opcion icon="information-circle-outline" label="Acerca de StockMind" description="Versión y créditos" onPress={() => router.push("/acerca")} />
                        <View className="h-px bg-gray-100" />
                        <Opcion
                            icon={env.usesApi ? "cloud-done-outline" : "flask-outline"}
                            label="Origen de datos"
                            description={env.usesApi ? env.apiUrl : "Datos de demostración (sin backend)"}
                            onPress={() => router.push("/acerca")}
                        />
                    </Card>

                    <Button title="Cerrar sesión" icon="log-out-outline" variant="danger" onPress={() => setConfirmar(true)} />
                </View>
            </ScrollView>

            <BottomSheet visible={confirmar} onClose={() => setConfirmar(false)} title="¿Cerrar sesión?" icon="log-out-outline">
                <Text className="text-gray-600 leading-5 mb-5">Tendrás que ingresar de nuevo con tu correo y contraseña.</Text>
                <Button title="Sí, cerrar sesión" variant="danger" loading={saliendo} onPress={salir} />
                <Button title="Cancelar" variant="ghost" className="mt-2" onPress={() => setConfirmar(false)} />
            </BottomSheet>

            <BottomSheet
                visible={editando}
                onClose={cerrarEditor}
                title="Editar perfil"
                subtitle="Actualiza tus datos de contacto"
                icon="person-outline"
                footer={
                    <>
                        <Button title="Guardar cambios" icon="save-outline" loading={guardarPerfil.loading} onPress={formik.handleSubmit} />
                        <Button title="Cancelar" variant="ghost" className="mt-2" disabled={guardarPerfil.loading} onPress={cerrarEditor} />
                    </>
                }
            >
                <TextField formik={formik} name="nombre" label="Nombre completo" icon="person-outline" placeholder="Tu nombre" autoComplete="name" />
                <TextField
                    formik={formik}
                    name="correo"
                    label="Correo electrónico"
                    icon="mail-outline"
                    placeholder="usuario@soy.sena.edu"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                />
                <TextField
                    formik={formik}
                    name="telefono"
                    label="Teléfono (opcional)"
                    icon="call-outline"
                    placeholder="Tu número de teléfono"
                    keyboardType="phone-pad"
                />
            </BottomSheet>
        </Screen>
    );
}
