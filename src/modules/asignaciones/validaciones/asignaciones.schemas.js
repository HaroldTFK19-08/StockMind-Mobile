import * as Yup from "yup";
import { ISO_DATE_REGEX } from "@/shared/utils";

const fecha = Yup.string().matches(ISO_DATE_REGEX, "Usa el formato AAAA-MM-DD");

// Mismas reglas que RegistroAsignacionRequest
export const asignacionSchema = Yup.object({
    element_id: Yup.string().required("Selecciona un elemento"),
    apprentice_id: Yup.number().typeError("Solo números").required("Escribe el ID del aprendiz"),
    teacher_id: Yup.number().typeError("Solo números").required("Escribe el ID del instructor"),
    fecha_asignacion: fecha,
    fecha_devolucion_esperada: fecha.required("La fecha es obligatoria"),
    observaciones: Yup.string().max(255, "Máximo 255 caracteres"),
});
