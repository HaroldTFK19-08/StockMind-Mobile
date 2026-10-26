import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Carga datos asíncronos (normalmente un método de un *.service.js).
 *
 *   const { data, loading, error, refresh } = useResource(() => elementosService.list(), []);
 *
 * - loading:    primera carga
 * - refreshing: recarga manual (pull-to-refresh)
 * - refresh():  vuelve a pedir los datos
 * - setData():  actualización optimista local
 */
export function useResource(fetcher, deps = [], { enabled = true, initialData = null } = {}) {
    const [data, setData] = useState(initialData);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(enabled);
    const [refreshing, setRefreshing] = useState(false);
    const mounted = useRef(true);
    const fetcherRef = useRef(fetcher);
    fetcherRef.current = fetcher;

    const run = useCallback(async (mode = "load") => {
        if (mode === "refresh") setRefreshing(true);
        else setLoading(true);
        setError(null);
        try {
            const result = await fetcherRef.current();
            if (mounted.current) setData(result);
            return result;
        } catch (err) {
            if (mounted.current) setError(err);
            return undefined;
        } finally {
            if (mounted.current) {
                setLoading(false);
                setRefreshing(false);
            }
        }
    }, []);

    useEffect(() => {
        mounted.current = true;
        if (enabled) run("load");
        return () => {
            mounted.current = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled, ...deps]);

    return {
        data,
        setData,
        error,
        loading,
        refreshing,
        reload: () => run("load"),
        refresh: () => run("refresh"),
    };
}
