import { useFormik } from "formik";
import { BottomSheet, TextField, SelectField, Button, useToast } from "@/shared/ui";
import { useMutation, useResource } from "@/shared/hooks";
import { todayISO } from "@/shared/utils";
import { elementosService } from "@/modules/elementos/elementos.service";
import { asignacionesService } from "../asignaciones.service";
import { asignacionSchema } from "../validaciones/asignaciones.schemas";

export default function AsignacionForm({ visible, onClose, onSaved }) {
    const toast = useToast();
    const crear = useMutation(asignacionesService.create);
    // Solo elementos disponibles (el backend rechaza los que ya están asignados o prestados)
    const elementos = useResource(() => elementosService.list(), [], { enabled: visible });
    const disponibles = (elementos.data ?? []).filter((e) => e.estado === "disponible");

    const formik = useFormik({
        initialValues: { element_id: "", apprentice_id: "", teacher_id: "", fecha_asignacion: todayISO(), fecha_devolucion_esperada: "", observaciones: "" },
        validationSchema: asignacionSchema,
        onSubmit: async (values, helpers) => {
            try {
                const asignacion = await crear.mutate({
                    ...values,
                    element_id: Number(values.element_id),
                    apprentice_id: Number(values.apprentice_id),
                    teacher_id: Number(values.teacher_id),
                    observaciones: values.observaciones || null,
                }); // POST /asignaciones → el backend marca el elemento como "asignado"
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
                name="element_id"
                label="Elemento disponible"
                icon="cube-outline"
                placeholder="Selecciona el elemento"
                loading={elementos.loading}
                options={disponibles.map((e) => ({ label: e.nombre, value: e.id, description: e.codigo_inventario }))}
            />
            {/* No hay ruta /aprendices ni /instructores: se escribe el id */}
            <TextField formik={formik} name="apprentice_id" label="ID del aprendiz" icon="person-outline" keyboardType="numeric" />
            <TextField formik={formik} name="teacher_id" label="ID del instructor" icon="school-outline" keyboardType="numeric" />
            <TextField formik={formik} name="fecha_asignacion" label="Fecha de asignación" icon="calendar-outline" placeholder="AAAA-MM-DD" keyboardType="numbers-and-punctuation" />
            <TextField formik={formik} name="fecha_devolucion_esperada" label="Devolución esperada" icon="calendar-clear-outline" placeholder="AAAA-MM-DD" keyboardType="numbers-and-punctuation" />
            <TextField formik={formik} name="observaciones" label="Observaciones (opcional)" placeholder="Estado de entrega, accesorios…" multiline />
        </BottomSheet>
    );
}
