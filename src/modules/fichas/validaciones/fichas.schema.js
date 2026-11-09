import { FICHA_CAMPOS } from "../fichas.config";
import { esquemaDe } from "@/shared/validaciones/campos.schema";

export const fichasSchema = (editando) => esquemaDe(FICHA_CAMPOS, editando);
