import { useFormik } from "formik";
import { BottomSheet, TextField, SelectField, MultiSelectField, Button, useToast } from "@/shared/ui";
import { useMutation, useResource } from "@/shared/hooks";
import { todayISO } from "@/shared/utils";
import { ambientesService } from "@/modules/ambientes/ambientes.service";
import { elementosService } from "@/modules/elementos/elementos.service";
import { trasladosService } from "../traslados.service";
import { trasladoSchema } from "../validaciones/traslados.schemas";

export default function TrasladoForm({ visible, onClose, onSaved }) {
    const toast = useToast();
    const crear = useMutation(trasladosService.create);
    const ambientes = useResource(() => ambientesService.list(), [], { enabled: visible });
    const elementos = useResource(() => elementosService.list(), [], { enabled: visible });

    const formik = useFormik({
        initialValues: { ambiente_origen_id: "", ambiente_destino_id: "", danteaccount_id: "", element_ids: [], motivo: "", fecha_solicitud: todayISO() },
        validationSchema: trasladoSchema,
        onSubmit: async (values, helpers) => {
            try {
                const traslado = await crear.mutate({
                    ...values,
                    ambiente_origen_id: Number(values.ambiente_origen_id),
                    ambiente_destino_id: Number(values.ambiente_destino_id),
                    danteaccount_id: Number(values.danteaccount_id),
                    element_ids: values.element_ids.map(Number),
                }); // POST /traslados → queda "pendiente" y el backend crea su movimiento
                toast.show("Traslado solicitado");
                helpers.resetForm();
                onSaved?.(traslado);
                onClose();
            } catch (error) {
                toast.show(error.message, "error");
            }
        },
    });

    const origen = formik.values.ambiente_origen_id;
    const opciones = (ambientes.data ?? []).map((a) => ({ label: a.nombre, value: a.id, description: a.tipo }));
    const destinos = opciones.filter((o) => String(o.value) !== String(origen)); // regla different:ambiente_destino_id
    // Solo elementos que están en el ambiente de origen
    const delOrigen = (elementos.data ?? [])
        .filter((e) => String(e.environment_id) === String(origen))
        .map((e) => ({ label: e.nombre, value: e.id, description: `${e.codigo_inventario} · ${e.estado}` }));

    return (
        <BottomSheet
            visible={visible}
            onClose={onClose}
            title="Nuevo traslado"
            subtitle="Solicita mover elementos entre ambientes"
            icon="swap-horizontal-outline"
            footer={<Button title="Solicitar traslado" icon="send-outline" loading={crear.loading} onPress={formik.handleSubmit} />}
        >
            <SelectField formik={formik} name="ambiente_origen_id" label="Ambiente de origen" icon="exit-outline"
                placeholder="¿Desde dónde?" loading={ambientes.loading} options={opciones}
                onChange={() => formik.setFieldValue("element_ids", [])} />
            <MultiSelectField formik={formik} name="element_ids" label="Elementos a trasladar" options={delOrigen}
                loading={elementos.loading} placeholder={origen ? "Selecciona los elementos" : "Primero elige el origen"} />
            <SelectField formik={formik} name="ambiente_destino_id" label="Ambiente de destino" icon="enter-outline"
                placeholder="¿Hacia dónde?" loading={ambientes.loading} options={destinos} />
            <TextField formik={formik} name="motivo" label="Motivo" placeholder="Ej: Apoyo a clase en otro ambiente" multiline />
            <TextField formik={formik} name="fecha_solicitud" label="Fecha de solicitud" icon="calendar-outline" placeholder="AAAA-MM-DD" keyboardType="numbers-and-punctuation" />
            {/* No hay ruta /cuentadantes: se escribe el id */}
            <TextField formik={formik} name="danteaccount_id" label="ID de la cuenta-dante" icon="key-outline" keyboardType="numeric" />
        </BottomSheet>
    );
}
