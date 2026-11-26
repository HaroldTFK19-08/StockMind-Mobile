import { alertasService } from "@/modules/alertas";
import { formatDate } from "@/shared/utils";
import { unreadStore } from "./notificaciones.store";

/**
 * El modelo no tiene tabla de notificaciones: se muestran las alertas que ya se
 * calculan desde asignaciones y préstamos. No se guarda nada nuevo.
 */
export const notificacionesService = {
    async list() {
        const alertas = await alertasService.list();
        const lista = alertas.map((alerta) => ({
            id: alerta.id,
            tipo: "alerta",
            titulo: alerta.titulo,
            mensaje: `${alerta.detalle} · límite ${formatDate(alerta.fecha)}`,
            fecha: alerta.fecha,
            leida: false,
        }));
        unreadStore.set(lista.length);
        return lista;
    },

    /** Sin tabla donde guardar el estado: solo se baja el contador en pantalla. */
    marcarLeida() {
        unreadStore.set(Math.max(0, (unreadStore.get() ?? 0) - 1));
        return Promise.resolve();
    },

    marcarTodas() {
        unreadStore.set(0);
        return Promise.resolve();
    },
};

unreadStore.setLoader(() => notificacionesService.list());
