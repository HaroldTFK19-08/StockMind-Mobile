import { useState } from "react";
import { useResource, useFilteredList } from "@/shared/hooks";
import { ListPage, ResourceList, Button } from "@/shared/ui";
import PortalHeader from "@/navigation/PortalHeader";
import { centrosService } from "../centros.service";
import { useCentrosAnimation } from "../hooks/useCentrosAnimation";
import CentroCard from "../components/CentroCard";
import CentroForm from "../components/CentroForm";
import CentroDetail from "../components/CentroDetail";

const SEARCH_KEYS = ["nombre", "ciudad", "regional"];

/**
 * Pantalla de Centros — consume GET /centros, POST /centros,
 * PUT /centros/:id y DELETE /centros/:id.
 *
 * @param {boolean} canCreate  - true para administradores
 * @param {boolean} canEdit    - true para administradores (habilita editar y eliminar)
 */
export default function CentrosScreen({ canCreate = true, canEdit = true }) {
    const resource = useResource(() => centrosService.list(), []);
    const lista = useFilteredList(resource.data, { searchKeys: SEARCH_KEYS });

    // null = form cerrado | false = nuevo centro | objeto = edición
    const [formCentro, setFormCentro] = useState(null);
    const [detalle, setDetalle] = useState(null);
    const animationStyle = useCentrosAnimation();

    /** Tras crear: añade al principio. Tras editar: reemplaza en su posición. */
    const handleSaved = (centro) => {
        resource.setData((prev) => {
            const arr = prev ?? [];
            const idx = arr.findIndex((c) => c.id === centro.id);
            if (idx >= 0) {
                const copy = [...arr];
                copy[idx] = centro;
                return copy;
            }
            return [centro, ...arr];
        });
    };

    /** Tras eliminar: quita el centro de la lista local. */
    const handleDeleted = (id) => {
        resource.setData((prev) => (prev ?? []).filter((c) => c.id !== id));
    };

    const count = lista.items?.length ?? 0;
    const subtitle = count === 1 ? "1 centro registrado" : `${count} centros registrados`;

    return (
        <ListPage
            animationStyle={animationStyle}
            header={<PortalHeader />}
            title="Centros"
            subtitle={subtitle}
            search={{
                value: lista.query,
                onChangeText: lista.setQuery,
                placeholder: "Buscar por nombre, ciudad o regional",
                onAdd: canCreate ? () => setFormCentro(false) : undefined,
                addLabel: "Nuevo centro",
            }}
        >
            <ResourceList
                resource={resource}
                items={lista.items}
                filtered={Boolean(lista.query)}
                empty={{
                    icon: "business-outline",
                    title: "Aún no hay centros",
                    action: canCreate
                        ? <Button title="Registrar centro" icon="add" onPress={() => setFormCentro(false)} />
                        : null,
                }}
                renderItem={({ item }) => (
                    <CentroCard centro={item} onPress={() => setDetalle(item)} />
                )}
            />

            {/* Detalle — muestra foto, info, y botones Editar y Eliminar para admins */}
            <CentroDetail
                centro={detalle}
                onClose={() => setDetalle(null)}
                onEdit={canEdit ? (c) => setFormCentro(c) : undefined}
                onDeleted={handleDeleted}
            />

            {/* Formulario crear / editar con campos reales (nombre, regional, ciudad, foto_centro) */}
            <CentroForm
                visible={formCentro !== null}
                centro={formCentro || null}
                onClose={() => setFormCentro(null)}
                onSaved={handleSaved}
            />
        </ListPage>
    );
}
