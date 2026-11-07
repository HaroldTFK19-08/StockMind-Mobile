import { serviceNotConfigured } from "@/core";
import { unreadStore } from "./notificaciones.store";

export const notificacionesService = {
    list() {
        return serviceNotConfigured("notificaciones.list");
    },
    marcarLeida() {
        return serviceNotConfigured("notificaciones.marcarLeida");
    },
    marcarTodas() {
        return serviceNotConfigured("notificaciones.marcarTodas");
    },
};

unreadStore.setLoader(() => notificacionesService.list());
