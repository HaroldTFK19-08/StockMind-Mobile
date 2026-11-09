import { SEDE_CAMPOS } from "../sedes.config";
import { esquemaDe } from "@/shared/validations/campos.schema";

export const sedesSchema = (editando) => esquemaDe(SEDE_CAMPOS, editando);
