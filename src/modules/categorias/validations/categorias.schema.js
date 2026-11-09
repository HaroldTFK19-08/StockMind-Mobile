import { CATEGORIA_CAMPOS } from "../categorias.config";
import { esquemaDe } from "@/shared/validations/campos.schema";

export const categoriasSchema = (editando) => esquemaDe(CATEGORIA_CAMPOS, editando);
