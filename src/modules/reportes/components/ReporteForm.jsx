import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { BottomSheet, TextField, ChipSelect, SelectField, Button, useToast } from "@/shared/ui";
import { useMutation, useResource } from "@/shared/hooks";
import { elementosService } from "@/modules/elementos/elementos.service";
import { asignacionesService } from "@/modules/asignaciones/asignaciones.service";
import { reportesService } from "../reportes.service";
import { REPORTE_TIPOS } from "../reportes.constants";

const schema = Yup.object({
    elementoId: Yup.string().required("Selecciona el elemento"),
    tipo: Yup.string().required("Selecciona el tipo de novedad"),
    descripcion: Yup.string().trim().min(10, "Describe la novedad (mínimo 10 caracteres)").max(500, "Máximo 500 caracteres").required("La descripción es obligatoria"),
});

/**
 * scope="mine": el aprendiz solo puede reportar sus elementos asignados.
 * scope="all":  instructores y admin pueden reportar cualquier elemento.
 */
export default function ReporteForm({ visible, onClose, onSaved, scope = "all", elementoId }) {
    const toast = useToast();
    const crear = useMutation(reportesService.create);
    const opciones = useResource(
        async () => {
            if (scope === "mine") {
                const mias = await asignacionesService.mias();
                return mias.map((a) => ({ label: a.elemento, value: a.elementoId, description: [a.placa, a.ambiente].filter(Boolean).join(" · ") }));
            }
            const elementos = await elementosService.list();
            return elementos.map((e) => ({ label: e.nombre, value: e.id, description: [e.placa, e.ambiente].filter(Boolean).join(" · ") }));
        },
        [scope],
        { enabled: visible }
    );

    const formik = useFormik({
        initialValues: { elementoId: elementoId ?? "", tipo: "", descripcion: "" },
        validationSchema: schema,
        onSubmit: async (values, helpers) => {
            try {
                const reporte = await crear.mutate(values);
                toast.show("Reporte enviado. Te avisaremos cuando sea atendido.");
                helpers.resetForm();
                onSaved?.(reporte);
                onClose();
            } catch (error) {
                toast.show(error.message, "error");
            }
        },
    });

    // Preselecciona el elemento cuando el formulario se abre desde un detalle
    useEffect(() => {
        if (visible && elementoId) formik.setFieldValue("elementoId", elementoId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible, elementoId]);

    return (
        <BottomSheet
            visible={visible}
            onClose={onClose}
            title="Reportar novedad"
            subtitle="Informa daños, fallas o pérdidas"
            icon="alert-circle-outline"
            footer={<Button title="Enviar reporte" icon="send-outline" loading={crear.loading} onPress={formik.handleSubmit} />}
        >
            <SelectField
                formik={formik}
                name="elementoId"
                label="Elemento"
                icon="cube-outline"
                placeholder="¿Qué elemento presenta la novedad?"
                options={opciones.data ?? []}
                loading={opciones.loading}
            />
            <ChipSelect formik={formik} name="tipo" label="Tipo de novedad" options={REPORTE_TIPOS} />
            <TextField formik={formik} name="descripcion" label="Descripción" placeholder="¿Qué pasó? ¿Desde cuándo?" multiline maxLength={500} />
        </BottomSheet>
    );
}
