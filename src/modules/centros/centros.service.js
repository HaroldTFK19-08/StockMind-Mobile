import { env, http, ENDPOINTS, unwrapList, unwrapItem } from "@/core";
import { mapCentro, toCentroDTO } from "./centros.mapper";
import { centrosMock } from "./centros.mock";

const MOCK = () => env.isMock("centros");

/**
 * Servicio de Centros → Laravel: GET/POST /centros, GET/PUT/DELETE /centros/{id}.
 * El token Bearer se agrega solo en httpClient cuando el login también es real.
 */
export const centrosService = {
    async list() {
        if (MOCK()) return (await centrosMock.list()).map(mapCentro);
        return unwrapList(await http.get(ENDPOINTS.centros.base)).map(mapCentro);
    },

    async get(id) {
        if (MOCK()) return mapCentro(await centrosMock.get(id));
        return mapCentro(unwrapItem(await http.get(ENDPOINTS.centros.byId(id))));
    },

    async create(values) {
        const dto = toCentroDTO(values);
        if (MOCK()) return mapCentro(await centrosMock.create({ ...dto, sedes: 0, ambientes: 0 }));
        return mapCentro(unwrapItem(await http.post(ENDPOINTS.centros.base, dto)));
    },

    async update(id, values) {
        const dto = toCentroDTO(values);
        if (MOCK()) return mapCentro(await centrosMock.update(id, dto));
        return mapCentro(unwrapItem(await http.put(ENDPOINTS.centros.byId(id), dto)));
    },

    async remove(id) {
        if (MOCK()) return centrosMock.remove(id);
        await http.delete(ENDPOINTS.centros.byId(id));
        return true;
    },
};
