import { useMemo } from "react";
import { View, Text, Pressable } from "react-native";
import { useResource } from "@/shared/hooks";
import { Screen, PageHero, ResourceList } from "@/shared/ui";
import PortalHeader from "@/navigation/PortalHeader";
import { notificacionesService } from "../notificaciones.service";
import { useNotificacionesAnimation } from "../hooks/useNotificacionesAnimation";
import NotificacionItem from "../components/NotificacionItem";

export default function NotificacionesScreen() {
    const resource = useResource(() => notificacionesService.list(), []);
    const lista = resource.data ?? [];
    const sinLeer = useMemo(() => lista.filter((n) => !n.leida).length, [lista]);
    const animationStyle = useNotificacionesAnimation();

    const marcar = async (n) => {
        if (n.leida) return;
        resource.setData((prev) => prev.map((x) => (x.id === n.id ? { ...x, leida: true } : x)));
        notificacionesService.marcarLeida(n.id).catch(() => resource.reload());
    };

    const marcarTodas = async () => {
        resource.setData((prev) => prev.map((x) => ({ ...x, leida: true })));
        notificacionesService.marcarTodas().catch(() => resource.reload());
    };

    return (
        <Screen animationStyle={animationStyle}>
            <PortalHeader showBack />
            <PageHero
                title="Notificaciones"
                subtitle={sinLeer ? `Tienes ${sinLeer} sin leer` : "Estás al día con tus notificaciones"}
                compact
            />
            <ResourceList
                resource={resource}
                empty={{ icon: "notifications-off-outline", title: "Sin notificaciones", message: "Aquí verás las novedades del inventario." }}
                ListHeaderComponent={
                    sinLeer ? (
                        <View className="flex-row justify-end mb-3">
                            <Pressable onPress={marcarTodas} hitSlop={8}>
                                <Text className="text-sena font-semibold">Marcar todas como leídas</Text>
                            </Pressable>
                        </View>
                    ) : null
                }
                renderItem={({ item }) => <NotificacionItem notificacion={item} onPress={() => marcar(item)} />}
            />
        </Screen>
    );
}
