import { useEffect } from "react";
import { useFormik } from "formik";
import { BottomSheet, TextField, ChipSelect, MultiSelectField, ImageField, Button, useToast } from "@/shared/ui";
import { useMutation, useResource } from "@/shared/hooks";
import { opcionesDe } from "@/shared/utils";
import { elementosService } from "@/modules/elementos/elementos.service";
import { reportesService } from "../reportes.service";
import { REPORTE_TIPOS } from "../reportes.constants";
import { reporteSchema } from "../validations/reportes.schemas";

/**
 * Formulario para reportar una novedad (POST /reportes, multipart por la foto).
 * @param {object} [asignacion] - si se abre desde una asignación, su elemento y aprendiz quedan preseleccionados
 */
export default function ReporteForm({ visible, onClose, onSaved, asignacion }) {
    const toast = useToast();
    const crear = useMutation(reportesService.create);
    const elementos = useResource(() => elementosService.list(), [], { enabled: visible });
    const opciones = (elementos.data ?? []).map((e) => ({ label: e.nombre, value: e.id, description: e.codigo_inventario }));

    const formik = useFormik({
        initialValues: { apprentice_id: "", element_ids: [], tipo: "", descripcion: "", foto_probatorio: null },
        validationSchema: reporteSchema,
        onSubmit: async (values, helpers) => {
            try {
                const reporte = await crear.mutate({ ...values, apprentice_id: Number(values.apprentice_id) });
                toast.show("Reporte enviado");
                helpers.resetForm();
                onSaved?.(reporte);
                onClose();
            } catch (error) {
                toast.show(error.message, "error");
            }
        },
    });

    // Si viene de una asignación, se preseleccionan su elemento y su aprendiz
    useEffect(() => {
        if (visible && asignacion) {
            formik.setFieldValue("element_ids", [asignacion.element_id]);
            formik.setFieldValue("apprentice_id", String(asignacion.apprentice_id));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible, asignacion?.id]);

    return (
        <BottomSheet
            visible={visible}
            onClose={onClose}
            title="Reportar novedad"
            subtitle="Informa daños, fallas o pérdidas"
            icon="alert-circle-outline"
            footer={<Button title="Enviar reporte" icon="send-outline" loading={crear.loading} onPress={formik.handleSubmit} />}
        >
            {/* No hay ruta /aprendices: se escribe el id (tabla apprentices) */}
            <TextField formik={formik} name="apprentice_id" label="ID del aprendiz" icon="person-outline" keyboardType="numeric" />
            <MultiSelectField formik={formik} name="element_ids" label="Elementos" options={opciones}
                loading={elementos.loading} placeholder="¿Qué elementos presentan la novedad?" />
            <ChipSelect formik={formik} name="tipo" label="Tipo de novedad" options={opcionesDe(REPORTE_TIPOS)} />
            <TextField formik={formik} name="descripcion" label="Descripción" placeholder="¿Qué pasó? ¿Desde cuándo?" multiline maxLength={500} />
            <ImageField formik={formik} name="foto_probatorio" label="Foto de evidencia" />
        </BottomSheet>
    );
}
