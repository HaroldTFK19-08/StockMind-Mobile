import { useState } from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../theme/colors";
import { useFilteredList } from "../../hooks/useFilteredList";
import { useEntranceAnimation } from "../../hooks/useEntranceAnimation";
import ListPage from "../ListPage";
import ResourceList from "../ResourceList";
import Card from "../Card";
import Badge from "../Badge";
import Button from "../Button";
import CrudForm from "./CrudForm";
import CrudDetail from "./CrudDetail";

/**
 * Pantalla de listado + detalle + formulario para cualquier módulo simple.
 *
 *   const sedes = useSedes();
 *   <CrudScreen recurso={sedes} campos={SEDE_CAMPOS} titulo="Sedes" nombre="Sede" icono="git-branch-outline" />
 *
 * @param recurso        lo que devuelve useCrud (useSedes, useFichas…)
 * @param campos         configuración de columnas (ver campos.js)
 * @param titulo         título de la pantalla
 * @param nombre         nombre en singular ("Sede")
 * @param tituloItem     (registro) => texto principal de la tarjeta
 * @param subtituloItem  (registro) => texto secundario de la tarjeta
 * @param puedeEditar    muestra crear / editar / eliminar
 * @param editable       (registro) => false para bloquear editar/eliminar ese registro
 * @param porDefecto     valores iniciales al crear (ej: datos del usuario en sesión)
 * @param crearEsquema   (editando) => esquema Yup del módulo
 * @param campoEstado    columna que se muestra como etiqueta de color (ej: "estado")
 * @param femenino       true para "Nueva sede", "Sede eliminada"…
 */
export default function CrudScreen({
    header,
    recurso,
    campos,
    titulo,
    nombre,
    icono = "albums-outline",
    tituloItem = (r) => `${nombre} #${r.id}`,
    subtituloItem,
    puedeEditar = true,
    campoEstado,
    femenino = false,
    editable = () => true,
    porDefecto,
    crearEsquema,
}) {
    const nuevo = femenino ? "Nueva" : "Nuevo";
    const buscarPor = campos.filter((c) => !c.tipo || c.tipo === "texto" || c.tipo === "largo" || c.tipo === "opciones").map((c) => c.name);
    const lista = useFilteredList(recurso.data, { searchKeys: buscarPor });
    const animationStyle = useEntranceAnimation();

    const [detalle, setDetalle] = useState(null);
    // null = cerrado · false = nuevo · objeto = editar
    const [form, setForm] = useState(null);

    const total = recurso.data?.length ?? 0;

    return (
        <ListPage
            animationStyle={animationStyle}
            header={header}
            title={titulo}
            subtitle={`${total} ${total === 1 ? "registro" : "registros"}`}
            search={{
                value: lista.query,
                onChangeText: lista.setQuery,
                placeholder: `Buscar en ${titulo.toLowerCase()}`,
                onAdd: puedeEditar ? () => setForm(false) : undefined,
                addLabel: `${nuevo} ${nombre.toLowerCase()}`,
            }}
        >
            <ResourceList
                resource={recurso}
                items={lista.items}
                filtered={Boolean(lista.query)}
                empty={{
                    icon: icono,
                    title: `Aún no hay ${titulo.toLowerCase()}`,
                    action: puedeEditar ? <Button title={`Registrar ${nombre.toLowerCase()}`} icon="add" onPress={() => setForm(false)} /> : null,
                }}
                renderItem={({ item }) => (
                    <Card onPress={() => setDetalle(item)}>
                        <View className="flex-row items-center">
                            <View className="w-12 h-12 rounded-2xl bg-sena-soft items-center justify-center">
                                <Ionicons name={icono} size={22} color={COLORS.primary} />
                            </View>
                            <View className="flex-1 ml-3.5">
                                <Text className="text-base font-bold text-gray-900" numberOfLines={1}>{tituloItem(item)}</Text>
                                {subtituloItem ? (
                                    <Text className="text-sm text-gray-500 mt-0.5" numberOfLines={1}>{subtituloItem(item)}</Text>
                                ) : null}
                            </View>
                            {campoEstado && item[campoEstado] ? <Badge label={item[campoEstado]} /> : null}
                        </View>
                    </Card>
                )}
            />

            <CrudDetail
                registro={detalle}
                onClose={() => setDetalle(null)}
                onEdit={(r) => {
                    setDetalle(null);
                    setForm(r);
                }}
                recurso={recurso}
                campos={campos}
                nombre={nombre}
                icono={icono}
                titulo={tituloItem}
                puedeEditar={puedeEditar && Boolean(detalle) && editable(detalle)}
                femenino={femenino}
                campoEstado={campoEstado}
            />

            {puedeEditar ? (
                <CrudForm
                    visible={form !== null}
                    onClose={() => setForm(null)}
                    registro={form || null}
                    recurso={recurso}
                    campos={campos}
                    nombre={nombre}
                    icono={icono}
                    femenino={femenino}
                    porDefecto={porDefecto}
                    crearEsquema={crearEsquema}
                />
            ) : null}
        </ListPage>
    );
}
