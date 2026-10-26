import { Modal, View, Text, Pressable, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../theme/colors";

/** Hoja modal que sube desde abajo. Se usa para formularios y detalles. */
export default function BottomSheet({ visible, onClose, title, subtitle, icon, children, footer }) {
    const insets = useSafeAreaInsets();
    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                className="flex-1 justify-end bg-black/50"
            >
                <Pressable className="absolute inset-0" onPress={onClose} accessibilityLabel="Cerrar" />
                <View className="bg-white rounded-t-[36px] max-h-[92%]" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
                    <View className="items-center pt-3">
                        <View className="w-10 h-1.5 rounded-full bg-gray-200" />
                    </View>
                    <View className="flex-row items-center px-5 pt-3 pb-4 border-b border-gray-100">
                        {icon ? (
                            <View className="w-11 h-11 rounded-2xl bg-sena-soft items-center justify-center mr-3">
                                <Ionicons name={icon} size={22} color={COLORS.primary} />
                            </View>
                        ) : null}
                        <View className="flex-1 pr-3">
                            <Text className="text-xl font-extrabold text-ink" numberOfLines={2}>
                                {title}
                            </Text>
                            {subtitle ? <Text className="text-sm text-gray-500 mt-0.5">{subtitle}</Text> : null}
                        </View>
                        <Pressable
                            onPress={onClose}
                            hitSlop={10}
                            accessibilityLabel="Cerrar"
                            className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center"
                        >
                            <Ionicons name="close" size={20} color={COLORS.gray500} />
                        </Pressable>
                    </View>
                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 18, paddingBottom: 8 }}
                    >
                        {children}
                    </ScrollView>
                    {footer ? <View className="px-5 pt-3">{footer}</View> : null}
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}
