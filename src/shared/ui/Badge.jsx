import { View, Text } from "react-native";
import { statusTone } from "../utils/status";

const TONES = {
    success: { box: "bg-green-50", dot: "bg-sena", text: "text-sena-dark" },
    warning: { box: "bg-amber-50", dot: "bg-amber-500", text: "text-amber-700" },
    danger: { box: "bg-red-50", dot: "bg-red-500", text: "text-red-600" },
    info: { box: "bg-blue-50", dot: "bg-blue-500", text: "text-blue-700" },
    neutral: { box: "bg-gray-100", dot: "bg-gray-400", text: "text-gray-600" },
};

/** Etiqueta de estado. El color sale automáticamente del texto (o de `tone`). */
export default function Badge({ label, tone }) {
    if (!label) return null;
    const t = TONES[tone ?? statusTone(label)] ?? TONES.neutral;
    return (
        <View className={`flex-row items-center self-start rounded-full px-3 py-1.5 ${t.box}`}>
            <View className={`w-1.5 h-1.5 rounded-full mr-1.5 ${t.dot}`} />
            <Text className={`text-xs font-semibold ${t.text}`}>{label}</Text>
        </View>
    );
}
