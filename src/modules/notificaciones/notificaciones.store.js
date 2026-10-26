import { useEffect, useState } from "react";

/**
 * Contador global de notificaciones sin leer (lo usa el ícono de campana).
 * Se actualiza cada vez que el servicio lista o marca notificaciones.
 */
let unread = null;
let loader = null;
const listeners = new Set();

export const unreadStore = {
    get: () => unread,
    set(value) {
        unread = value;
        listeners.forEach((l) => l(value));
    },
    setLoader(fn) {
        loader = fn;
    },
};

export function useUnreadCount(enabled = true) {
    const [count, setCount] = useState(unread);
    useEffect(() => {
        if (!enabled) return undefined;
        listeners.add(setCount);
        if (unread === null && loader) loader().catch(() => {});
        return () => listeners.delete(setCount);
    }, [enabled]);
    return enabled ? count : null;
}
