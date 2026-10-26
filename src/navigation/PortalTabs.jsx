import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "@/shared/theme";
import { PORTALS } from "./portals";

/** Barra de pestañas flotante, generada a partir de la configuración del portal. */
export default function PortalTabs({ rol }) {
    const insets = useSafeAreaInsets();
    const portal = PORTALS[rol];

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                sceneStyle: { backgroundColor: COLORS.surface },
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.gray400,
                tabBarHideOnKeyboard: true,
                tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
                tabBarStyle: {
                    backgroundColor: COLORS.white,
                    height: 66,
                    paddingTop: 8,
                    paddingBottom: 10,
                    marginHorizontal: 16,
                    marginBottom: Math.max(insets.bottom, 12),
                    borderRadius: 22,
                    borderTopWidth: 0,
                    boxShadow: "0px 6px 20px rgba(23, 33, 23, 0.12)",
                },
            }}
        >
            {portal.tabs.map((tab) => (
                <Tabs.Screen
                    key={tab.name}
                    name={tab.name}
                    options={{
                        title: tab.title,
                        tabBarIcon: ({ color, size, focused }) => (
                            <Ionicons name={focused ? tab.icon : `${tab.icon}-outline`} size={size} color={color} />
                        ),
                    }}
                />
            ))}
            {portal.hidden.map((name) => (
                <Tabs.Screen key={name} name={name} options={{ href: null }} />
            ))}
        </Tabs>
    );
}
