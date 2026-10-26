import { FlatList, RefreshControl, View } from "react-native";
import { COLORS } from "../theme/colors";
import { LoadingState, EmptyState, ErrorState } from "./States";

/**
 * Lista conectada a useResource: maneja carga, error, vacío y pull-to-refresh.
 *
 *   <ResourceList resource={resource} items={lista.items} renderItem={...} empty={{ title: "…" }} />
 */
export default function ResourceList({
    resource,
    items,
    renderItem,
    keyExtractor = (item) => String(item.id),
    empty = {},
    ListHeaderComponent,
    filtered = false,
    contentPaddingTop = 16,
}) {
    const { loading, error, refreshing, refresh, reload } = resource;
    const data = items ?? resource.data ?? [];

    let listEmpty;
    if (loading) listEmpty = <LoadingState />;
    else if (error) listEmpty = <ErrorState error={error} onRetry={reload} />;
    else if (filtered)
        listEmpty = (
            <EmptyState icon="search-outline" title="Sin coincidencias" message="Prueba con otra búsqueda o quita los filtros." />
        );
    else listEmpty = <EmptyState {...empty} />;

    return (
        <FlatList
            data={loading || error ? [] : data}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ListHeaderComponent={ListHeaderComponent}
            ListEmptyComponent={listEmpty}
            ItemSeparatorComponent={() => <View className="h-3" />}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingHorizontal: 20, paddingTop: contentPaddingTop, paddingBottom: 32, flexGrow: 1 }}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={refresh}
                    tintColor={COLORS.primary}
                    colors={[COLORS.primary]}
                />
            }
        />
    );
}
