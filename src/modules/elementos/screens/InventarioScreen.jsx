import { useState } from "react";
import { useFilteredList } from "@/shared/hooks";
import { ListPage, ResourceList, Button } from "@/shared/ui";
import PortalHeader from "@/navigation/PortalHeader";
import { useElementos } from "../hooks/useElementos";
import { useElementosAnimation } from "../hooks/useElementosAnimation";
import ElementoCard from "../components/ElementoCard";
import ElementoDetail from "../components/ElementoDetail";
import ElementoForm from "../components/ElementoForm";

const SEARCH_KEYS = ["nombre", "codigo_inventario", "serial", "marca", "modelo"];

/** Inventario general. `canManage` habilita crear y cambiar estados (admin). */
export default function InventarioScreen({ canManage = false }) {
    const resource = useElementos(); // GET /elementos
    const lista = useFilteredList(resource.data, { searchKeys: SEARCH_KEYS, filterKey: "estado" });
    const [form, setForm] = useState(false);
    const [detalle, setDetalle] = useState(null);
    const animationStyle = useElementosAnimation();

    return (
        <ListPage
            animationStyle={animationStyle}
            header={<PortalHeader />}
            title="Inventario"
            subtitle={`${lista.total} elementos registrados`}
            search={{
                value: lista.query,
                onChangeText: lista.setQuery,
                placeholder: "Buscar por nombre, código o serial",
                onAdd: canManage ? () => setForm(true) : undefined,
                addLabel: "Nuevo elemento",
            }}
            filters={{ options: lista.filterOptions, value: lista.filter, onChange: lista.setFilter }}
        >
            <ResourceList
                resource={resource}
                items={lista.items}
                filtered={Boolean(lista.query || lista.filter)}
                empty={{
                    icon: "cube-outline",
                    title: "El inventario está vacío",
                    message: "Registra el primer elemento para empezar.",
                    action: canManage ? <Button title="Agregar elemento" icon="add" onPress={() => setForm(true)} /> : null,
                }}
                renderItem={({ item }) => <ElementoCard elemento={item} onPress={() => setDetalle(item)} />}
            />
            {canManage ? (
                <ElementoForm visible={form} onClose={() => setForm(false)} onSaved={resource.agregar} />
            ) : null}
            <ElementoDetail elemento={detalle} canManage={canManage} onUpdated={resource.reemplazar} onClose={() => setDetalle(null)} />
        </ListPage>
    );
}
