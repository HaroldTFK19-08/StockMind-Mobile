import { PRESTAMO_CAMPOS } from "../prestamos.config";
import { esquemaDe } from "@/shared/validations/campos.schema";

export const prestamosSchema = (editando) => esquemaDe(PRESTAMO_CAMPOS, editando);
