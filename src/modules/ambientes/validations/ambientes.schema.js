import { AMBIENTE_CAMPOS } from "../ambientes.config";
import { esquemaDe } from "@/shared/validations/campos.schema";

export const ambientesSchema = (editando) => esquemaDe(AMBIENTE_CAMPOS, editando);
