import { useResource } from "./useResource";
import { useMutation } from "./useMutation";

/**
 * Hook base para cualquier service con list / create / update / remove.
 * Carga la lista al montar y mantiene la lista local al día después de
 * crear, editar o eliminar (sin volver a pedir todo al servidor).
 *
 *   const sedes = useCrud(sedesService);
 *   sedes.data            → arreglo cargado
 *   sedes.loading/error   → estado de la carga
 *   await sedes.crear.mutate(values)
 *   await sedes.actualizar.mutate(id, values)
 *   await sedes.eliminar.mutate(id)
 */
export function useCrud(service, { params, enabled = true } = {}) {
    const resource = useResource(() => service.list(params), [JSON.stringify(params ?? {})], { enabled });

    // --- Ayudantes para modificar la lista local ---
    const agregar = (item) => resource.setData((prev) => [item, ...(prev ?? [])]);
    const reemplazar = (item) =>
        resource.setData((prev) => (prev ?? []).map((x) => (x.id === item.id ? item : x)));
    const quitar = (id) => resource.setData((prev) => (prev ?? []).filter((x) => x.id !== id));
    /** Si ya existe lo reemplaza, si no lo agrega al inicio. */
    const guardar = (item) =>
        (resource.data ?? []).some((x) => x.id === item.id) ? reemplazar(item) : agregar(item);

    // --- Operaciones contra la API ---
    const crear = useMutation(async (values) => {
        const nuevo = await service.create(values);
        agregar(nuevo);
        return nuevo;
    });

    const actualizar = useMutation(async (id, values) => {
        const actualizado = await service.update(id, values);
        reemplazar(actualizado);
        return actualizado;
    });

    const eliminar = useMutation(async (id) => {
        await service.remove(id);
        quitar(id);
        return id;
    });

    return { ...resource, agregar, reemplazar, quitar, guardar, crear, actualizar, eliminar };
}
