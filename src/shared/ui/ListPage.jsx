import { View } from "react-native";
import Screen from "./Screen";
import PageHero from "./PageHero";
import SearchBar from "./SearchBar";
import FilterChips from "./FilterChips";

/**
 * Plantilla de las pantallas de listado:
 * encabezado + banner + buscador flotante + filtros + lista.
 */
export default function ListPage({ header, title, subtitle, search, filters, children, animationStyle }) {
    return (
        <Screen animationStyle={animationStyle}>
            {header}
            <PageHero title={title} subtitle={subtitle} compact />
            {search ? (
                <View className="px-5 -mt-8">
                    <SearchBar {...search} />
                </View>
            ) : null}
            {filters ? <FilterChips {...filters} /> : null}
            <View className="flex-1">{children}</View>
        </Screen>
    );
}
