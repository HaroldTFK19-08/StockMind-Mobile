import { normalize } from "./text";

/**
 * Traduce cualquier estado de negocio a un "tono" visual.
 * Así un estado nuevo se ve bien sin tocar componentes.
 */
const REGLAS = [
    { tone: "danger", palabras: ["danado", "dano", "perdida", "baja", "rechaz", "vencid", "cancel", "inactiv"] },
    { tone: "warning", palabras: ["pendiente", "mantenimiento", "investigacion", "en transito", "en traslado", "por vencer"] },
    { tone: "info", palabras: ["proceso", "revision", "en uso", "asignado", "prestado", "aprobado", "program"] },
    { tone: "success", palabras: ["disponible", "nuevo", "activ", "atendido", "resuelt", "entregado", "complet", "devuelt", "bueno"] },
];

export function statusTone(estado) {
    const valor = normalize(estado);
    for (const { tone, palabras } of REGLAS) {
        if (palabras.some((p) => valor.includes(p))) return tone;
    }
    return "neutral";
}

/** "en_revision" → "En revision", "dado de baja" → "Dado de baja" */
export function etiquetaEstado(estado) {
    const texto = String(estado ?? "").replace(/_/g, " ").trim();
    return texto ? texto[0].toUpperCase() + texto.slice(1) : "";
}

/** Opciones para ChipSelect mostrando el texto bonito pero enviando el valor real. */
export const opcionesDe = (valores) => valores.map((v) => ({ label: etiquetaEstado(v), value: v }));
