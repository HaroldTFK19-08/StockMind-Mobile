import { elementosService } from "@/modules/elementos/elementos.service";
import { formatDate, nombresElementos, etiquetaEstado } from "@/shared/utils";

/**
 * Campos de RegistroMovimientoRequest (tabla motions).
 * Los movimientos tipo "traslado" los crea el backend al registrar un traslado,
 * por eso aquí solo se ofrecen Ingreso, Retiro y Baja.
 */
export const MOVIMIENTO_CAMPOS = [
    { name: "tipo", label: "Tipo", tipo: "opciones", opciones: ["Ingreso", "Retiro", "Baja"], requerido: true },
    { name: "motivo", label: "Motivo", icon: "chatbox-ellipses-outline", tipo: "largo", requerido: true },
    { name: "fecha_movimiento", label: "Fecha", tipo: "fecha" },
    {
        name: "element_ids",
        label: "Elementos",
        icon: "cube-outline",
        tipo: "varios",
        requerido: true,
        cargar: () => elementosService.list(),
        etiqueta: (e) => e.nombre,
        descripcion: (e) => e.codigo_inventario,
        desde: (m) => (m.elements ?? []).map((e) => e.id),
        mostrar: (m) => nombresElementos(m.elements),
    },
];

export const tituloMovimiento = (m) => etiquetaEstado(m.tipo) || `Movimiento #${m.id}`;
export const subtituloMovimiento = (m) => [formatDate(m.fecha_movimiento, ""), m.motivo].filter(Boolean).join(" · ");
/** Los movimientos de un traslado solo se gestionan desde Traslados. */
export const movimientoEditable = (m) => m.transfer_id == null;
