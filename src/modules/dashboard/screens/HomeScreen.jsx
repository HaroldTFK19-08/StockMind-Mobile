import { View, Text, ScrollView, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { Screen, PageHero, StatCard, ActionCard, SectionTitle, Card, ErrorState } from "@/shared/ui";
import { useResource } from "@/shared/hooks";
import { COLORS } from "@/shared/theme";
import { firstName } from "@/shared/utils";
import PortalHeader from "@/navigation/PortalHeader";
import { useAuth } from "@/modules/auth/AuthProvider";
import { dashboardService } from "../dashboard.service";
import { HOME_CONFIG } from "../dashboard.config";
import { useDashboardAnimation } from "../hooks/useDashboardAnimation";
import RecentItem from "../components/RecentItem";

const hoy = () =>
    new Date().toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" });
/** Inicio de cualquier rol; el contenido sale de dashboard.config.js */
export default function HomeScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const config = HOME_CONFIG[user?.rol];
    const resumen = useResource(() => dashboardService.resumen(user?.rol), [user?.rol]);
    const animationStyle = useDashboardAnimation();
    if (!config) return null;
    // Pares de tarjetas para la grilla 2xN
    const filas = [];
    for (let i = 0; i < config.stats.length; i += 2) filas.push(config.stats.slice(i, i + 2));
    return (
        <Screen animationStyle={animationStyle}>
            <PortalHeader />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 32 }}
                refreshControl={
                    <RefreshControl refreshing={resumen.refreshing} onRefresh={resumen.refresh} tintColor={COLORS.white} colors={[COLORS.primary]} />
                }
            >
                <PageHero title={`Hola, ${firstName(user?.nombre)}`} subtitle={config.subtitle}>
                    <View className="self-start bg-white/15 rounded-full px-3 py-1 mt-3">
                        <Text className="text-white text-xs font-semibold capitalize">
                            {user?.rolLabel} · {hoy()}
                        </Text>
                    </View>
                </PageHero>
                <View className="px-5 -mt-8 gap-3">
                    {filas.map((fila, i) => (
                        <View key={i} className="flex-row gap-3">
                            {fila.map((s) => (
                                <StatCard
                                    key={s.key}
                                    icon={s.icon}
                                    tone={s.tone}
                                    label={s.label}
                                    value={resumen.data?.[s.key]}
                                    loading={resumen.loading}
                                    onPress={() => router.push(s.href)}
                                />
                            ))}
                            {fila.length === 1 ? <View className="flex-1" /> : null}
                        </View>
                    ))}
                </View>
                {resumen.error ? <ErrorState error={resumen.error} onRetry={resumen.reload} /> : null}
                <View className="px-5 mt-8">
                    <SectionTitle title="Accesos rápidos" />
                    <View className="gap-3">
                        {config.actions.map((a) => (
                            <ActionCard key={a.title} {...a} onPress={() => router.push(a.href)} />
                        ))}
                    </View>
                </View>
                {resumen.data?.recientes?.length ? (
                    <View className="px-5 mt-8">
                        <SectionTitle title={config.recientes.title} actionLabel="Ver todo" onAction={() => router.push(config.recientes.href)} />
                        <Card className="py-1">
                            {resumen.data.recientes.map((item, idx) => (
                                <RecentItem key={item.id ?? idx} item={item} last={idx === resumen.data.recientes.length - 1} />
                            ))}
                        </Card>
                    </View>
                ) : null}
            </ScrollView>
        </Screen>
    );
}
