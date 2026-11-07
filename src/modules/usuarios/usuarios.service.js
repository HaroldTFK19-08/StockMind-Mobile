import { serviceNotConfigured } from "@/core";

export const usuariosService = {
    list() {
        return serviceNotConfigured("usuarios.list");
    },
    get() {
        return serviceNotConfigured("usuarios.get");
    },
    update() {
        return serviceNotConfigured("usuarios.update");
    },
    listAprendices() {
        return serviceNotConfigured("usuarios.listAprendices");
    },
};
