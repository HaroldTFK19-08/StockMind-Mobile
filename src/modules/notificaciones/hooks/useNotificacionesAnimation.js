import { useEntranceAnimation } from "@/shared/hooks/useEntranceAnimation";

export function useNotificacionesAnimation() {
    return useEntranceAnimation({ duration: 300, distance: 12 });
}
