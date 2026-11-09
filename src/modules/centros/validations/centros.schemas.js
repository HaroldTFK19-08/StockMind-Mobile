import * as Yup from "yup";

// Mismas reglas que RegistroCentroRequest / ActualizarCentroRequest
export const centroSchema = (editando) => Yup.object({
    nombre: Yup.string().trim().max(150, "Máximo 150 caracteres").required("El nombre del centro es obligatorio"),
    regional: Yup.string().trim().max(150, "Máximo 150 caracteres").required("La regional es obligatoria"),
    ciudad: Yup.string().trim().max(100, "Máximo 100 caracteres").required("La ciudad es obligatoria"),
    // La foto es obligatoria al crear; al editar solo se envía si eligen una nueva
    foto_centro: editando ? Yup.mixed().nullable() : Yup.mixed().required("Debes seleccionar una foto del centro"),
});
