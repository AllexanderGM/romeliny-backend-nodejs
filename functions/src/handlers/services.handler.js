export default class HandlerServices {
    constructor(globalContext) {
        this.context = `SERVICE - ${globalContext}`;
    }

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
