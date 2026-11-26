import { View, Text } from "react-native";
import { BottomSheet, InfoField, InfoGroup, Avatar, Badge, Button } from "@/shared/ui";
import { etiquetasRoles } from "@/modules/auth";

export default function UsuarioDetail({ usuario, onClose, onAprobar, aprobando = false }) {
    const roles = etiquetasRoles(usuario);
    return (
        <BottomSheet visible={Boolean(usuario)} onClose={onClose} title="Detalle del usuario" icon="person-outline">
            {usuario ? (
                <>
                    <View className="items-center mb-5">
                        <Avatar name={usuario.nombre} size={72} />
                        <Text className="text-xl font-extrabold text-ink mt-3 text-center">{usuario.nombre}</Text>
                        <View className="flex-row gap-2 mt-2">
                            <Badge label={usuario.rolLabel} tone="info" />
                        </View>
                    </View>

                    {roles.length ? (
                        <View className="mb-5">
                            <Text className="text-sm font-bold text-ink mb-2">Roles</Text>
                            {roles.map((rol) => (
                                <View key={rol.rol} className="flex-row items-center justify-between bg-gray-50 rounded-2xl px-3 py-2.5 mb-2">
                                    <View className="flex-1 mr-2">
                                        <Text className="text-sm font-semibold text-gray-700">{rol.etiqueta}</Text>
                                        <Badge
                                            label={rol.estado === "pendiente" ? "Pendiente" : "Aprobado"}
                                            tone={rol.estado === "pendiente" ? "warning" : "success"}
                                        />
                                    </View>
                                    {rol.estado === "pendiente" && onAprobar ? (
                                        <Button
                                            title="Aprobar"
                                            size="sm"
                                            variant="soft"
                                            loading={aprobando}
                                            onPress={() => onAprobar(usuario, rol.rol)}
                                        />
                                    ) : null}
                                </View>
                            ))}
                        </View>
                    ) : null}

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
