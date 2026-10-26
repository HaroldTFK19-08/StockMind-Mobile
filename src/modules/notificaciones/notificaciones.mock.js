import { createMockCollection } from "@/core";

const hace = (minutos) => new Date(Date.now() - minutos * 60000).toISOString();

export const notificacionesMock = createMockCollection([
    { id: "1", titulo: "Nuevo elemento", mensaje: "Se registró un nuevo elemento en el inventario.", tipo: "elemento", fecha: hace(10), leida: false },
    { id: "2", titulo: "Elemento reportado", mensaje: "El PC-Dell del Ambiente 101 fue reportado con daño.", tipo: "reporte", fecha: hace(65), leida: false },
    { id: "3", titulo: "Nuevo usuario", mensaje: "Laura Martínez se registró como aprendiz.", tipo: "usuario", fecha: hace(180), leida: false },
    { id: "4", titulo: "Traslado completado", mensaje: "El Proyector-Epson llegó al Ambiente 202.", tipo: "traslado", fecha: hace(60 * 26), leida: true },
    { id: "5", titulo: "Asignaciones por vencer", mensaje: "3 asignaciones finalizan esta semana.", tipo: "alerta", fecha: hace(60 * 50), leida: true },
]);
