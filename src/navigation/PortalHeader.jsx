import { useState } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { IconButton, Avatar } from "@/shared/ui";
import { LOGO_BLANCO } from "@/shared/theme";
import { useAuth } from "@/modules/auth/AuthProvider";
import { useUnreadCount } from "@/modules/notificaciones/notificaciones.store";
import "@/modules/notificaciones/notificaciones.service"; // registra el cargador del contador
import { PORTALS, profileOf, homeOf } from "./portals";
import SideMenu from "./SideMenu";

/** Barra superior común a todos los portales. */
export default function PortalHeader({ showBack = false }) {
    const router = useRouter();
    const { user } = useAuth();
    const [menu, setMenu] = useState(false);
    const portal = PORTALS[user?.rol];
    const unread = useUnreadCount(Boolean(portal?.notifications));

    return (
        <>
            <View className="h-16 flex-row items-center justify-between bg-sena px-5">
                <View className="flex-row items-center">
                    {showBack ? (
                        <IconButton icon="arrow-back" variant="translucent" size={40} label="Volver" onPress={() => (router.canGoBack() ? router.back() : router.replace(homeOf(user?.rol)))} />
                    ) : (
                        <IconButton icon="menu" variant="translucent" size={40} label="Abrir menú" onPress={() => setMenu(true)} />
                    )}
                    <Image source={LOGO_BLANCO} resizeMode="contain" style={{ width: 26, height: 26, marginLeft: 12 }} />
                    <Text className="ml-2 text-xl font-extrabold text-white">StockMind</Text>
                </View>
                <View className="flex-row items-center gap-2">
                    {portal?.notifications ? (
                        <IconButton
                            icon="notifications-outline"
                            variant="translucent"
                            size={40}
                            label="Notificaciones"
                            badge={unread}
                            onPress={() => router.push(portal.notifications)}
                        />
                    ) : null}
                    <Pressable onPress={() => router.push(profileOf(user?.rol))} accessibilityLabel="Mi perfil" hitSlop={6}>
                        <Avatar name={user?.nombre} size={38} variant="light" />
                    </Pressable>
                </View>
            </View>
            <SideMenu visible={menu} onClose={() => setMenu(false)} />
        </>
    );
}
