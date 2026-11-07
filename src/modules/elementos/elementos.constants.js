// Valores exactos del enum `estado` de la tabla elements
export const ELEMENTO_ESTADOS = ["disponible", "asignado", "prestado", "en traslado", "en mantenimiento", "dado de baja"];

// "asignado" y "prestado" solo los pone el backend (desde asignaciones y préstamos)
export const ESTADOS_MANUALES = ["disponible", "en traslado", "en mantenimiento", "dado de baja"];

// Valores del enum `condicion`
export const ELEMENTO_CONDICIONES = ["bueno", "regular", "malo"];

// Ícono según el nombre de la categoría (si no coincide se usa un cubo)
export const CATEGORIA_ICONOS = {
    "Tecnología": "laptop-outline",
    Mobiliario: "bed-outline",
    Oficina: "briefcase-outline",
    Herramienta: "hammer-outline",
    Laboratorio: "flask-outline",
};
