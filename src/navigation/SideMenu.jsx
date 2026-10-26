import { Modal, View, Text, Pressable, Image } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Avatar, Badge } from "@/shared/ui";
import { COLORS, LOGO_BLANCO } from "@/shared/theme";
import { useAuth } from "@/modules/auth/AuthProvider";
import { PORTALS, profileOf } from "./portals";

function MenuItem({ icon, label, description, onPress, danger }) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center rounded-2xl px-3 py-3 mb-1 active:bg-sena-soft/60"
    >
      <View
        className={`w-10 h-10 rounded-xl items-center justify-center ${danger ? "bg-red-50" : "bg-sena-soft"}`}
      >
        <Ionicons
          name={icon}
          size={20}
          color={danger ? COLORS.danger : COLORS.primary}
        />
      </View>
      <View className="flex-1 ml-3">
        <Text
          className={`font-semibold text-[14px] ${danger ? "text-red-500" : "text-gray-800"}`}
        >
          {label}
        </Text>
        {description ? (
          <Text className="text-gray-500 text-xs mt-0.5">{description}</Text>
        ) : null}
      </View>
      {!danger ? (
        <Ionicons name="chevron-forward" size={17} color={COLORS.gray400} />
      ) : null}
    </Pressable>
  );
}

export default function SideMenu({ visible, onClose }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const portal = PORTALS[user?.rol];
  const ir = (href) => {
    onClose();
    router.push(href);
  };
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <SafeAreaProvider>
        <SafeAreaView
          edges={["top"]}
          className="flex-1 flex-row bg-transparent"
        >
          <View className="w-[80%] max-w-[340px] h-full bg-white">
            <View className="bg-sena px-5 pt-4 pb-5">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-2xl items-center justify-center bg-white/15">
                    <Image
                      source={LOGO_BLANCO}
                      style={{ width: 25, height: 25 }}
                      resizeMode="contain"
                    />
                  </View>
                  <Text className="text-xl font-extrabold text-white ml-2">
                    StockMind
                  </Text>
                </View>
                <Pressable
                  onPress={onClose}
                  hitSlop={10}
                  accessibilityRole="button"
                  accessibilityLabel="Cerrar menú"
                  className="w-10 h-10 items-center justify-center rounded-full bg-white/15 active:bg-white/25"
                >
                  <Ionicons name="close" size={22} color={COLORS.white} />
                </Pressable>
              </View>
              <View className="flex-row items-center mt-5 rounded-2xl bg-white/10 px-3 py-3">
                <View className="rounded-full border-2 border-white/40 p-0.5">
                  <Avatar name={user?.nombre} size={42} variant="light" />
                </View>
                <View className="flex-1 ml-3">
                  <Text
                    className="text-white font-bold text-[15px]"
                    numberOfLines={1}
                  >
                    {user?.nombre}
                  </Text>
                  <Text
                    className="text-green-100 text-xs mt-0.5"
                    numberOfLines={1}
                  >
                    {user?.correo}
                  </Text>
                </View>
              </View>
            </View>
            <View className="flex-1 px-3 pt-4">
              <MenuItem
                icon="person-circle-outline"
                label="Mi perfil"
                description={user?.rolLabel}
                onPress={() => ir(profileOf(user?.rol))}
              />
              {portal?.menu.map((item) => (
                <MenuItem
                  key={item.href}
                  {...item}
                  onPress={() => ir(item.href)}
                />
              ))}
              <MenuItem
                icon="information-circle-outline"
                label="Acerca de StockMind"
                description="Versión e información"
                onPress={() => ir("/acerca")}
              />
            </View>
            <SafeAreaView edges={["bottom"]} className="bg-white">
              <View className="px-3 border-t border-gray-100 pt-2 pb-2">
                <MenuItem
                  icon="log-out-outline"
                  label="Cerrar sesión"
                  danger
                  onPress={() => {
                    onClose();
                    logout();
                  }}
                />
                <View className="items-center mt-1">
                  <Badge label="SENA · Regional Cauca" tone="neutral" />
                </View>
              </View>
            </SafeAreaView>
          </View>
          <Pressable
            className="flex-1 bg-black/40"
            onPress={onClose}
            accessibilityLabel="Cerrar menú"
          />
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
}
