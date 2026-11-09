import * as Yup from "yup";

// Mismas reglas que RegistroReporteRequest
export const reporteSchema = Yup.object({
    apprentice_id: Yup.number().typeError("Solo números").required("Escribe el ID del aprendiz"),
    element_ids: Yup.array().min(1, "Selecciona al menos un elemento"),
    tipo: Yup.string().required("Selecciona el tipo de novedad"),
    descripcion: Yup.string().trim().max(500, "Máximo 500 caracteres").required("La descripción es obligatoria"),
    foto_probatorio: Yup.mixed().required("Debes adjuntar una foto como prueba"),
});
