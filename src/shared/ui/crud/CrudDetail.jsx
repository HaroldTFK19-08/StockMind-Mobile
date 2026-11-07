import { View, Image } from "react-native";
import BottomSheet from "../BottomSheet";
import InfoField, { InfoGroup } from "../InfoField";
import Badge from "../Badge";
import Button from "../Button";
import { useToast } from "../Toast";
import { textoDe, confirmar } from "./campos";

/** Detalle de un registro con botones Editar / Eliminar (si se puede editar). */
export default function CrudDetail({ registro, onClose, onEdit, recurso, campos, nombre, icono, titulo, puedeEditar, femenino, campoEstado }) {
    const toast = useToast();

    const handleEliminar = async () => {
        const ok = await confirmar(`Eliminar ${nombre.toLowerCase()}`, "Esta acción no se puede deshacer.");
        if (!ok) return;
        try {
            await recurso.eliminar.mutate(registro.id); // DELETE /ruta/:id
            toast.show(`${nombre} eliminad${femenino ? "a" : "o"}`);
            onClose();
        } catch (error) {
            toast.show(error.message, "error"); // ej: "No se puede eliminar porque tiene…"
        }
    };

    const imagen = campos.find((c) => c.tipo === "imagen");
    const datos = campos.filter((c) => c.tipo !== "imagen" && c.name !== campoEstado);

    return (
        <BottomSheet
            visible={Boolean(registro)}
            onClose={onClose}
            title={registro ? titulo(registro) : nombre}
            icon={icono}
            footer={
                puedeEditar && registro ? (
                    <>
                        <Button title="Editar" icon="pencil-outline" variant="outline" onPress={() => onEdit(registro)} />
                        <Button title="Eliminar" icon="trash-outline" variant="danger" className="mt-3"
                            loading={recurso.eliminar.loading} onPress={handleEliminar} />
                    </>
                ) : null
            }
        >
            {registro ? (
                <>
                    {imagen && registro[imagen.name] ? (
                        <View className="mb-4 rounded-2xl overflow-hidden bg-gray-100 h-44">
                            <Image source={{ uri: registro[imagen.name] }} className="w-full h-full" resizeMode="cover" />
                        </View>
                    ) : null}
                    {campoEstado && registro[campoEstado] ? (
                        <View className="mb-4">
                            <Badge label={registro[campoEstado]} />
                        </View>
                    ) : null}
                    <InfoGroup>
                        {datos.map((campo) => (
                            <InfoField key={campo.name} icon={campo.icon} label={campo.label} value={textoDe(campo, registro)} />
                        ))}
                    </InfoGroup>
                </>
            ) : null}
        </BottomSheet>
    );
}
