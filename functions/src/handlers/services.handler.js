export default class HandlerServices {
    constructor(globalContext) {
        this.context = `SERVICE - ${globalContext}`;
    }

    /**
     * Ejecuta un servicio asincrónico y maneja errores de manera uniforme.
     * @param {string} specificContext Contexto específico del servicio.
     * @param {function} serviceFunction Función asincrónica que representa el servicio a ejecutar.
     * @returns {Promise<{status: boolean, data?: any, error?: {context: string, message: string}}>}
     */
    async execute(specificContext, serviceFunction) {
        try {
            const data = await serviceFunction();
            return { status: true, data };
        } catch (error) {
            return {
                status: false,
                error: {
                    context: `${this.context} -> ${specificContext}`,
                    message: error.message,
                },
            };
        }
    }
}
