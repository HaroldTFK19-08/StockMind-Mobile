import PortalTabs from "@/navigation/PortalTabs";
import { ROLES } from "@/modules/auth/roles";

export default function Layout() {
    return <PortalTabs rol={ROLES.ADMIN} />;
}
