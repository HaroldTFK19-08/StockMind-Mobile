import { ScrollView, Pressable, Text } from "react-native";

/** Fila horizontal de filtros. `null` = "Todos". */
export default function FilterChips({ options = [], value, onChange, allLabel = "Todos" }) {
    if (!options.length) return null;
    const items = [{ label: allLabel, value: null }, ...options.map((o) => ({ label: o, value: o }))];
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
            className="mt-5"
            style={{ flexGrow: 0 }}
        >
            {items.map((item) => {
                const active = value === item.value;
                return (
                    <Pressable
                        key={item.label}
                        onPress={() => onChange(item.value)}
                        accessibilityRole="tab"
                        accessibilityState={{ selected: active }}
                        className={`min-h-10 px-4 py-2 rounded-full border ${
                            active ? "bg-sena border-sena" : "bg-white border-gray-200"
                        }`}
                    >
                        <Text className={`text-[13px] font-semibold ${active ? "text-white" : "text-gray-600"}`}>
                            {item.label}
                        </Text>
                    </Pressable>
                );
            })}
        </ScrollView>
    );
}
