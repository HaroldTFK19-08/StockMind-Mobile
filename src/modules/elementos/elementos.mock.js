import { createMockCollection } from "@/core";

export const elementosMock = createMockCollection([
    { id: "1", nombre: "Laptop HP ProBook", placa: "SENA-TEC-0001", categoria: "Tecnología", estado: "Disponible", marca: "HP", descripcion: "Laptop nueva, lista para asignarse.", ambienteId: "3", ambiente: "Ambiente 201" },
    { id: "2", nombre: "Televisor LG 55\"", placa: "SENA-TEC-0002", categoria: "Tecnología", estado: "En uso", marca: "LG", descripcion: "Televisor del ambiente de formación.", ambienteId: "1", ambiente: "Ambiente 101" },
    { id: "3", nombre: "Silla de oficina", placa: "SENA-MOB-0114", categoria: "Mobiliario", estado: "En uso", descripcion: "Silla ergonómica en buen estado.", ambienteId: "1", ambiente: "Ambiente 101" },
    { id: "4", nombre: "PC Dell OptiPlex", placa: "SENA-TEC-0031", categoria: "Tecnología", estado: "En uso", marca: "Dell", descripcion: "Equipo de escritorio con monitor.", ambienteId: "1", ambiente: "Ambiente 101" },
    { id: "5", nombre: "Monitor Samsung 24\"", placa: "SENA-TEC-0032", categoria: "Tecnología", estado: "En uso", marca: "Samsung", descripcion: "Monitor Full HD.", ambienteId: "1", ambiente: "Ambiente 101" },
    { id: "6", nombre: "Teclado Logitech", placa: "SENA-TEC-0033", categoria: "Tecnología", estado: "Dañado", marca: "Logitech", descripcion: "Algunas teclas no responden.", ambienteId: "1", ambiente: "Ambiente 101" },
    { id: "7", nombre: "Mouse Logitech", placa: "SENA-TEC-0034", categoria: "Tecnología", estado: "En uso", marca: "Logitech", descripcion: "Mouse óptico USB.", ambienteId: "1", ambiente: "Ambiente 101" },
    { id: "8", nombre: "Portátil Lenovo ThinkPad", placa: "SENA-TEC-0045", categoria: "Tecnología", estado: "En uso", marca: "Lenovo", descripcion: "Portátil para prácticas de redes.", ambienteId: "4", ambiente: "Ambiente 202" },
    { id: "9", nombre: "Tablet Samsung Tab A", placa: "SENA-TEC-0051", categoria: "Tecnología", estado: "En uso", marca: "Samsung", descripcion: "Tablet para toma de inventario.", ambienteId: "4", ambiente: "Ambiente 202" },
    { id: "10", nombre: "Proyector Epson", placa: "SENA-TEC-0060", categoria: "Tecnología", estado: "En mantenimiento", marca: "Epson", descripcion: "Presenta fallas de proyección.", ambienteId: "4", ambiente: "Ambiente 202" },
    { id: "11", nombre: "Impresora HP LaserJet", placa: "SENA-TEC-0071", categoria: "Oficina", estado: "Disponible", marca: "HP", descripcion: "Requiere cambio de tóner pronto.", ambienteId: "2", ambiente: "Ambiente 102" },
    { id: "12", nombre: "Microscopio óptico", placa: "SENA-LAB-0007", categoria: "Laboratorio", estado: "Disponible", descripcion: "Microscopio binocular 1000x.", ambienteId: "5", ambiente: "Laboratorio 301" },
    { id: "13", nombre: "Taladro percutor", placa: "SENA-HER-0020", categoria: "Herramienta", estado: "Disponible", marca: "Bosch", descripcion: "Taladro 650W con maletín.", ambienteId: "8", ambiente: "Taller 601" },
    { id: "14", nombre: "Portátil Dell Latitude", placa: "SENA-TEC-0080", categoria: "Tecnología", estado: "Disponible", marca: "Dell", descripcion: "Portátil disponible para préstamo.", ambienteId: "3", ambiente: "Ambiente 201" },
]);
