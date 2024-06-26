import os from "os";
import process from "process";

import HandlerController from "../handlers/controllers.handler.js";
import MeliService from "../services/meliService.js";

class InfoController {
    static CONTEXT = "información general";
    static handler = new HandlerController(this.CONTEXT);

    // Controlador para obtener el estado de la API
    static async getApiStatus() {
        const nameMethod = "verificar API";

        return await this.handler.execute(nameMethod, async () => {
            const service = await MeliService.checkMeliService();
            if (!service.status) throw new Error("no se pudo verificar la API");

            return {
                name: "API ecommerce de Romeliny",
                uptime: this.formatUptime(process.uptime()),
                health: service.status ? "OK" : "ERROR",
                services: {
                    express: { status: "running", message: "servicio disponible" },
                    mercado_libre: {
                        status: service.status ? "running" : "no running",
                        message: service.status ? service.data : service.error.message,
                    },
                },
            };
        });
    }

    // Controlador para obtener la información del sistema
    static async getSystemInfo() {
        const nameMethod = "información del sistema";

        return await this.handler.execute(nameMethod, async () => {
            return {
                platform: os.platform(),
                release: os.release(),
                uptime: this.formatUptime(os.uptime()),
                hostname: os.hostname(),
                arch: os.arch(),
                cpus: os.cpus().length,
                memory: {
                    total: os.totalmem(),
                    free: os.freemem(),
                },
            };
        });
    }

    // Controlador para obtener las métricas del sistema
    static async getSystemMetrics() {
        const nameMethod = "métricas del sistema";

        return await this.handler.execute(nameMethod, async () => {
            const memoryUsage = process.memoryUsage();
            const cpuUsage = process.cpuUsage();

            return {
                memoryUsage: {
                    rss: memoryUsage.rss,
                    heapTotal: memoryUsage.heapTotal,
                    heapUsed: memoryUsage.heapUsed,
                    external: memoryUsage.external,
                },
                cpuUsage: {
                    user: cpuUsage.user,
                    system: cpuUsage.system,
                },
            };
        });
    }

    /* --------- UTILIDADES --------- */

    // Método para formatear el tiempo de uptime
    static formatUptime(seconds) {
        const days = Math.floor(seconds / (3600 * 24));
        const hours = Math.floor((seconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        return `${days}d ${hours}h ${minutes}m ${secs}s`;
    }
}

export default InfoController;
