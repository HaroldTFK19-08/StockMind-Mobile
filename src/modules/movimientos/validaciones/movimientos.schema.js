import { MOVIMIENTO_CAMPOS } from "../movimientos.config";
import { esquemaDe } from "@/shared/validaciones/campos.schema";

export const movimientosSchema = (editando) => esquemaDe(MOVIMIENTO_CAMPOS, editando);
