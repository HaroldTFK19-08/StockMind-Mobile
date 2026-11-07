import { useFormik } from "formik";
import * as Yup from "yup";
import { BottomSheet, TextField, ChipSelect, SelectField, ImageField, Button, useToast } from "@/shared/ui";
import { useMutation, useResource } from "@/shared/hooks";
import { opcionesDe } from "@/shared/utils";
import { ambientesService } from "@/modules/ambientes/ambientes.service";
import { categoriasService } from "@/modules/categorias/categorias.service";
import { almacenesService } from "@/modules/almacenes/almacenes.service";
import { elementosService } from "../elementos.service";
import { ESTADOS_MANUALES, ELEMENTO_CONDICIONES } from "../elementos.constants";

// Mismas reglas que RegistroElementoRequest
const schema = Yup.object({
    img_elemento: Yup.mixed().required("Debes seleccionar una imagen del elemento"),
    codigo_inventario: Yup.string().trim().max(30, "Máximo 30 caracteres").required("El código es obligatorio"),
    nombre: Yup.string().trim().max(150, "Máximo 150 caracteres").required("El nombre es obligatorio"),
    category_id: Yup.string().required("Selecciona una categoría"),
    serial: Yup.string().trim().max(60, "Máximo 60 caracteres"),
    marca: Yup.string().trim().max(60, "Máximo 60 caracteres"),
    modelo: Yup.string().trim().max(60, "Máximo 60 caracteres"),
    descripcion: Yup.string().trim().max(500, "Máximo 500 caracteres"),
});

const INICIAL = {
    img_elemento: null, codigo_inventario: "", nombre: "", category_id: "", environment_id: "", warehouse_id: "",
    serial: "", marca: "", modelo: "", estado: "disponible", condicion: "bueno", descripcion: "",
};

/** "" → null para que Laravel guarde NULL (y no se envía en el multipart). */
const limpiar = (values) => Object.fromEntries(Object.entries(values).map(([k, v]) => [k, v === "" ? null : v]));

export default function ElementoForm({ visible, onClose, onSaved }) {
    const toast = useToast();
    const crear = useMutation(elementosService.create);

    // Listas para los selects (solo se piden cuando el formulario está abierto)
    const categorias = useResource(() => categoriasService.list(), [], { enabled: visible });
    const ambientes = useResource(() => ambientesService.list(), [], { enabled: visible });
    const almacenes = useResource(() => almacenesService.list(), [], { enabled: visible });

    const formik = useFormik({
        initialValues: INICIAL,
        validationSchema: schema,
        onSubmit: async (values, helpers) => {
            try {
                const elemento = await crear.mutate(limpiar(values)); // POST /elementos (multipart por la imagen)
                toast.show("Elemento registrado en el inventario");
                helpers.resetForm();
                onSaved?.(elemento);
                onClose();
            } catch (error) {
                toast.show(error.message, "error");
            }
        },
    });

    return (
        <BottomSheet
            visible={visible}
            onClose={onClose}
            title="Nuevo elemento"
            subtitle="Registra un elemento en el inventario"
            icon="cube-outline"
            footer={<Button title="Guardar elemento" icon="save-outline" loading={crear.loading} onPress={formik.handleSubmit} />}
        >
            <ImageField formik={formik} name="img_elemento" label="Imagen del elemento" />
            <TextField formik={formik} name="codigo_inventario" label="Código de inventario" icon="barcode-outline" autoCapitalize="characters" />
            <TextField formik={formik} name="nombre" label="Nombre del elemento" placeholder="Ej: Computador portátil" />
            <SelectField formik={formik} name="category_id" label="Categoría" icon="pricetag-outline" loading={categorias.loading}
                options={(categorias.data ?? []).map((c) => ({ label: c.nombre, value: c.id }))} />
            <TextField formik={formik} name="serial" label="Serial (opcional)" icon="key-outline" autoCapitalize="characters" />
            <TextField formik={formik} name="marca" label="Marca (opcional)" placeholder="Ej: Lenovo" />
            <TextField formik={formik} name="modelo" label="Modelo (opcional)" placeholder="Ej: ThinkPad E14" />
            <ChipSelect formik={formik} name="estado" label="Estado" options={opcionesDe(ESTADOS_MANUALES)} />
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
