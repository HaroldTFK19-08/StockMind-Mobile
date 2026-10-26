import * as Yup from "yup";

const correo = Yup.string().trim().email("Ingresa un correo válido").required("El correo es obligatorio");

export const loginSchema = Yup.object({
    correo,
    contrasena: Yup.string().required("La contraseña es obligatoria"),
});

export const registerSchema = Yup.object({
    rol: Yup.string().required("Selecciona un rol"),
    nombre: Yup.string().trim().min(3, "Mínimo 3 caracteres").required("El nombre es obligatorio"),
    documento: Yup.string().trim().matches(/^\d{6,12}$/, "Solo números (6 a 12 dígitos)").required("El documento es obligatorio"),
    correo,
    contrasena: Yup.string().min(6, "Mínimo 6 caracteres").required("La contraseña es obligatoria"),
    confirmarContrasena: Yup.string()
        .oneOf([Yup.ref("contrasena")], "Las contraseñas no coinciden")
        .required("Confirma tu contraseña"),
});
