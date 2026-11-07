import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { BottomSheet, TextField, ImageField, Button, useToast } from "@/shared/ui";
import { useMutation } from "@/shared/hooks";
import { centrosService } from "../centros.service";

// Mismas reglas que RegistroCentroRequest / ActualizarCentroRequest
const crearSchema = (editando) => Yup.object({
    nombre: Yup.string().trim().max(150, "Máximo 150 caracteres").required("El nombre del centro es obligatorio"),
    regional: Yup.string().trim().max(150, "Máximo 150 caracteres").required("La regional es obligatoria"),
    ciudad: Yup.string().trim().max(100, "Máximo 100 caracteres").required("La ciudad es obligatoria"),
    // La foto es obligatoria al crear; al editar solo se envía si eligen una nueva
    foto_centro: editando ? Yup.mixed().nullable() : Yup.mixed().required("Debes seleccionar una foto del centro"),
});

const EMPTY = { nombre: "", regional: "Cauca", ciudad: "", foto_centro: null };

/**
 * Formulario de centros para crear o editar.
 * @param {object} [centro] - si se pasa, entra en modo edición
 */
export default function CentroForm({ visible, onClose, onSaved, centro = null }) {
    const toast = useToast();
    const isEditing = Boolean(centro);

    const crear = useMutation(centrosService.create);
    const actualizar = useMutation((values) => centrosService.update(centro?.id, values));
    const mutation = isEditing ? actualizar : crear;

    const formik = useFormik({
        initialValues: EMPTY,
        validationSchema: crearSchema(isEditing),
        onSubmit: async (values) => {
            try {
                const datos = { ...values };
                // Si la foto sigue siendo la URL guardada, no se reenvía
                if (typeof datos.foto_centro === "string" || !datos.foto_centro) delete datos.foto_centro;
                const saved = await mutation.mutate(datos);
                toast.show(isEditing ? "Centro actualizado correctamente" : "Centro registrado correctamente");
                onSaved?.(saved);
                onClose();
            } catch (error) {
                toast.show(error.message, "error");
            }
        },
    });

    // Al abrir: llena los campos si es edición. Al cerrar: limpia.
    useEffect(() => {
        if (visible) {
            formik.resetForm({
                values: centro
                    ? { nombre: centro.nombre ?? "", regional: centro.regional ?? "", ciudad: centro.ciudad ?? "", foto_centro: centro.foto_centro ?? null }
                    : EMPTY,
            });
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
            footer={<Button title={isEditing ? "Actualizar centro" : "Guardar centro"} icon="save-outline"
                loading={mutation.loading} onPress={formik.handleSubmit} />}
        >
            <ImageField formik={formik} name="foto_centro" label="Foto del centro" />
            <TextField formik={formik} name="nombre" label="Nombre del centro" placeholder="Ej: Comercio y Servicios" />
            <TextField formik={formik} name="regional" label="Regional" icon="map-outline" placeholder="Ej: Cauca" />
            <TextField formik={formik} name="ciudad" label="Ciudad" icon="navigate-outline" placeholder="Ej: Popayán" />
        </BottomSheet>
    );
}
