const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

/**
 * Convierte "2026-02-12", "2026-02-12T10:00:00Z" o "12-02-2026" a Date.
 * Devuelve null si no se puede interpretar.
 */
export function parseDate(value) {
    if (!value) return null;
    if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
    const str = String(value);
    const dmy = /^(\d{2})[-/](\d{2})[-/](\d{4})$/.exec(str);
    if (dmy) return new Date(Number(dmy[3]), Number(dmy[2]) - 1, Number(dmy[1]));
    const ymd = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str);
    if (ymd) return new Date(Number(ymd[1]), Number(ymd[2]) - 1, Number(ymd[3]));
    const d = new Date(str);
    return Number.isNaN(d.getTime()) ? null : d;
}
/** "12 feb 2026" */
export function formatDate(value, fallback = "—") {
    const d = parseDate(value);
    if (!d) return value ? String(value) : fallback;
    return `${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}`;
}
/** "Hace 5 min", "Hace 3 h", "Ayer", o la fecha */
export function formatRelative(value) {
    const d = parseDate(value);
    if (!d) return "";
    const diffMin = Math.round((Date.now() - d.getTime()) / 60000);
    if (diffMin < 1) return "Ahora";
    if (diffMin < 60) return `Hace ${diffMin} min`;
    const diffH = Math.round(diffMin / 60);
    if (diffH < 24) return `Hace ${diffH} h`;
    if (diffH < 48) return "Ayer";
    return formatDate(d);
}
/** Fecha de hoy en formato ISO corto (AAAA-MM-DD), la que se envía al backend. */
export function todayISO() {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${mm}-${dd}`;
}
/** Normaliza cualquier fecha aceptada a AAAA-MM-DD (o null). */
export function toISODate(value) {
    const d = parseDate(value);
    if (!d) return null;
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${mm}-${dd}`;
}
export const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
