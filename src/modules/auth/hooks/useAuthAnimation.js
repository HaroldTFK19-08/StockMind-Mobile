import { useEntranceAnimation } from "@/shared/hooks/useEntranceAnimation";

export function useAuthAnimation() {
    return useEntranceAnimation({ duration: 320, distance: 16 });
}
