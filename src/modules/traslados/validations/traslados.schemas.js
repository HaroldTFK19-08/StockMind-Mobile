import * as Yup from "yup";
import { ISO_DATE_REGEX } from "@/shared/utils";

// Mismas reglas que RegistroTrasladoRequest
export const trasladoSchema = Yup.object({
    ambiente_origen_id: Yup.string().required("Selecciona el ambiente de origen"),
    ambiente_destino_id: Yup.string().required("Selecciona el ambiente de destino"),
    danteaccount_id: Yup.number().typeError("Solo números").required("Escribe el ID de la cuenta-dante"),
    element_ids: Yup.array().min(1, "Selecciona al menos un elemento"),
    motivo: Yup.string().trim().max(255, "Máximo 255 caracteres").required("El motivo es obligatorio"),
    fecha_solicitud: Yup.string().matches(ISO_DATE_REGEX, "Usa el formato AAAA-MM-DD"),
});
