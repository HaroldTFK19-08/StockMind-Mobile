/**
 * Usuario "logueado" en modo mock. Permite que endpoints como
 * /asignaciones/mias o /reportes/mios filtren por la persona correcta.
 */
let current = null;

export const mockSession = {
    get: () => current,
    set: (user) => {
        current = user;
    },
    clear: () => {
        current = null;
    },
};
