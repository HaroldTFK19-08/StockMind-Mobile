import { SEDE_CAMPOS } from "../sedes.config";
import { esquemaDe } from "@/shared/validaciones/campos.schema";

export const sedesSchema = (editando) => esquemaDe(SEDE_CAMPOS, editando);
