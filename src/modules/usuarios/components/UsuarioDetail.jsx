import { View, Text } from "react-native";
import { BottomSheet, InfoField, InfoGroup, Avatar, Badge } from "@/shared/ui";

export default function UsuarioDetail({ usuario, onClose }) {
    return (
        <BottomSheet visible={Boolean(usuario)} onClose={onClose} title="Detalle del usuario" icon="person-outline">
            {usuario ? (
                <>
                    <View className="items-center mb-5">
                        <Avatar name={usuario.nombre} size={72} />
                        <Text className="text-xl font-extrabold text-ink mt-3 text-center">{usuario.nombre}</Text>
                        <View className="flex-row gap-2 mt-2">
                            <Badge label={usuario.rolLabel} tone="info" />
                            <Badge label={usuario.estado} />
                        </View>
                    </View>
                    <InfoGroup>
                        <InfoField icon="mail-outline" label="Correo" value={usuario.correo} />
                        <InfoField icon="card-outline" label="Documento" value={usuario.documento} />
                        <InfoField icon="school-outline" label="Programa" value={usuario.programa} />
                        {usuario.ficha ? <InfoField icon="people-outline" label="Ficha" value={usuario.ficha} /> : null}
                    </InfoGroup>
                </>
            ) : null}
        </BottomSheet>
    );
}
