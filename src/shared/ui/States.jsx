import { View, Text, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../theme/colors";
import Button from "./Button";

export function LoadingState({ message = "Cargando…" }) {
    return (
        <View className="items-center justify-center py-16">
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text className="text-gray-600 mt-4 text-sm font-medium">{message}</Text>
        </View>
    );
}

export function EmptyState({ icon = "file-tray-outline", title = "Sin registros", message, action }) {
    return (
        <View className="items-center justify-center py-14 px-8">
            <View className="w-20 h-20 rounded-[28px] bg-sena-soft items-center justify-center">
                <Ionicons name={icon} size={36} color={COLORS.primary} />
            </View>
            <Text className="text-lg font-bold text-ink mt-5 text-center">{title}</Text>
            {message ? <Text className="text-gray-500 text-center mt-2 leading-5">{message}</Text> : null}
            {action ? <View className="mt-5 self-stretch">{action}</View> : null}
        </View>
    );
}

export function ErrorState({ error, onRetry }) {
    const offline = error?.isNetworkError;
    return (
        <View className="items-center justify-center py-14 px-8">
            <View className="w-20 h-20 rounded-[28px] bg-red-50 items-center justify-center">
                <Ionicons name={offline ? "cloud-offline-outline" : "warning-outline"} size={36} color={COLORS.danger} />
            </View>
            <Text className="text-lg font-bold text-ink mt-5 text-center">
                {offline ? "Sin conexión" : "Algo salió mal"}
            </Text>
            <Text className="text-gray-500 text-center mt-2 leading-5">
                {error?.message ?? "No fue posible cargar la información."}
            </Text>
            {onRetry ? (
                <View className="mt-5 self-stretch">
                    <Button title="Reintentar" icon="refresh" variant="soft" onPress={onRetry} />
                </View>
            ) : null}
        </View>
    );
}
