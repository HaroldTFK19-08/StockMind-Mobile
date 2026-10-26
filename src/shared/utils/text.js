/** minúsculas y sin tildes, para búsquedas tolerantes */
export function normalize(value) {
    return String(value ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

export function initials(nombre = "") {
    const partes = String(nombre).trim().split(/\s+/).filter(Boolean);
    if (!partes.length) return "?";
    const [a, b] = [partes[0], partes[1]];
    return `${a[0]}${b ? b[0] : ""}`.toUpperCase();
}

export function firstName(nombre = "") {
    return String(nombre).trim().split(/\s+/)[0] ?? "";
}
