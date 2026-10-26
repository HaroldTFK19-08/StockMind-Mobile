import { useCallback, useState } from "react";

/**
 * Envuelve una operación de escritura (crear, actualizar, eliminar).
 *
 *   const crear = useMutation(elementosService.create);
 *   await crear.mutate(values);   // lanza el error para que el formulario lo muestre
 */
export function useMutation(action) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const mutate = useCallback(
        async (...args) => {
            setLoading(true);
            setError(null);
            try {
                return await action(...args);
            } catch (err) {
                setError(err);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [action]
    );

    return { mutate, loading, error, reset: () => setError(null) };
}
