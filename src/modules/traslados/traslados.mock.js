import { createMockCollection } from "@/core";

export const trasladosMock = createMockCollection([
    { id: "1", elementoId: "10", elemento: "Proyector Epson", placa: "SENA-TEC-0060", origen: "Ambiente 101", destino: "Ambiente 202", fechaSalida: "2026-08-25", fechaLlegada: "2026-08-26", estado: "Entregado", motivo: "Apoyo a clase de multimedia", responsable: "Kevin Adrada" },
    { id: "2", elementoId: "11", elemento: "Impresora HP LaserJet", placa: "SENA-TEC-0071", origen: "Ambiente 402", destino: "Ambiente 102", fechaSalida: "2026-09-02", fechaLlegada: "2026-09-03", estado: "Entregado", motivo: "Reubicación administrativa", responsable: "Kevin Adrada" },
    { id: "3", elementoId: "14", elemento: "Portátil Dell Latitude", placa: "SENA-TEC-0080", origen: "Ambiente 202", destino: "Ambiente 201", fechaSalida: "2026-09-28", fechaLlegada: "2026-10-01", estado: "En tránsito", motivo: "Préstamo temporal", responsable: "Kevin Adrada" },
    { id: "4", elementoId: "13", elemento: "Taladro percutor", placa: "SENA-HER-0020", origen: "Ambiente 101", destino: "Taller 601", fechaSalida: "2026-10-06", fechaLlegada: "2026-10-07", estado: "Programado", motivo: "Práctica de construcción", responsable: "Kevin Adrada" },
]);
