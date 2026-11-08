import { ROLES } from "./roles";

const DEMO_PASSWORDS = {
    [ROLES.ADMIN]: "Admin123!",
    [ROLES.INSTRUCTOR]: "Instructor123!",
    [ROLES.CUENTADANTE]: "Cuentadante123!",
    [ROLES.APRENDIZ]: "Aprendiz123!",
};

export const DEMO_CREDENTIALS = [
    {
        rol: ROLES.ADMIN,
        nombre: "Administrador demo",
        documento: "1000000001",
        correo: "admin@stockmind.test",
        contrasena: DEMO_PASSWORDS[ROLES.ADMIN],
    },
    {
        rol: ROLES.INSTRUCTOR,
        nombre: "Instructor demo",
        documento: "1000000002",
        correo: "instructor@stockmind.test",
        contrasena: DEMO_PASSWORDS[ROLES.INSTRUCTOR],
    },
    {
        rol: ROLES.CUENTADANTE,
        nombre: "Cuentadante demo",
        documento: "1000000003",
        correo: "cuentadante@stockmind.test",
        contrasena: DEMO_PASSWORDS[ROLES.CUENTADANTE],
    },
    {
        rol: ROLES.APRENDIZ,
        nombre: "Aprendiz demo",
        documento: "1000000004",
        correo: "aprendiz@stockmind.test",
        contrasena: DEMO_PASSWORDS[ROLES.APRENDIZ],
    },
];

const DEMO_TOKEN_PREFIX = "stockmind-demo-token";

export const authService = {
    async login({ correo, contrasena }) {
        const account = DEMO_CREDENTIALS.find(
            (credential) =>
                credential.correo === correo.trim().toLowerCase() && credential.contrasena === contrasena
        );

        if (!account) throw new Error("Correo o contraseña incorrectos.");

        const { contrasena: _password, ...user } = account;
        return {
            token: `${DEMO_TOKEN_PREFIX}-${user.rol}`,
            user: { id: user.documento, ...user },
        };
    },
};
