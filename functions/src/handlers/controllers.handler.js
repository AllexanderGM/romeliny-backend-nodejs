class HandlerController {
    constructor(globalContext) {
        this.context = `CONTROLLER - ${globalContext}`;
    }

    /**
     * Ejecuta un controlador asincrónico y maneja errores de manera uniforme.
     * @param {string} context Contexto específico del controlador.
     * @param {function} controller Función asincrónica que representa el controlador a ejecutar.
     * @returns {Promise<{status: boolean, data?: any, error?: {context: string, message: string}}>}
     */

    async execute(specificContext, controllerFunction) {
        try {
            const data = await controllerFunction();
            return {
                status: true,
                data,
            };
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

export default HandlerController;
