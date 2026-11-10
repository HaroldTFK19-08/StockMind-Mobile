import * as Yup from "yup";

// La imagen es obligatoria al crear; al editar se conserva la imagen existente.
export const elementoSchema = (editando) => Yup.object({
    img_elemento: editando ? Yup.mixed().nullable() : Yup.mixed().required("Debes seleccionar una imagen del elemento"),
    codigo_inventario: Yup.string().trim().max(30, "Máximo 30 caracteres").required("El código es obligatorio"),
    nombre: Yup.string().trim().max(150, "Máximo 150 caracteres").required("El nombre es obligatorio"),
    category_id: Yup.string().required("Selecciona una categoría"),
    serial: Yup.string().trim().max(60, "Máximo 60 caracteres"),
    marca: Yup.string().trim().max(60, "Máximo 60 caracteres"),
    modelo: Yup.string().trim().max(60, "Máximo 60 caracteres"),
    descripcion: Yup.string().trim().max(500, "Máximo 500 caracteres"),
});
