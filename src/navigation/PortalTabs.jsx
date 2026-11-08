import { Pressable, Text, View } from "react-native";
import { Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "@/shared/theme";
import { PORTALS } from "./portals";

function PortalTabBar({ state, descriptors, navigation, portal, insets }) {
    const router = useRouter();
    const visibleNames = new Set(portal.tabs.map((tab) => tab.name));
    const visibleRoutes = state.routes.filter((route) => visibleNames.has(route.name));

    return (
        <View
            style={{
                flexDirection: "row",
                backgroundColor: COLORS.white,
                height: 66,
                paddingTop: 8,
                paddingBottom: 10,
                marginHorizontal: 16,
                marginBottom: Math.max(insets.bottom, 12),
                borderRadius: 22,
                boxShadow: "0px 6px 20px rgba(23, 33, 23, 0.12)",
            }}
        >
            {visibleRoutes.map((route) => {
                const isFocused = state.routes[state.index]?.key === route.key;
                const options = descriptors[route.key]?.options ?? {};
                const label =
                    options.title ??
                    portal.tabs.find((tab) => tab.name === route.name)?.title ??
                    route.name;
                const color = isFocused ? COLORS.primary : COLORS.gray400;

                const onPress = () => {
                    const routeNav = navigation ?? descriptors[route.key]?.navigation;
                    const event = routeNav?.emit?.({
                        type: "tabPress",
                        target: route.key,
                        canPreventDefault: true,
                    });
                    if (isFocused || event?.defaultPrevented) return;
                    if (routeNav?.navigate) {
                        routeNav.navigate(route.name, route.params);
                    } else {
                        router.navigate(`${portal.base}/${route.name}`);
                    }
                };

                return (
                    <Pressable
                        key={route.key}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
                        onPress={onPress}
                        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
                    >
                        {options.tabBarIcon
                            ? options.tabBarIcon({ color, size: 24, focused: isFocused })
                            : null}
                        <Text
                            numberOfLines={1}
                            style={{ color, fontSize: 11, fontWeight: "600", marginTop: 2 }}
                        >
                            {label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

/** Barra de pestañas flotante. Las pantallas en `hidden` siguen dentro de Tabs (barra visible) pero no aparecen como ítems. */
export default function PortalTabs({ rol, includeHidden = true }) {
    const insets = useSafeAreaInsets();
    const portal = PORTALS[rol];
    const hiddenScreens = includeHidden ? portal.hidden : [];

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                sceneStyle: { backgroundColor: COLORS.surface },
                tabBarHideOnKeyboard: true,
            }}
            tabBar={(props) => <PortalTabBar {...props} portal={portal} insets={insets} />}
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
            {hiddenScreens.map((name) => (
                <Tabs.Screen key={name} name={name} options={{ title: name }} />
            ))}
        </Tabs>
    );
}
