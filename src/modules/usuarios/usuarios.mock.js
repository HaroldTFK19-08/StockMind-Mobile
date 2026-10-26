import { createMockCollection } from "@/core";

export const USUARIOS_SEED = [
    { id: "1", nombre: "Viviana Arias", correo: "adminsena@soy.sena.edu", rol: "admin", programa: "Coordinación académica", documento: "1061000001", estado: "Activo" },
    { id: "2", nombre: "Santiago Chilito", correo: "instructorsena@soy.sena.edu", rol: "instructor", programa: "ADSO", documento: "1061000002", estado: "Activo" },
    { id: "3", nombre: "Kevin Adrada", correo: "dantesena@soy.sena.edu", rol: "cuentadante", programa: "ADSO", documento: "1061000003", estado: "Activo" },
    { id: "4", nombre: "Leanny Parra Moncada", correo: "aprendizsena@soy.sena.edu", rol: "aprendiz", programa: "ADSO", ficha: "2879456", documento: "1061000004", estado: "Activo" },
    { id: "5", nombre: "Laura Martínez", correo: "laura.martinez@soy.sena.edu", rol: "aprendiz", programa: "ADSO", ficha: "2879456", estado: "Activo" },
    { id: "6", nombre: "Juan Rodríguez", correo: "juan.rodriguez@soy.sena.edu", rol: "aprendiz", programa: "Multimedia", ficha: "2901122", estado: "Activo" },
    { id: "7", nombre: "Valentina Gómez", correo: "valentina.gomez@soy.sena.edu", rol: "aprendiz", programa: "ADSO", ficha: "2879456", estado: "Activo" },
    { id: "8", nombre: "Mateo Hernández", correo: "mateo.hernandez@soy.sena.edu", rol: "aprendiz", programa: "Redes", ficha: "2855301", estado: "Activo" },
    { id: "9", nombre: "Daniela Torres", correo: "daniela.torres@soy.sena.edu", rol: "aprendiz", programa: "Multimedia", ficha: "2901122", estado: "Inactivo" },
    { id: "10", nombre: "Andrés López", correo: "andres.lopez@soy.sena.edu", rol: "instructor", programa: "Redes", estado: "Activo" },
];

// Contraseñas de las cuentas de prueba (solo modo mock).
export const MOCK_PASSWORDS = {
    "adminsena@soy.sena.edu": "admin123",
    "instructorsena@soy.sena.edu": "instructor124",
    "dantesena@soy.sena.edu": "dante321",
    "aprendizsena@soy.sena.edu": "aprendiz2026",
};

export const usuariosMock = createMockCollection(USUARIOS_SEED);
