import { ROLES } from "@/modules/auth/roles";
import { elementosService } from "@/modules/elementos/elementos.service";
import { centrosService } from "@/modules/centros/centros.service";
import { usuariosService } from "@/modules/usuarios/usuarios.service";
import { ambientesService } from "@/modules/ambientes/ambientes.service";
import { reportesService } from "@/modules/reportes/reportes.service";
import { asignacionesService } from "@/modules/asignaciones/asignaciones.service";
import { trasladosService } from "@/modules/traslados/traslados.service";
import { nombresElementos, relacion, todayISO } from "@/shared/utils";

/** El resumen se arma con los listados que ya existen: no hay ruta /dashboard. */
const abierto = (r) => r.estado === "pendiente" || r.estado === "en_revision";

const recienteDeReporte = (r) => ({
    id: r.id,
    icon: "alert-circle-outline",
    titulo: nombresElementos(r.elements) ?? "Reporte",
    subtitulo: r.descripcion,
    estado: r.estado,
    fecha: r.fecha_reporte,
});

const recienteDeTraslado = (t) => ({
    id: t.id,
    icon: "swap-horizontal-outline",
    titulo: t.motivo,
    subtitulo: `${relacion(t, "origin_environment", "ambiente_origen_id", "Ambiente")} → ${relacion(t, "destination_environment", "ambiente_destino_id", "Ambiente")}`,
    estado: t.estado,
    fecha: t.fecha_solicitud,
});

export const dashboardService = {
    async resumen(user) {
        const rol = user?.rol;

        if (rol === ROLES.ADMIN) {
            const [elementos, reportes, centros, usuarios] = await Promise.all([
                elementosService.list(),
                reportesService.list(),
                centrosService.list(),
                usuariosService.list(),
            ]);
            return {
                elementos: elementos.length,
                reportesPendientes: reportes.filter((r) => r.estado === "pendiente").length,
                centros: centros.length,
                usuarios: usuarios.length,
                recientes: reportes.slice(0, 5).map(recienteDeReporte),
            };
        }

        if (rol === ROLES.INSTRUCTOR) {
            const [ambientes, reportes] = await Promise.all([ambientesService.list(), reportesService.mios(user?.id)]);
            return {
                ambientes: ambientes.length,
                misReportesAbiertos: reportes.filter(abierto).length,
                recientes: reportes.slice(0, 5).map(recienteDeReporte),
            };
        }

        if (rol === ROLES.CUENTADANTE) {
            const ambienteId = user?.ambiente_id;
            const [ambientes, asignaciones, traslados] = await Promise.all([
                ambientesService.list(),
                asignacionesService.list(),
                trasladosService.list(),
            ]);
            const asignacionesVisibles = ambienteId
                ? asignaciones.filter((a) => String(a.element?.environment_id ?? "") === String(ambienteId))
                : asignaciones;
            const trasladosVisibles = ambienteId
                ? traslados.filter((t) => String(t.ambiente_origen_id ?? t.origin_environment?.id ?? "") === String(ambienteId))
                : traslados;
            const hoy = todayISO();
            return {
                asignacionesActivas: asignacionesVisibles.filter((a) => a.estado !== "devuelta").length,
                asignacionesPorVencer: asignacionesVisibles.filter(
                    (a) => a.estado !== "devuelta" && a.fecha_devolucion_esperada && a.fecha_devolucion_esperada < hoy
                ).length,
                trasladosEnCurso: trasladosVisibles.filter((t) => t.estado === "pendiente" || t.estado === "aprobado").length,
                ambientes: ambientes.length,
                recientes: trasladosVisibles.slice(0, 5).map(recienteDeTraslado),
            };
        }

        if (rol === ROLES.APRENDIZ) {
            const [asignaciones, reportes] = await Promise.all([
                asignacionesService.mias(user?.id),
                reportesService.mios(user?.id),
            ]);
            return {
                misElementos: asignaciones.length,
                misReportesAbiertos: reportes.filter(abierto).length,
                recientes: reportes.slice(0, 5).map(recienteDeReporte),
            };
        }

        return {};
    },
};
