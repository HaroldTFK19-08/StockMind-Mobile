import { FICHA_CAMPOS } from "../fichas.config";
import { esquemaDe } from "@/shared/validations/campos.schema";

export const fichasSchema = (editando) => esquemaDe(FICHA_CAMPOS, editando);
