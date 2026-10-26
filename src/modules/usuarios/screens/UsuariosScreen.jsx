import { useState } from "react";
import { useResource, useFilteredList } from "@/shared/hooks";
import { ListPage, ResourceList } from "@/shared/ui";
import PortalHeader from "@/navigation/PortalHeader";
import { usuariosService } from "../usuarios.service";
import { useUsuariosAnimation } from "../hooks/useUsuariosAnimation";
import UsuarioCard from "../components/UsuarioCard";
import UsuarioDetail from "../components/UsuarioDetail";

const SEARCH_KEYS = ["nombre", "correo", "programa", "documento"];

export default function UsuariosScreen() {
    const resource = useResource(() => usuariosService.list(), []);
    const lista = useFilteredList(resource.data, { searchKeys: SEARCH_KEYS, filterKey: "rolLabel" });
    const [seleccionado, setSeleccionado] = useState(null);
    const animationStyle = useUsuariosAnimation();

    return (
        <ListPage
            animationStyle={animationStyle}
            header={<PortalHeader />}
            title="Usuarios"
            subtitle={`${lista.total} personas registradas en StockMind`}
            search={{ value: lista.query, onChangeText: lista.setQuery, placeholder: "Buscar por nombre, correo o programa" }}
            filters={{ options: lista.filterOptions, value: lista.filter, onChange: lista.setFilter }}
        >
            <ResourceList
                resource={resource}
                items={lista.items}
                filtered={Boolean(lista.query || lista.filter)}
                empty={{ icon: "people-outline", title: "Aún no hay usuarios" }}
                renderItem={({ item }) => <UsuarioCard usuario={item} onPress={() => setSeleccionado(item)} />}
            />
            <UsuarioDetail usuario={seleccionado} onClose={() => setSeleccionado(null)} />
        </ListPage>
    );
}
