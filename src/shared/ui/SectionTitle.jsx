import { View, Text, Pressable } from "react-native";

export default function SectionTitle({ title, actionLabel, onAction }) {
    return (
        <View className="flex-row items-center justify-between mb-3">
            <Text className="text-xl font-bold tracking-tight text-ink">{title}</Text>
            {actionLabel ? (
                <Pressable onPress={onAction} hitSlop={8}>
                    <Text className="text-sena-dark font-semibold">{actionLabel}</Text>
                </Pressable>
            ) : null}
        </View>
    );
}
