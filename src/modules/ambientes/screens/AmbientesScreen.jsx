import { useState } from "react";
import { useFilteredList } from "@/shared/hooks";
import { ListPage, ResourceList } from "@/shared/ui";
import PortalHeader from "@/navigation/PortalHeader";
import { useAmbientes } from "../hooks/useAmbientes";
import { useAmbientesAnimation } from "../hooks/useAmbientesAnimation";
import AmbienteCard from "../components/AmbienteCard";
import AmbienteDetail from "../components/AmbienteDetail";

const SEARCH_KEYS = ["nombre", "tipo"];

export default function AmbientesScreen({ subtitle = "Consulta los ambientes de formación" }) {
    const resource = useAmbientes(); // GET /ambientes
    const lista = useFilteredList(resource.data, { searchKeys: SEARCH_KEYS, filterKey: "estado" });
    const [detalle, setDetalle] = useState(null);
    const animationStyle = useAmbientesAnimation();

    return (
        <ListPage
            animationStyle={animationStyle}
            header={<PortalHeader />}
            title="Ambientes"
            subtitle={subtitle}
            search={{ value: lista.query, onChangeText: lista.setQuery, placeholder: "Buscar por nombre o tipo" }}
            filters={{ options: lista.filterOptions, value: lista.filter, onChange: lista.setFilter }}
        >
            <ResourceList
                resource={resource}
                items={lista.items}
                filtered={Boolean(lista.query || lista.filter)}
                empty={{ icon: "easel-outline", title: "No hay ambientes registrados" }}
                renderItem={({ item }) => <AmbienteCard ambiente={item} onPress={() => setDetalle(item)} />}
            />
            <AmbienteDetail ambiente={detalle} onClose={() => setDetalle(null)} />
        </ListPage>
    );
}
