import { useFormik } from "formik";
import * as Yup from "yup";
import { BottomSheet, TextField, ChipSelect, SelectField, Button, useToast } from "@/shared/ui";
import { useMutation, useResource } from "@/shared/hooks";
import { ambientesService } from "@/modules/ambientes/ambientes.service";
import { elementosService } from "../elementos.service";
import { ELEMENTO_CATEGORIAS, ELEMENTO_ESTADOS } from "../elementos.constants";

const schema = Yup.object({
    nombre: Yup.string().trim().min(3, "Mínimo 3 caracteres").required("El nombre es obligatorio"),
    placa: Yup.string().trim().max(30, "Máximo 30 caracteres"),
    categoria: Yup.string().required("Selecciona una categoría"),
    estado: Yup.string().required("Selecciona un estado"),
    ambienteId: Yup.string().required("Selecciona el ambiente"),
    descripcion: Yup.string().trim().min(5, "Describe un poco más el elemento").required("La descripción es obligatoria"),
});

export default function ElementoForm({ visible, onClose, onSaved }) {
    const toast = useToast();
    const crear = useMutation(elementosService.create);
    const ambientes = useResource(() => ambientesService.list(), [], { enabled: visible });

    const formik = useFormik({
        initialValues: { nombre: "", placa: "", marca: "", categoria: "", estado: "Disponible", ambienteId: "", descripcion: "" },
        validationSchema: schema,
        onSubmit: async (values, helpers) => {
            try {
                const elemento = await crear.mutate(values);
                toast.show("Elemento registrado en el inventario");
                helpers.resetForm();
                onSaved?.(elemento);
                onClose();
            } catch (error) {
                toast.show(error.message, "error");
            }
        },
    });

    const opcionesAmbientes = (ambientes.data ?? []).map((a) => ({ label: a.nombre, value: a.id, description: a.centro }));

    return (
        <BottomSheet
            visible={visible}
            onClose={onClose}
            title="Nuevo elemento"
            subtitle="Registra un elemento en el inventario"
            icon="cube-outline"
            footer={<Button title="Guardar elemento" icon="save-outline" loading={crear.loading} onPress={formik.handleSubmit} />}
        >
            <TextField formik={formik} name="nombre" label="Nombre del elemento" placeholder="Ej: Computador portátil" />
            <TextField formik={formik} name="placa" label="Placa / código (opcional)" icon="barcode-outline" placeholder="Ej: SENA-TEC-0101" autoCapitalize="characters" />
            <TextField formik={formik} name="marca" label="Marca (opcional)" placeholder="Ej: Lenovo" />
            <ChipSelect formik={formik} name="categoria" label="Categoría" options={ELEMENTO_CATEGORIAS} />
            <ChipSelect formik={formik} name="estado" label="Estado" options={ELEMENTO_ESTADOS} />
            <SelectField
                formik={formik}
                name="ambienteId"
                label="Ambiente"
                icon="easel-outline"
                placeholder="¿Dónde está el elemento?"
                options={opcionesAmbientes}
                loading={ambientes.loading}
            />
            <TextField formik={formik} name="descripcion" label="Descripción" placeholder="Características, estado físico, accesorios…" multiline />
        </BottomSheet>
    );
}
