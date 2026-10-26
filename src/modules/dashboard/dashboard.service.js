import { env, http, ENDPOINTS, unwrapItem } from "@/core";
import { ROLES } from "@/modules/auth/roles";
import { elementosService } from "@/modules/elementos/elementos.service";
import { reportesService } from "@/modules/reportes/reportes.service";
import { centrosService } from "@/modules/centros/centros.service";
import { usuariosService } from "@/modules/usuarios/usuarios.service";
import { ambientesService } from "@/modules/ambientes/ambientes.service";
import { asignacionesService } from "@/modules/asignaciones/asignaciones.service";
import { trasladosService } from "@/modules/traslados/traslados.service";
import { mapResumen } from "./dashboard.mapper";

const ABIERTO = (r) => !["Atendido", "Rechazado"].includes(r.estado);

const deReportes = (lista) =>
    lista.slice(0, 3).map((r) => ({
        id: `r${r.id}`,
        titulo: r.elemento,
        subtitulo: `${r.tipo} · ${r.descripcion}`,
        fecha: r.fecha,
        estado: r.estado,
        icon: "alert-circle-outline",
    }));

/** Solo modo mock: arma el resumen con los servicios de cada módulo. */
async function resumenMock(rol) {
    switch (rol) {
        case ROLES.ADMIN: {
            const [elementos, reportes, centros, usuarios] = await Promise.all([
                elementosService.list(),
                reportesService.list(),
                centrosService.list(),
                usuariosService.list(),
            ]);
            return {
                elementos: elementos.length,
                reportesPendientes: reportes.filter((r) => r.estado === "Pendiente").length,
                centros: centros.length,
                usuarios: usuarios.length,
                recientes: deReportes(reportes),
            };
        }
        case ROLES.INSTRUCTOR: {
            const [ambientes, mios] = await Promise.all([ambientesService.list(), reportesService.mios()]);
            return {
                ambientes: ambientes.length,
                misReportesAbiertos: mios.filter(ABIERTO).length,
                recientes: deReportes(mios),
            };
        }
        case ROLES.CUENTADANTE: {
            const [ambientes, asignaciones, traslados] = await Promise.all([
                ambientesService.list(),
                asignacionesService.list(),
                trasladosService.list(),
            ]);
            return {
                ambientes: ambientes.length,
                asignacionesActivas: asignaciones.filter((a) => a.estado !== "Finalizada").length,
                asignacionesPorVencer: asignaciones.filter((a) => a.estado === "Por vencer").length,
                trasladosEnCurso: traslados.filter((t) => t.estado !== "Entregado").length,
                recientes: traslados.slice(0, 3).map((t) => ({
                    id: `t${t.id}`,
                    titulo: t.elemento,
                    subtitulo: `${t.origen ?? "—"} → ${t.destino ?? "—"}`,
                    fecha: t.fechaSalida,
                    estado: t.estado,
                    icon: "swap-horizontal-outline",
                })),
            };
        }
        case ROLES.APRENDIZ: {
            const [mias, mios] = await Promise.all([asignacionesService.mias(), reportesService.mios()]);
            return {
                misElementos: mias.filter((a) => a.estado !== "Finalizada").length,
                misReportesAbiertos: mios.filter(ABIERTO).length,
                recientes: deReportes(mios),
            };
        }
        default:
            return {};
    }
}

export const dashboardService = {
    /** GET /dashboard/resumen */
    async resumen(rol) {
        if (env.isMock("dashboard")) return mapResumen(await resumenMock(rol));
        return mapResumen(unwrapItem(await http.get(ENDPOINTS.dashboard.resumen)));
    },
};
