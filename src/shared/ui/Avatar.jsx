import { View, Text } from "react-native";
import { initials } from "../utils/text";

export default function Avatar({ name, size = 48, variant = "solid" }) {
    const solid = variant === "solid";
    return (
        <View
            style={{ width: size, height: size, borderRadius: size / 2 }}
            className={`items-center justify-center ${solid ? "bg-sena" : "bg-white"}`}
        >
            <Text style={{ fontSize: size * 0.36 }} className={`font-bold ${solid ? "text-white" : "text-sena"}`}>
                {initials(name)}
            </Text>
        </View>
    );
}
