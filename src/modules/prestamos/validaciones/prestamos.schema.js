import { PRESTAMO_CAMPOS } from "../prestamos.config";
import { esquemaDe } from "@/shared/validaciones/campos.schema";

export const prestamosSchema = (editando) => esquemaDe(PRESTAMO_CAMPOS, editando);
