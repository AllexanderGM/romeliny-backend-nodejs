// Importando dependencias
import { Router } from "express";
const router = Router();

import STATUS_CODE from "../constants/statusCodes.js";
import HandlerRoutes from "../handlers/routes.handler.js";
import ProductsController from "../controllers/products.controller.js";

const handler = new HandlerRoutes("Productos");

/* ----- Rutas ----- */

// -> Ver todos los productos
router.get("/", async (req, res) => {
    const nameMethod = "todos los productos";
    const data = await handler.execute(
        nameMethod,
        async () => await ProductsController.getAllProducts(),
        /* "encrypt-json" */
    );

    data.status
        ? res.status(STATUS_CODE.OK).json(data.response)
        : res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(data.response);
});

// -> Ver un solo producto por ID
router.get("/:id", async (req, res) => {
    const nameMethod = "producto por ID";
    const id = req.params.id;
    const data = await handler.execute(
        nameMethod,
        async () => await ProductsController.getProductById(id),
        /* "encrypt-json" */
    );

    data.status
        ? res.status(STATUS_CODE.OK).json(data.response)
        : res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(data.response);
});

export default router;
