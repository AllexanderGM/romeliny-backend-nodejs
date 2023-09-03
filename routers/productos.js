// Importando dependencias
import { Router } from "express";
const router = Router();

// Imprtando clases
import { Producto } from "../daos/index.js";
const gestorProductos = Producto;

// [Midellware] usuario autenticado
import administrador from "../handlers/Administrador.js";

import uploadFile from "../utils/uploadFile.js";
import deleteFile from "../utils/deleteFile.js";

const STATUS_CODE = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    NOT_FOUND: 404,
    BAD_REQUEST: 400,
};

const directorioProductos = "/../public/imgProductos/";

/* ----- Rutas CRUD ----- */

// -> Ver todos los productos
router.get("/", (req, res) => {
    gestorProductos.listarTodos().then((response) => {
        res.status(STATUS_CODE.OK).send(response);
    });
});

// -> Ver un solo producto por ID
router.get("/:id", (req, res) => {
    gestorProductos.listar(req.params.id).then((response) => {
        res.status(STATUS_CODE.OK).send(response);
    });
});

// -> Agregar un solo producto
router.post("/", administrador, (req, res) => {
    gestorProductos.nuevo(req.body).then((response) => {
        res.status(STATUS_CODE.CREATED).send(response);
    });
});

// -> Modificar un producto mediante su ID
router.put("/:id", administrador, (req, res) => {
    gestorProductos.modificar(req.params.id, req.body).then((response) => {
        res.status(STATUS_CODE.CREATED).send(response);
    });
});

// -> Eliminar un producto mediante su ID
router.delete("/:id", administrador, (req, res) => {
    gestorProductos.borrar(req.params.id).then((response) => {
        res.status(STATUS_CODE.OK).send(response);
    });
});

/* ----- Rutas Generales ----- */

// -> Subir las fotos de los productos
router.post("/upload-image/", administrador, async (req, res) => {
    const response = await uploadFile(req, directorioProductos);
    res.status(STATUS_CODE.OK).send(response);
});

// -> Eliminar las fotos de los productos
router.post("/delete-image/", administrador, (req, res) => {
    console.log("Parametros de la eliminación: ", req.body.image);
    const response = deleteFile(req.body.image);
    console.log(response);
    res.status(STATUS_CODE.OK).send(response);
});

export default router;
