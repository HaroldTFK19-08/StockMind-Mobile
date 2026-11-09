import { ALMACEN_CAMPOS } from "../almacenes.config";
import { esquemaDe } from "@/shared/validations/campos.schema";

export const almacenesSchema = (editando) => esquemaDe(ALMACEN_CAMPOS, editando);
