import { env, http, ENDPOINTS, unwrapList, unwrapItem } from "@/core";
import { mapAmbiente } from "./ambientes.mapper";
import { ambientesMock } from "./ambientes.mock";

export const ambientesService = {
    /** GET /ambientes?centro_id= */
    async list({ centroId } = {}) {
        if (env.isMock("ambientes")) {
            return (await ambientesMock.list(centroId ? (a) => a.centroId === centroId : undefined)).map(mapAmbiente);
        }
        return unwrapList(await http.get(ENDPOINTS.ambientes.base, { params: { centro_id: centroId } })).map(mapAmbiente);
    },
    async get(id) {
        if (env.isMock("ambientes")) return mapAmbiente(await ambientesMock.get(id));
        return mapAmbiente(unwrapItem(await http.get(ENDPOINTS.ambientes.byId(id))));
    },
};
