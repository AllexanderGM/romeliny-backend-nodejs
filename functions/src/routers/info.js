import { Router } from "express";
const router = Router();

import STATUS_CODE from "../constants/statusCodes.js";
import HandlerRoutes from "../handlers/routes.handler.js";
import InfoController from "../controllers/info.controller.js";

const handler = new HandlerRoutes("información general");

//* Rutas

// -> Estado de la API
router.get("/", async (req, res) => {
    const nameMethod = "verificar API";
    const data = await handler.execute(nameMethod, async () => await InfoController.getApiStatus());

    data.status
        ? res.status(STATUS_CODE.OK).json(data.response)
        : res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(data.response);
});

// -> Información del sistema
router.get("/system", async (req, res) => {
    const nameMethod = "información del sistema";
    const data = await handler.execute(nameMethod, async () => await InfoController.getSystemInfo());

    data.status
        ? res.status(STATUS_CODE.OK).json(data.response)
        : res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(data.response);
});

// -> Métricas del sistema
router.get("/metrics", async (req, res) => {
    const nameMethod = "métricas del sistema";
    const data = await handler.execute(nameMethod, async () => await InfoController.getSystemMetrics());

    data.status
        ? res.status(STATUS_CODE.OK).json(data.response)
        : res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(data.response);
});

export default router;
