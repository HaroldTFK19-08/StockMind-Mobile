import { Alert, Platform } from "react-native";
import { formatDate, toISODate, etiquetaEstado } from "../../utils";
export { esquemaDe } from "../../validaciones/campos.schema";

/**
 * Un "campo" describe una columna que se envía al backend:
 *
 *   {
 *     name: "trainingcenter_id",       // nombre que valida el Request de Laravel
 *     label: "Centro",
 *     icon: "business-outline",
 *     tipo: "texto" | "largo" | "numero" | "fecha" | "opciones" | "relacion" | "varios" | "imagen",
 *     requerido: true | "crear",       // "crear" = obligatorio solo al registrar
 *     opciones: ["urbana", "rural"],   // tipo "opciones" (se muestran con mayúscula inicial)
 *     cargar: () => centrosService.list(),           // tipo "relacion" y "varios"
 *     etiqueta: (centro) => centro.nombre,           // tipo "relacion" y "varios"
 *     desde: (registro) => registro.elements.map((e) => e.id), // tipo "varios": valor al editar
 *     mostrar: (registro) => registro.trainingcenter?.nombre,  // qué se ve en el detalle
 *     soloLectura: true,               // se muestra en el detalle pero no en el formulario
 *   }
 */

/** Valor que se muestra en el detalle para un campo. */
export function textoDe(campo, registro) {
    if (campo.mostrar) return campo.mostrar(registro);
    const valor = registro?.[campo.name];
    if (valor == null || valor === "") return null;
    if (campo.tipo === "fecha") return formatDate(valor);
    if (campo.tipo === "opciones") return etiquetaEstado(valor);
    return String(valor);
}

/** Valores iniciales del formulario: los del registro (editar) o los por defecto (nuevo). */
export function valoresIniciales(campos, registro, porDefecto = {}) {
    return Object.fromEntries(
        campos.filter((c) => !c.soloLectura).map((c) => {
            if (!registro) {
                const def = porDefecto[c.name];
                return [c.name, def ?? (c.tipo === "varios" ? [] : c.tipo === "imagen" ? null : "")];
            }
            if (c.tipo === "varios") return [c.name, c.desde ? c.desde(registro) : registro[c.name] ?? []];
            const valor = registro[c.name];
            if (valor == null) return [c.name, c.tipo === "imagen" ? null : ""];
            if (c.tipo === "fecha") return [c.name, toISODate(valor) ?? ""];
            return [c.name, valor];
        })
    );
}

/** Prepara los valores para el backend: "" → null, números como Number, imagen vieja no se reenvía. */
export function valoresParaEnviar(campos, values) {
    const salida = {};
    campos.filter((c) => !c.soloLectura).forEach((c) => {
        const v = values[c.name];
        if (c.tipo === "imagen") {
            if (v && typeof v === "object") salida[c.name] = v; // solo si eligieron una nueva
            return;
        }
        if (c.tipo === "varios") salida[c.name] = (v ?? []).map(Number);
        else if (v === "" || v == null) salida[c.name] = null;
        else if (c.tipo === "numero" || c.tipo === "relacion") salida[c.name] = Number(v);
        else salida[c.name] = v;
    });
    return salida;
}

/** Confirmación que funciona en el celular y en web. */
export function confirmar(titulo, mensaje) {
    if (Platform.OS === "web") return Promise.resolve(globalThis.confirm?.(`${titulo}\n\n${mensaje}`) ?? false);
    return new Promise((resolve) =>
        Alert.alert(titulo, mensaje, [
            { text: "Cancelar", style: "cancel", onPress: () => resolve(false) },
            { text: "Eliminar", style: "destructive", onPress: () => resolve(true) },
        ])
    );
}
