import "../global.css";
import { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ToastProvider, BrandSplash } from "@/shared/ui";
import { AuthProvider, useAuth } from "@/modules/auth";
import { homeOf } from "@/navigation/portals";

SplashScreen.preventAutoHideAsync().catch(() => {});

/**
 * Control de acceso y redirección según estado de autenticación.
 * Evita el error 'GO_BACK was not handled' redirigiendo limpiamente
 * con replace() cuando se intenta acceder a una ruta sin permisos.
 */
function useProtectedRoute(user, ready) {
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        // No se navega hasta que el <Stack> está montado (si no: "navigate before mounting").
        if (!ready) return;

        const firstSegment = segments[0];
        const inAuthGroup = firstSegment === "auth";
        const enRaiz = firstSegment === undefined || firstSegment === "index";

        if (!user && !inAuthGroup && !enRaiz) {
            // Usuario no autenticado intentando entrar a ruta privada
            router.replace("/auth/inicio");
        } else if (user && inAuthGroup) {
            // Usuario ya autenticado en pantalla de login/registro
            router.replace(homeOf(user.rol));
        }
    }, [user, ready, segments, router]);
}

function RootNavigator() {
    const { status, user } = useAuth();
    const [splashListo, setSplashListo] = useState(false);

    const ready = status !== "restoring" && splashListo;
    useProtectedRoute(user, ready);

    useEffect(() => {
        SplashScreen.hideAsync().catch(() => {});
        const t = setTimeout(() => setSplashListo(true), 600);
        return () => clearTimeout(t);
    }, []);

    if (!ready) {
        return <BrandSplash />;
    }

    return (
        <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="auth" />
            <Stack.Screen name="admin" />
            <Stack.Screen name="instructor" />
            <Stack.Screen name="cuentaDante" />
            <Stack.Screen name="aprendiz" />
            <Stack.Screen name="acerca" options={{ animation: "slide_from_right" }} />
        </Stack>
    );
}

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <AuthProvider>
                <ToastProvider>
                    <StatusBar style="light" />
                    <RootNavigator />
                </ToastProvider>
            </AuthProvider>
        </SafeAreaProvider>
    );
}
