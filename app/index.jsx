import { Redirect } from "expo-router";
import { useAuth, usuarioPendiente, rolActivo } from "@/modules/auth";
import { homeOf } from "@/navigation/portals";

/** Punto de entrada: decide a dónde ir según la sesión y el estado de los roles. */
export default function Index() {
    const { user } = useAuth();
    if (!user) return <Redirect href="/auth/inicio" />;
    if (usuarioPendiente(user)) return <Redirect href="/auth/pendiente" />;
    return <Redirect href={homeOf(rolActivo(user))} />;
}
