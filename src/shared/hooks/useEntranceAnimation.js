import { useEffect, useRef } from "react";
import { Animated, Platform } from "react-native";

export function useEntranceAnimation({ duration = 280, distance = 12 } = {}) {
    const opacity = useRef(new Animated.Value(0)).current;
    const offset = useRef(new Animated.Value(distance)).current;

    useEffect(() => {
        const animation = Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration,
                useNativeDriver: Platform.OS !== "web",
            }),
            Animated.timing(offset, {
                toValue: 0,
                duration,
                useNativeDriver: Platform.OS !== "web",
            }),
        ]);

        animation.start();
        return () => animation.stop();
    }, [duration, offset, opacity]);

    return {
        opacity,
        transform: [{ translateY: offset }],
    };
}
