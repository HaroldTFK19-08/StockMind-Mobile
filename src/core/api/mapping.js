/**
 * Utilidades para los *.mapper.js de cada módulo.
 * Permiten aceptar varias convenciones del backend (snake_case, camelCase,
 * objetos anidados) sin llenar los componentes de "?." y "||".
 */

/** Devuelve el primer valor definido entre varias claves: pick(dto, "nombre", "name") */
export function pick(obj, ...keys) {
    if (!obj) return undefined;
    for (const key of keys) {
        const value = key.includes(".")
            ? key.split(".").reduce((acc, k) => (acc == null ? acc : acc[k]), obj)
            : obj[key];
        if (value !== undefined && value !== null && value !== "") return value;
    }
    return undefined;
}

/** Convierte a string un id que puede venir como número o no venir. */
export function toId(value) {
    return value === undefined || value === null ? undefined : String(value);
}

/** Si el backend manda una relación como objeto ({ id, nombre }) o como texto, devuelve el nombre. */
export function relName(value, ...nameKeys) {
    if (value == null) return undefined;
    if (typeof value === "object") return pick(value, ...(nameKeys.length ? nameKeys : ["nombre", "name"]));
    return String(value);
}

/** Elimina claves undefined antes de enviar un payload. */
export function compact(obj) {
    return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));
}
