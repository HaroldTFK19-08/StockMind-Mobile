import { createContext, useCallback, useContext, useRef, useState } from "react";
import { Animated, Platform, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const ToastContext = createContext({ show: () => {} });

const TIPOS = {
    success: { icon: "checkmark-circle", color: "#39A900" },
    error: { icon: "alert-circle", color: "#EF4444" },
    info: { icon: "information-circle", color: "#3B82F6" },
};

/** Avisos flotantes que funcionan igual en Android, iOS y web. */
export function ToastProvider({ children }) {
    const insets = useSafeAreaInsets();
    const useNativeDriver = Platform.OS !== "web";
    const [toast, setToast] = useState(null);
    const opacity = useRef(new Animated.Value(0)).current;
    const timer = useRef(null);

    const show = useCallback(
        (message, type = "success") => {
            clearTimeout(timer.current);
            setToast({ message, type });
            Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver }).start();
            timer.current = setTimeout(() => {
                Animated.timing(opacity, { toValue: 0, duration: 220, useNativeDriver }).start(() => setToast(null));
            }, 2600);
        },
        [opacity, useNativeDriver]
    );

    const t = toast ? TIPOS[toast.type] ?? TIPOS.info : null;

    return (
        <ToastContext.Provider value={{ show }}>
            {children}
            {toast ? (
                <Animated.View
                    pointerEvents="none"
                    style={{
                        opacity,
                        position: "absolute",
                        left: 16,
                        right: 16,
                        top: insets.top + 10,
                        transform: [{ translateY: opacity.interpolate({ inputRange: [0, 1], outputRange: [-12, 0] }) }],
                    }}
                >
                    <View
                        className="flex-row items-center bg-ink rounded-2xl px-4 py-3.5"
                        style={{ boxShadow: "0px 8px 24px rgba(0,0,0,0.25)" }}
                    >
                        <Ionicons name={t.icon} size={22} color={t.color} />
                        <Text className="flex-1 text-white ml-3 font-medium">{toast.message}</Text>
                    </View>
                </Animated.View>
            ) : null}
        </ToastContext.Provider>
    );
}

export const useToast = () => useContext(ToastContext);
