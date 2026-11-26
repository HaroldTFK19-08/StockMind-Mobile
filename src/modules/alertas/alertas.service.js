import { asignacionesService } from "@/modules/asignaciones";
import { prestamosService } from "@/modules/prestamos/prestamos.service";
import { todayISO } from "@/shared/utils";

/**
 * Alertas del cuentadante calculadas con los datos del modelo relacional:
 * asignaciones y préstamos cuya devolución esperada ya venció.
 * No se crea ninguna tabla ni campo nuevo.
 */
async function devolucionesVencidasDeAsignaciones(hoy, ambienteId) {
    const asignaciones = await asignacionesService.list();
    return asignaciones
        .filter((a) => {
            const delAmbiente = !ambienteId || String(a.element?.environment_id ?? "") === String(ambienteId);
            return delAmbiente && a.estado !== "devuelta" && a.fecha_devolucion_esperada && a.fecha_devolucion_esperada < hoy;
        })
        .map((a) => ({
            id: `asignacion-${a.id}`,
            titulo: "Devolución de asignación vencida",
            detalle: a.element?.nombre ?? `Elemento #${a.element_id}`,
            fecha: a.fecha_devolucion_esperada,
        }));
}

async function devolucionesVencidasDePrestamos(hoy, ambienteId) {
    const prestamos = await prestamosService.list();
    return prestamos
        .filter((p) => {
            const delAmbiente = !ambienteId || String(p.element?.environment_id ?? "") === String(ambienteId);
            return delAmbiente && p.estado !== "devuelto" && p.fecha_devolucion_esperada && p.fecha_devolucion_esperada < hoy;
        })
        .map((p) => ({
            id: `prestamo-${p.id}`,
            titulo: "Devolución de préstamo vencida",
            detalle: p.element?.nombre ?? `Elemento #${p.element_id}`,
            fecha: p.fecha_devolucion_esperada,
        }));
}

export const alertasService = {
    async list(ambienteId = null) {
        const hoy = todayISO();
        const [asignaciones, prestamos] = await Promise.all([
            devolucionesVencidasDeAsignaciones(hoy, ambienteId),
            devolucionesVencidasDePrestamos(hoy, ambienteId),
        ]);
        return [...asignaciones, ...prestamos];
    },
};
