import { AMBIENTE_CAMPOS } from "../ambientes.config";
import { esquemaDe } from "@/shared/validaciones/campos.schema";

export const ambientesSchema = (editando) => esquemaDe(AMBIENTE_CAMPOS, editando);
