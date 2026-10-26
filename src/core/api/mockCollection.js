import { env } from "../config/env";
import { ApiError } from "./ApiError";

export const mockDelay = (ms = env.mockLatency) => new Promise((r) => setTimeout(r, ms));
const clone = (value) => JSON.parse(JSON.stringify(value));

/**
 * "Tabla" en memoria que imita un CRUD REST. Solo se usa con
 * EXPO_PUBLIC_USE_MOCKS=true, para trabajar la app sin backend.
 */
export function createMockCollection(seed = []) {
    let rows = clone(seed);
    let nextId = rows.reduce((max, r) => Math.max(max, Number(r.id) || 0), 0) + 1;

    return {
        async list(predicate) {
            await mockDelay();
            return clone(predicate ? rows.filter(predicate) : rows);
        },
        async get(id) {
            await mockDelay();
            const row = rows.find((r) => String(r.id) === String(id));
            if (!row) throw new ApiError("Registro no encontrado.", { status: 404 });
            return clone(row);
        },
        async create(data) {
            await mockDelay();
            const row = { ...data, id: String(nextId++) };
            rows = [row, ...rows];
            return clone(row);
        },
        async update(id, data) {
            await mockDelay();
            let updated = null;
            rows = rows.map((r) => {
                if (String(r.id) !== String(id)) return r;
                updated = { ...r, ...data };
                return updated;
            });
            if (!updated) throw new ApiError("Registro no encontrado.", { status: 404 });
            return clone(updated);
        },
        async remove(id) {
            await mockDelay();
            rows = rows.filter((r) => String(r.id) !== String(id));
            return true;
        },
        /** Lectura síncrona (para calcular resúmenes en modo mock). */
        snapshot() {
            return clone(rows);
        },
    };
}
