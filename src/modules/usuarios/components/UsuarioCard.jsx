import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, Avatar, Badge } from "@/shared/ui";

export default function UsuarioCard({ usuario, onPress }) {
    return (
        <Card onPress={onPress}>
            <View className="flex-row items-center">
                <Avatar name={usuario.nombre} size={50} />
                <View className="flex-1 ml-3.5">
                    <Text className="text-base font-bold text-gray-900" numberOfLines={1}>
                        {usuario.nombre}
                    </Text>
                    <Text className="text-sm text-gray-500 mt-0.5" numberOfLines={1}>
                        {usuario.correo}
                    </Text>
                    <View className="flex-row items-center mt-2 gap-2">
                        <Badge label={usuario.rolLabel} tone="info" />
                        {usuario.estado !== "Activo" ? <Badge label={usuario.estado} /> : null}
                    </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </View>
        </Card>
    );
}
