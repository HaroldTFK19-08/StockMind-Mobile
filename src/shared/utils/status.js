import { normalize } from "./text";

/**
 * Traduce cualquier estado de negocio a un "tono" visual.
 * Así un estado nuevo del backend se ve bien sin tocar componentes.
 */
const REGLAS = [
    { tone: "danger", palabras: ["danado", "perdida", "baja", "rechaz", "vencid", "cancel", "inactiv"] },
    { tone: "warning", palabras: ["pendiente", "mantenimiento", "investigacion", "en transito", "por vencer"] },
    { tone: "info", palabras: ["proceso", "revision", "en uso", "asignado", "program"] },
    { tone: "success", palabras: ["disponible", "nuevo", "activ", "atendido", "resuelt", "entregado", "complet", "bueno"] },
];

export function statusTone(estado) {
    const valor = normalize(estado);
    for (const { tone, palabras } of REGLAS) {
        if (palabras.some((p) => valor.includes(p))) return tone;
    }
    return "neutral";
}
