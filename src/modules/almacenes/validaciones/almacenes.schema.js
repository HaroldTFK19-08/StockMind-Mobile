import { ALMACEN_CAMPOS } from "../almacenes.config";
import { esquemaDe } from "@/shared/validaciones/campos.schema";

export const almacenesSchema = (editando) => esquemaDe(ALMACEN_CAMPOS, editando);
