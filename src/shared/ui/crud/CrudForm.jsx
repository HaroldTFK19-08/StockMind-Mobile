import { useEffect } from "react";
import { useFormik } from "formik";
import { useResource } from "../../hooks/useResource";
import { opcionesDe } from "../../utils";
import BottomSheet from "../BottomSheet";
import TextField from "../TextField";
import ChipSelect from "../ChipSelect";
import SelectField from "../SelectField";
import MultiSelectField from "../MultiSelectField";
import ImageField from "../ImageField";
import Button from "../Button";
import { useToast } from "../Toast";
import { esquemaDe, valoresIniciales, valoresParaEnviar } from "./campos";

/** Select (uno o varios) que carga sus opciones desde otro service. */
function RelacionField({ campo, formik, visible }) {
    const lista = useResource(() => campo.cargar(), [], { enabled: visible });
    const opciones = (lista.data ?? []).map((item) => ({
        label: campo.etiqueta ? campo.etiqueta(item) : item.nombre ?? `#${item.id}`,
        value: item.id,
        description: campo.descripcion?.(item),
    }));
    const Componente = campo.tipo === "varios" ? MultiSelectField : SelectField;
    return (
        <Componente formik={formik} name={campo.name} label={campo.label} icon={campo.icon}
            placeholder={`Selecciona ${campo.label.toLowerCase()}`} options={opciones} loading={lista.loading} />
    );
}

/** Dibuja el input correcto según el tipo del campo. */
function Campo({ campo, formik, visible }) {
    switch (campo.tipo) {
        case "relacion":
        case "varios":
            return <RelacionField campo={campo} formik={formik} visible={visible} />;
        case "imagen":
            return <ImageField formik={formik} name={campo.name} label={campo.label} />;
        case "opciones":
            return <ChipSelect formik={formik} name={campo.name} label={campo.label} options={opcionesDe(campo.opciones)} />;
        case "fecha":
            return (
                <TextField formik={formik} name={campo.name} label={campo.label} icon={campo.icon ?? "calendar-outline"}
                    placeholder="AAAA-MM-DD" keyboardType="numbers-and-punctuation" />
            );
        case "numero":
            return <TextField formik={formik} name={campo.name} label={campo.label} icon={campo.icon} keyboardType="numeric" />;
        case "largo":
            return <TextField formik={formik} name={campo.name} label={campo.label} multiline />;
        default:
            return <TextField formik={formik} name={campo.name} label={campo.label} icon={campo.icon} />;
    }
}

/**
 * Formulario crear / editar.
 * @param registro       null = nuevo · objeto = edición
 * @param recurso        lo que devuelve useCrud (usa recurso.crear / recurso.actualizar)
 * @param porDefecto     valores iniciales al crear (ej: { teacher_id: 3 } del usuario en sesión)
 */
export default function CrudForm({ visible, onClose, registro, recurso, campos, nombre, icono, femenino, porDefecto }) {
    const toast = useToast();
    const o = femenino ? "a" : "o"; // terminación: registrado / registrada
    const editando = Boolean(registro);
    const mutacion = editando ? recurso.actualizar : recurso.crear;

    const formik = useFormik({
        initialValues: valoresIniciales(campos),
        validationSchema: esquemaDe(campos, editando),
        onSubmit: async (values) => {
            try {
                const datos = valoresParaEnviar(campos, values);
                if (editando) await recurso.actualizar.mutate(registro.id, datos);
                else await recurso.crear.mutate(datos);
                toast.show(editando ? `${nombre} actualizad${o}` : `${nombre} registrad${o}`);
                onClose();
            } catch (error) {
                toast.show(error.message, "error");
            }
        },
    });

    // Al abrir: llena con los datos del registro (o los valores por defecto).
    useEffect(() => {
        if (visible) formik.resetForm({ values: valoresIniciales(campos, registro, porDefecto) });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible, registro?.id]);

    return (
        <BottomSheet
            visible={visible}
            onClose={onClose}
            title={editando ? `Editar ${nombre.toLowerCase()}` : `Nuev${o} ${nombre.toLowerCase()}`}
            icon={icono}
            footer={<Button title="Guardar" icon="save-outline" loading={mutacion.loading} onPress={formik.handleSubmit} />}
        >
            {campos.filter((c) => !c.soloLectura).map((campo) => (
                <Campo key={campo.name} campo={campo} formik={formik} visible={visible} />
            ))}
        </BottomSheet>
    );
}
