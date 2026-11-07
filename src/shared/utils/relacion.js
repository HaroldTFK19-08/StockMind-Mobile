/**
 * Ayudantes para mostrar relaciones que el backend envía cargadas (with()).
 * Laravel las envía en snake_case: originEnvironment → origin_environment.
 */

/** Nombre de una relación o "Prefijo #id" si solo vino la llave foránea. */
export function relacion(registro, rel, campoId, prefijo, campoNombre = "nombre") {
    const nombre = registro?.[rel]?.[campoNombre];
    if (nombre) return nombre;
    const id = registro?.[campoId];
    return id != null ? `${prefijo} #${id}` : null;
}

/** Nombre completo de un usuario (tabla users: nombre_1, apellido_1). */
export function nombreUsuario(u) {
    if (!u) return null;
    return [u.nombre_1, u.apellido_1].filter(Boolean).join(" ") || null;
}

/** Nombre de la persona de una relación teacher/apprentice (con .user cargado). */
export function nombrePersona(registro, rel, campoId, prefijo) {
    return nombreUsuario(registro?.[rel]?.user) ?? (registro?.[campoId] != null ? `${prefijo} #${registro[campoId]}` : null);
}

/** Nombres de los elementos de un registro (reportes y movimientos traen `elements`). */
export function nombresElementos(lista) {
    return (lista ?? []).map((e) => e.nombre).filter(Boolean).join(", ") || null;
}
