import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { BottomSheet, TextField, Button, useToast } from "@/shared/ui";
import { useMutation } from "@/shared/hooks";
import { centrosService } from "../centros.service";

const schema = Yup.object({
    nombre: Yup.string().trim().required("El nombre es obligatorio"),
    regional: Yup.string().trim().required("La regional es obligatoria (ej: Cauca)"),
    ciudad: Yup.string().trim().required("La ciudad es obligatoria (ej: Popayán)"),
    foto_centro: Yup.string().trim().url("Debe ser una URL válida").nullable(),
});

const EMPTY = { nombre: "", regional: "", ciudad: "", foto_centro: "" };

/**
 * Formulario de centros para crear o editar.
 * @param {boolean}  visible
 * @param {Function} onClose
 * @param {Function} onSaved   - recibe el centro guardado (nuevo o actualizado)
 * @param {object}   [centro]  - si se pasa, entra en modo edición
 */
export default function CentroForm({ visible, onClose, onSaved, centro = null }) {
    const toast = useToast();
    const isEditing = Boolean(centro);

    const crear = useMutation(centrosService.create);
    const actualizar = useMutation((values) => centrosService.update(centro?.id, values));
    const mutation = isEditing ? actualizar : crear;

    const formik = useFormik({
        initialValues: EMPTY,
        validationSchema: schema,
        onSubmit: async (values, helpers) => {
            try {
                const saved = await mutation.mutate(values);
                toast.show(isEditing ? "Centro actualizado correctamente" : "Centro registrado correctamente");
                if (!isEditing) helpers.resetForm();
                onSaved?.(saved);
                onClose();
            } catch (error) {
                toast.show(error.message, "error");
            }
        },
    });

    // Prellenar los campos al abrir en modo edición; limpiar al cerrar
    useEffect(() => {
        if (visible && isEditing && centro) {
            formik.setValues({
                nombre: centro.nombre ?? "",
                regional: centro.regional ?? "",
                ciudad: centro.ciudad ?? "",
                foto_centro: centro.foto_centro ?? "",
            });
        }
        if (!visible) {
            formik.resetForm();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible, centro?.id]);

    return (
        <BottomSheet
            visible={visible}
            onClose={onClose}
            title={isEditing ? "Editar centro" : "Nuevo centro"}
            subtitle={isEditing ? "Actualiza los datos del centro" : "Registra un centro de formación"}
            icon="business-outline"
            footer={
                <Button
                    title={isEditing ? "Actualizar centro" : "Guardar centro"}
                    icon="save-outline"
                    loading={mutation.loading}
                    onPress={formik.handleSubmit}
                />
            }
        >
            <TextField
                formik={formik}
                name="nombre"
                label="Nombre del centro"
                placeholder="Ej: Comercio y Servicios"
            />
            <TextField
                formik={formik}
                name="regional"
                label="Regional"
                icon="map-outline"
                placeholder="Ej: Cauca"
            />
            <TextField
                formik={formik}
                name="ciudad"
                label="Ciudad"
                icon="navigate-outline"
                placeholder="Ej: Popayán"
            />
            <TextField
                formik={formik}
                name="foto_centro"
                label="Foto del centro (URL opcional)"
                icon="image-outline"
                placeholder="https://ejemplo.com/foto.jpg"
                autoCapitalize="none"
            />
        </BottomSheet>
    );
}
