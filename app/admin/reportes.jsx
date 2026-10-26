import { ReportesScreen } from "@/modules/reportes";

export default function AdminReportes() {
    return <ReportesScreen scope="all" canCreate={false} canManage />;
}
