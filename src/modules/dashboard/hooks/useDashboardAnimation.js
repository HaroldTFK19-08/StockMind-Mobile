import { useEntranceAnimation } from "@/shared/hooks/useEntranceAnimation";

export function useDashboardAnimation() {
    return useEntranceAnimation({ duration: 360, distance: 16 });
}
