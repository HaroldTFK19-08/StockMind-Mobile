import { useMemo, useState } from "react";
import { normalize } from "../utils/text";

/**
 * Búsqueda por texto + filtro por un campo (p. ej. "estado").
 *
 *   const lista = useFilteredList(data, { searchKeys: ["nombre", "categoria"], filterKey: "estado" });
 *   lista.items, lista.query, lista.setQuery, lista.filter, lista.setFilter, lista.filterOptions
 */
export function useFilteredList(items, { searchKeys = [], filterKey } = {}) {
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState(null);

    const source = items ?? [];

    const filterOptions = useMemo(() => {
        if (!filterKey) return [];
        const set = new Set(source.map((i) => i[filterKey]).filter(Boolean));
        return [...set].sort();
    }, [source, filterKey]);

    const filtered = useMemo(() => {
        const q = normalize(query);
        return source.filter((item) => {
            if (filterKey && filter && item[filterKey] !== filter) return false;
            if (!q) return true;
            return searchKeys.some((key) => normalize(item[key]).includes(q));
        });
    }, [source, query, filter, filterKey, searchKeys]);

    return { items: filtered, total: source.length, query, setQuery, filter, setFilter, filterOptions };
}
