import { useEffect } from "react";
import { useFormik } from "formik";
import { BottomSheet, TextField, ChipSelect, SelectField, ImageField, Button, useToast } from "@/shared/ui";
import { useMutation, useResource } from "@/shared/hooks";
import { opcionesDe } from "@/shared/utils";
import { ambientesService } from "@/modules/ambientes/ambientes.service";
import { categoriasService } from "@/modules/categorias/categorias.service";
import { almacenesService } from "@/modules/almacenes/almacenes.service";
import { elementosService } from "../elementos.service";
import { ESTADOS_MANUALES, ELEMENTO_CONDICIONES } from "../elementos.constants";
import { elementoSchema } from "../validations/elementos.schemas";

const INICIAL = {
    img_elemento: null, codigo_inventario: "", nombre: "", category_id: "", environment_id: "", warehouse_id: "",
    serial: "", marca: "", modelo: "", estado: "disponible", condicion: "bueno", descripcion: "",
};

const valoresDe = (elemento) => elemento ? ({
    img_elemento: elemento.img_elemento ?? null,
    codigo_inventario: elemento.codigo_inventario ?? "",
    nombre: elemento.nombre ?? "",
    category_id: elemento.category_id == null ? "" : String(elemento.category_id),
    environment_id: elemento.environment_id == null ? "" : String(elemento.environment_id),
    warehouse_id: elemento.warehouse_id == null ? "" : String(elemento.warehouse_id),
    serial: elemento.serial ?? "",
    marca: elemento.marca ?? "",
    modelo: elemento.modelo ?? "",
    estado: elemento.estado ?? "disponible",
    condicion: elemento.condicion ?? "bueno",
    descripcion: elemento.descripcion ?? "",
}) : INICIAL;

/** "" → null para que Laravel guarde NULL (y no se envía en el multipart). */
const limpiar = (values) => Object.fromEntries(Object.entries(values).map(([k, v]) => [k, v === "" ? null : v]));

export default function ElementoForm({ visible, onClose, onSaved, elemento = null }) {
    const toast = useToast();
    const crear = useMutation(elementosService.create);
    const actualizar = useMutation((values) => elementosService.update(elemento?.id, values));
    const mutation = elemento ? actualizar : crear;
    const estadoBloqueado = ["asignado", "prestado"].includes(elemento?.estado);

    // Listas para los selects (solo se piden cuando el formulario está abierto)
    const categorias = useResource(() => categoriasService.list(), [], { enabled: visible });
    const ambientes = useResource(() => ambientesService.list(), [], { enabled: visible });
    const almacenes = useResource(() => almacenesService.list(), [], { enabled: visible });

    const formik = useFormik({
        initialValues: INICIAL,
        validationSchema: elementoSchema(Boolean(elemento)),
        onSubmit: async (values, helpers) => {
            try {
                const datos = limpiar(values);
                if (typeof datos.img_elemento === "string" || !datos.img_elemento) delete datos.img_elemento;
                if (estadoBloqueado) delete datos.estado;
                const guardado = elemento
                    ? await actualizar.mutate(datos)
                    : await crear.mutate(datos); // POST /elementos (multipart por la imagen)
                toast.show(elemento ? "Elemento actualizado correctamente" : "Elemento registrado en el inventario");
                if (!elemento) helpers.resetForm();
                onSaved?.(guardado);
                onClose();
            } catch (error) {
                toast.show(error.message, "error");
            }
        },
    });

    useEffect(() => {
        if (visible) formik.resetForm({ values: valoresDe(elemento) });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible, elemento?.id]);

    return (
        <BottomSheet
            visible={visible}
            onClose={onClose}
            title={elemento ? "Editar elemento" : "Nuevo elemento"}
            subtitle={elemento ? "Actualiza los datos del elemento" : "Registra un elemento en el inventario"}
            icon="cube-outline"
            footer={<Button title={elemento ? "Guardar cambios" : "Guardar elemento"} icon="save-outline" loading={mutation.loading} onPress={formik.handleSubmit} />}
        >
            <ImageField formik={formik} name="img_elemento" label="Imagen del elemento" />
            <TextField formik={formik} name="codigo_inventario" label="Código de inventario" icon="barcode-outline" autoCapitalize="characters" />
            <TextField formik={formik} name="nombre" label="Nombre del elemento" placeholder="Ej: Computador portátil" />
            <SelectField formik={formik} name="category_id" label="Categoría" icon="pricetag-outline" loading={categorias.loading}
                options={(categorias.data ?? []).map((c) => ({ label: c.nombre, value: c.id }))} />
            <TextField formik={formik} name="serial" label="Serial (opcional)" icon="key-outline" autoCapitalize="characters" />
            <TextField formik={formik} name="marca" label="Marca (opcional)" placeholder="Ej: Lenovo" />
            <TextField formik={formik} name="modelo" label="Modelo (opcional)" placeholder="Ej: ThinkPad E14" />
            {estadoBloqueado ? (
                <TextField formik={formik} name="estado" label="Estado" editable={false} />
            ) : (
                <ChipSelect formik={formik} name="estado" label="Estado" options={opcionesDe(ESTADOS_MANUALES)} />
            )}
            <ChipSelect formik={formik} name="condicion" label="Condición" options={opcionesDe(ELEMENTO_CONDICIONES)} />
            <SelectField formik={formik} name="environment_id" label="Ambiente (opcional)" icon="easel-outline" loading={ambientes.loading}
                placeholder="¿En qué ambiente está?"
                options={(ambientes.data ?? []).map((a) => ({ label: a.nombre, value: a.id, description: a.tipo }))} />
            <SelectField formik={formik} name="warehouse_id" label="Almacén (opcional)" icon="archive-outline" loading={almacenes.loading}
                placeholder="¿O en qué almacén?"
                options={(almacenes.data ?? []).map((a) => ({ label: a.nombre, value: a.id }))} />
            <TextField formik={formik} name="descripcion" label="Descripción (opcional)" placeholder="Características, accesorios…" multiline />
        </BottomSheet>
    );
}
