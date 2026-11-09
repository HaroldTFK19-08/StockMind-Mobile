import * as Yup from "yup";
import { ISO_DATE_REGEX } from "../utils";

/** Esquema Yup armado a partir de los campos configurados por cada módulo. */
export function esquemaDe(campos, editando) {
    const reglas = {};
    campos.filter((c) => !c.soloLectura).forEach((c) => {
        let regla;
        if (c.tipo === "fecha") regla = Yup.string().matches(ISO_DATE_REGEX, "Usa el formato AAAA-MM-DD");
        else if (c.tipo === "varios") regla = Yup.array();
        else regla = Yup.mixed();

        const obligatorio = c.requerido === true || (c.requerido === "crear" && !editando);
        if (obligatorio) {
            regla = c.tipo === "varios"
                ? regla.min(1, `Selecciona al menos uno en ${c.label.toLowerCase()}`)
                : regla.required(`${c.label} es obligatorio`);
        }
        reglas[c.name] = regla;
    });
    return Yup.object(reglas);
}
