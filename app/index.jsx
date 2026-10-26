import { Redirect } from "expo-router";
import { useAuth } from "@/modules/auth";
import { homeOf } from "@/navigation/portals";

/** Punto de entrada: decide a dónde ir según la sesión y el rol. */
export default function Index() {
    const { user } = useAuth();
    return <Redirect href={user ? homeOf(user.rol) : "/auth/inicio"} />;
}
