import { serviceNotConfigured } from "@/core";

export const authService = {
    login() {
        return serviceNotConfigured("auth.login");
    },
    register() {
        return serviceNotConfigured("auth.register");
    },
    me() {
        return serviceNotConfigured("auth.me");
    },
};
