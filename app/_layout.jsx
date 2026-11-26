import "../global.css";
import { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ToastProvider, BrandSplash } from "@/shared/ui";
import { AuthProvider, useAuth, usuarioPendiente, rolActivo } from "@/modules/auth";
import { homeOf, portalDelSegmento, PORTALS } from "@/navigation/portals";

SplashScreen.preventAutoHideAsync().catch(() => {});

/**
 * Control de acceso y redirección según el estado de la sesión.
 * Un usuario con roles pendientes NO puede entrar a ningún portal.
 * Si tiene varios roles aprobados, solo entra al portal del rol activo.
 */
function useProtectedRoute(user, ready) {
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (!ready) return;

        const firstSegment = segments[0];
        const inAuthGroup = firstSegment === "auth";
        const enEspera = inAuthGroup && segments[1] === "pendiente";
        const enRaiz = firstSegment === undefined || firstSegment === "index";
        const pendiente = usuarioPendiente(user);
        const rol = rolActivo(user);

        if (!user && !inAuthGroup && !enRaiz) {
            router.replace("/auth/inicio");
        } else if (user && pendiente && !enEspera) {
            router.replace("/auth/pendiente");
        } else if (user && !pendiente && (inAuthGroup || enEspera)) {
            router.replace(homeOf(rol));
        } else if (user && !pendiente) {
            const portalVisitado = portalDelSegmento(firstSegment);
            if (portalVisitado && portalVisitado.base !== PORTALS[rol]?.base) {
                router.replace(homeOf(rol));
            }
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
