import EncryptData from "../utils/encryptData.js";

class HandlerRoutes {
    constructor(globalContext) {
        this.context = `ROUTES - ${globalContext}`;
    }

    /**
     * Ejecuta una ruta asincrónico y maneja errores de manera uniforme.
     * @param {string} specificContext Contexto específico de la ruta.
     * @param {function} route Función asincrónica que representa e la ruta a ejecutar.
     * @returns {Promise<{status: boolean, data?: any, error?: {context: string, message: string}}>}
     */

    async execute(specificContext, route, encrypt = false) {
        try {
            let data = await route();
            if (!data.status)
                throw { message: `no se pudo ejecutar la ruta [ ${specificContext} ]`, details: data.error };

            switch (encrypt) {
                case "encrypt-text":
                    data = await EncryptData.encrypt(data);
                    break;

                case "encrypt-json":
                    data = await EncryptData.encryptJSON(data);
                    break;

                default:
                    break;
            }

            return {
                status: true,
                response: {
                    message: "successful",
                    isEncrypted: encrypt,
                    data,
                },
            };
        } catch (error) {
            return {
                status: false,
                response: {
                    message: "error",
                    error: {
                        context: `${this.context} -> ${specificContext}`,
                        message: error.message,
                        details: error.details.message,
                    },
                },
            };
        }
    }
}

export default HandlerRoutes;
