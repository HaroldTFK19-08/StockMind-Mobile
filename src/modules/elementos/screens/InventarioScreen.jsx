import { useState } from "react";
import { useResource, useFilteredList } from "@/shared/hooks";
import { ListPage, ResourceList, Button } from "@/shared/ui";
import PortalHeader from "@/navigation/PortalHeader";
import { elementosService } from "../elementos.service";
import { useElementosAnimation } from "../hooks/useElementosAnimation";
import ElementoCard from "../components/ElementoCard";
import ElementoDetail from "../components/ElementoDetail";
import ElementoForm from "../components/ElementoForm";

const SEARCH_KEYS = ["nombre", "placa", "categoria", "ambiente", "marca"];

/** Inventario general. `canManage` habilita crear y cambiar estados (admin). */
export default function InventarioScreen({ canManage = false }) {
    const resource = useResource(() => elementosService.list(), []);
    const lista = useFilteredList(resource.data, { searchKeys: SEARCH_KEYS, filterKey: "estado" });
    const [form, setForm] = useState(false);
    const [detalle, setDetalle] = useState(null);
    const animationStyle = useElementosAnimation();

    const reemplazar = (e) => resource.setData((prev) => prev.map((x) => (x.id === e.id ? e : x)));

    return (
        <ListPage
            animationStyle={animationStyle}
            header={<PortalHeader />}
            title="Inventario"
            subtitle={`${lista.total} elementos registrados`}
            search={{
                value: lista.query,
                onChangeText: lista.setQuery,
                placeholder: "Buscar por nombre, placa o ambiente",
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
                <ElementoForm visible={form} onClose={() => setForm(false)} onSaved={(e) => resource.setData((prev) => [e, ...(prev ?? [])])} />
            ) : null}
            <ElementoDetail elemento={detalle} canManage={canManage} onUpdated={reemplazar} onClose={() => setDetalle(null)} />
        </ListPage>
    );
}
