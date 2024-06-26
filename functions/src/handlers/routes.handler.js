import EncryptData from "../utils/encryptData.js";

export default class HandlerRoutes {
    constructor(globalContext) {
        this.context = `ROUTES - ${globalContext}`;
    }

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
