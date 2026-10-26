import { useFormik } from "formik";
import * as Yup from "yup";
import { BottomSheet, TextField, SelectField, Button, useToast } from "@/shared/ui";
import { useMutation, useResource } from "@/shared/hooks";
import { ISO_DATE_REGEX, parseDate, todayISO } from "@/shared/utils";
import { ambientesService } from "@/modules/ambientes/ambientes.service";
import { elementosService } from "@/modules/elementos/elementos.service";
import { trasladosService } from "../traslados.service";

const fecha = Yup.string().matches(ISO_DATE_REGEX, "Usa el formato AAAA-MM-DD").required("La fecha es obligatoria");

const schema = Yup.object({
    elementoId: Yup.string().required("Selecciona el elemento"),
    destinoId: Yup.string().required("Selecciona el ambiente de destino"),
    fechaSalida: fecha,
    fechaLlegada: fecha.test("posterior", "No puede ser anterior a la salida", function (value) {
        const salida = parseDate(this.parent.fechaSalida);
        const llegada = parseDate(value);
        return !salida || !llegada || llegada >= salida;
    }),
    motivo: Yup.string().trim().min(5, "Explica brevemente el motivo").required("El motivo es obligatorio"),
});

export default function TrasladoForm({ visible, onClose, onSaved }) {
    const toast = useToast();
    const crear = useMutation(trasladosService.create);
    const elementos = useResource(() => elementosService.list(), [], { enabled: visible });
    const ambientes = useResource(() => ambientesService.list(), [], { enabled: visible });

    const formik = useFormik({
        initialValues: { elementoId: "", destinoId: "", fechaSalida: todayISO(), fechaLlegada: todayISO(), motivo: "" },
        validationSchema: schema,
        onSubmit: async (values, helpers) => {
            try {
                const traslado = await crear.mutate(values);
                toast.show("Traslado programado");
                helpers.resetForm();
                onSaved?.(traslado);
                onClose();
            } catch (error) {
                toast.show(error.message, "error");
            }
        },
    });

    const elementoSel = (elementos.data ?? []).find((e) => e.id === formik.values.elementoId);
    const destinos = (ambientes.data ?? [])
        .filter((a) => a.id !== elementoSel?.ambienteId)
        .map((a) => ({ label: a.nombre, value: a.id, description: `${a.tipo} · ${a.centro}` }));

    return (
        <BottomSheet
            visible={visible}
            onClose={onClose}
            title="Nuevo traslado"
            subtitle="Mueve un elemento entre ambientes"
            icon="swap-horizontal-outline"
            footer={<Button title="Programar traslado" icon="send-outline" loading={crear.loading} onPress={formik.handleSubmit} />}
        >
            <SelectField
                formik={formik}
                name="elementoId"
                label="Elemento"
                icon="cube-outline"
                placeholder="¿Qué elemento se traslada?"
                loading={elementos.loading}
                options={(elementos.data ?? [])
                    .filter((e) => e.estado !== "De baja")
                    .map((e) => ({ label: e.nombre, value: e.id, description: [e.placa, e.ambiente].filter(Boolean).join(" · ") }))}
            />
            <SelectField
                formik={formik}
                name="destinoId"
                label="Ambiente de destino"
                icon="navigate-outline"
                placeholder="¿A dónde va?"
                loading={ambientes.loading}
                options={destinos}
            />
            <TextField formik={formik} name="fechaSalida" label="Fecha de salida" icon="calendar-outline" placeholder="AAAA-MM-DD" keyboardType="numbers-and-punctuation" />
            <TextField formik={formik} name="fechaLlegada" label="Fecha estimada de llegada" icon="calendar-clear-outline" placeholder="AAAA-MM-DD" keyboardType="numbers-and-punctuation" />
            <TextField formik={formik} name="motivo" label="Motivo" placeholder="Ej: Apoyo a clase en otro ambiente" multiline />
        </BottomSheet>
    );
}
