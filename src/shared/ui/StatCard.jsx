import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const TONES = {
    green: { box: "bg-green-50", color: "#39A900" },
    red: { box: "bg-red-50", color: "#EF4444" },
    blue: { box: "bg-blue-50", color: "#3B82F6" },
    purple: { box: "bg-purple-50", color: "#8B5CF6" },
    amber: { box: "bg-amber-50", color: "#F59E0B" },
};

export default function StatCard({ icon, value, label, tone = "green", onPress, loading }) {
    const t = TONES[tone] ?? TONES.green;
    return (
        <Pressable
            onPress={onPress}
            disabled={!onPress}
            className="flex-1 bg-white rounded-[28px] border border-white/80 p-4 active:opacity-90"
            style={{ boxShadow: "0px 6px 18px rgba(23, 33, 23, 0.07)" }}
        >
            <View className="flex-row items-center justify-between">
                <View className={`w-11 h-11 rounded-2xl items-center justify-center ${t.box}`}>
                    <Ionicons name={icon} size={22} color={t.color} />
                </View>
                {onPress ? <Ionicons name="arrow-forward" size={16} color="#9CA3AF" /> : null}
            </View>
            {loading ? (
                <ActivityIndicator className="self-start mt-4 mb-1" color={t.color} />
            ) : (
                <Text className="text-[28px] font-extrabold text-ink mt-3">{value ?? "—"}</Text>
            )}
            <Text className="text-gray-600 text-[13px] font-medium">{label}</Text>
        </Pressable>
    );
}
