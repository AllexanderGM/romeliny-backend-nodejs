export default class HandlerController {
    constructor(globalContext) {
        this.context = `CONTROLLER - ${globalContext}`;
    }

    async execute(specificContext, controllerFunction) {
        try {
            const data = await controllerFunction();
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
