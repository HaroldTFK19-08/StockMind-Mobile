import { View, Text, Image, ScrollView } from "react-native";
import Constants from "expo-constants";
import { Screen, Card, InfoField } from "@/shared/ui";
import { LOGO_COLOR } from "@/shared/theme";
import { env } from "@/core";
import { useAuthAnimation } from "../hooks/useAuthAnimation";
import PortalHeader from "@/navigation/PortalHeader";

export default function AboutScreen() {
    const version = Constants.expoConfig?.version ?? "1.0.0";
    const animationStyle = useAuthAnimation();
    return (
        <Screen animationStyle={animationStyle}>
            <PortalHeader showBack />
            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
                <View className="items-center my-6">
                    <View className="w-24 h-24 rounded-3xl bg-white items-center justify-center" style={{ boxShadow: "0px 8px 24px rgba(0,0,0,0.08)" }}>
                        <Image source={LOGO_COLOR} style={{ width: 60, height: 60 }} resizeMode="contain" />
                    </View>
                    <Text className="text-2xl font-extrabold text-ink mt-4">StockMind</Text>
                    <Text className="text-gray-500 mt-1">Versión {version}</Text>
                </View>
                <Card>
                    <Text className="text-gray-700 leading-6">
                        StockMind es la herramienta del SENA para gestionar el inventario de los centros de formación: elementos,
                        ambientes, asignaciones a aprendices, traslados y reportes de novedades.
                    </Text>
                </Card>
                <Card className="mt-4 gap-4">
                    <InfoField icon="server-outline" label="Origen de datos" value={!env.usesApi ? "Demostración (mocks en memoria)" : env.useMocks ? `Mixto · API: ${env.apiModules.join(", ")}` : "Servidor"} />
                    {env.usesApi ? <InfoField icon="link-outline" label="API" value={env.apiUrl} /> : null}
                    <InfoField icon="location-outline" label="Regional" value="Cauca · Popayán" />
                </Card>
            </ScrollView>
        </Screen>
    );
}
