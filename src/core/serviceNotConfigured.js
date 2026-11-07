export function serviceNotConfigured(service) {
    throw new Error(`El servicio "${service}" aún no está configurado.`);
}
