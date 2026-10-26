import { env, http, ENDPOINTS, unwrapList } from "@/core";
import { mapNotificacion } from "./notificaciones.mapper";
import { notificacionesMock } from "./notificaciones.mock";
import { unreadStore } from "./notificaciones.store";

const sync = (list) => {
    unreadStore.set(list.filter((n) => !n.leida).length);
    return list;
};

export const notificacionesService = {
    /** GET /notificaciones */
    async list() {
        const rows = env.isMock("notificaciones")
            ? await notificacionesMock.list()
            : unwrapList(await http.get(ENDPOINTS.notificaciones.base));
        const list = rows.map(mapNotificacion).sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)));
        return sync(list);
    },

    /** PATCH /notificaciones/:id/leida */
    async marcarLeida(id) {
        if (env.isMock("notificaciones")) await notificacionesMock.update(id, { leida: true });
        else await http.patch(ENDPOINTS.notificaciones.marcarLeida(id));
        const actual = unreadStore.get();
        if (actual) unreadStore.set(actual - 1);
    },

    /** PATCH /notificaciones/leer-todas */
    async marcarTodas() {
        if (env.isMock("notificaciones")) {
            const rows = await notificacionesMock.list((n) => !n.leida);
            await Promise.all(rows.map((n) => notificacionesMock.update(n.id, { leida: true })));
        } else {
            await http.patch(ENDPOINTS.notificaciones.marcarTodas);
        }
        unreadStore.set(0);
    },
};

unreadStore.setLoader(() => notificacionesService.list());
