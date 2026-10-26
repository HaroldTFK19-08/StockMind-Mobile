import { createMockCollection } from "@/core";

export const ambientesMock = createMockCollection([
    { id: "1", nombre: "Ambiente 101", tipo: "Salón", centroId: "1", centro: "Centro de Comercio y Servicios", capacidad: 30, estado: "Disponible", totalElementos: 34, responsable: "Kevin Adrada" },
    { id: "2", nombre: "Ambiente 102", tipo: "Laboratorio", centroId: "1", centro: "Centro de Comercio y Servicios", capacidad: 20, estado: "En uso", totalElementos: 18, responsable: "Kevin Adrada" },
    { id: "3", nombre: "Ambiente 201", tipo: "Sala de cómputo", centroId: "2", centro: "Centro de Teleinformática y Producción Industrial", capacidad: 25, estado: "En uso", totalElementos: 27 },
    { id: "4", nombre: "Ambiente 202", tipo: "TICS", centroId: "2", centro: "Centro de Teleinformática y Producción Industrial", capacidad: 28, estado: "Disponible", totalElementos: 30 },
    { id: "5", nombre: "Laboratorio 301", tipo: "Laboratorio", centroId: "2", centro: "Centro de Teleinformática y Producción Industrial", capacidad: 20, estado: "Disponible", totalElementos: 15 },
    { id: "6", nombre: "Ambiente 402", tipo: "TICS", centroId: "1", centro: "Centro de Comercio y Servicios", capacidad: 35, estado: "En mantenimiento", totalElementos: 22 },
    { id: "7", nombre: "Cocina 501", tipo: "Cocina", centroId: "1", centro: "Centro de Comercio y Servicios", capacidad: 18, estado: "En uso", totalElementos: 40 },
    { id: "8", nombre: "Taller 601", tipo: "Taller", centroId: "3", centro: "Centro Agropecuario", capacidad: 22, estado: "Disponible", totalElementos: 19 },
]);
