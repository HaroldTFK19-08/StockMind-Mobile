import { useFormik } from "formik";
import * as Yup from "yup";
import { BottomSheet, TextField, SelectField, Button, useToast } from "@/shared/ui";
import { useMutation, useResource } from "@/shared/hooks";
import { ISO_DATE_REGEX, parseDate, todayISO } from "@/shared/utils";
import { usuariosService } from "@/modules/usuarios/usuarios.service";
import { elementosService } from "@/modules/elementos/elementos.service";
import { asignacionesService } from "../asignaciones.service";

const fecha = Yup.string().matches(ISO_DATE_REGEX, "Usa el formato AAAA-MM-DD").required("La fecha es obligatoria");

const schema = Yup.object({
    aprendizId: Yup.string().required("Selecciona un aprendiz"),
    elementoId: Yup.string().required("Selecciona un elemento"),
    fechaInicio: fecha,
    fechaFin: fecha.test("posterior", "Debe ser posterior a la fecha de inicio", function (value) {
        const inicio = parseDate(this.parent.fechaInicio);
        const fin = parseDate(value);
        return !inicio || !fin || fin > inicio;
    }),
    observaciones: Yup.string().max(300, "Máximo 300 caracteres"),
});

export default function AsignacionForm({ visible, onClose, onSaved }) {
    const toast = useToast();
    const crear = useMutation(asignacionesService.create);
    const aprendices = useResource(() => usuariosService.listAprendices(), [], { enabled: visible });
    const disponibles = useResource(() => elementosService.list({ estado: "Disponible" }), [], { enabled: visible });

    const formik = useFormik({
        initialValues: { aprendizId: "", elementoId: "", fechaInicio: todayISO(), fechaFin: "", observaciones: "" },
        validationSchema: schema,
        onSubmit: async (values, helpers) => {
            try {
                const asignacion = await crear.mutate(values);
                toast.show("Elemento asignado correctamente");
                helpers.resetForm();
                onSaved?.(asignacion);
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
            title="Nueva asignación"
            subtitle="Entrega un elemento a un aprendiz"
            icon="clipboard-outline"
            footer={<Button title="Asignar elemento" icon="checkmark-done-outline" loading={crear.loading} onPress={formik.handleSubmit} />}
        >
            <SelectField
                formik={formik}
                name="aprendizId"
                label="Aprendiz"
                icon="person-outline"
                placeholder="Selecciona el aprendiz"
                loading={aprendices.loading}
                options={(aprendices.data ?? []).map((u) => ({
                    label: u.nombre,
                    value: u.id,
                    description: [u.programa, u.ficha && `Ficha ${u.ficha}`].filter(Boolean).join(" · "),
                }))}
            />
            <SelectField
                formik={formik}
                name="elementoId"
                label="Elemento disponible"
                icon="cube-outline"
                placeholder="Selecciona el elemento"
                loading={disponibles.loading}
                options={(disponibles.data ?? []).map((e) => ({
                    label: e.nombre,
                    value: e.id,
                    description: [e.placa, e.ambiente].filter(Boolean).join(" · "),
                }))}
            />
            <TextField formik={formik} name="fechaInicio" label="Fecha de inicio" icon="calendar-outline" placeholder="AAAA-MM-DD" keyboardType="numbers-and-punctuation" />
            <TextField formik={formik} name="fechaFin" label="Fecha de finalización" icon="calendar-clear-outline" placeholder="AAAA-MM-DD" keyboardType="numbers-and-punctuation" />
            <TextField formik={formik} name="observaciones" label="Observaciones (opcional)" placeholder="Estado de entrega, accesorios…" multiline />
        </BottomSheet>
    );
}
