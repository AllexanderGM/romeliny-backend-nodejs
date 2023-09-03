// Importando dependencias
import { Router } from "express";
const router = Router();

// Importando clases
import { Carrito } from "../daos/index.js";
const gestorCarrito = Carrito;

const STATUS_CODE = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    NOT_FOUND: 404,
    BAD_REQUEST: 400,
};

// Rutas

// -> Lista de carritos
router.get("/", (req, res) => {
    gestorCarrito.listarTodos().then((response) => {
        res.status(STATUS_CODE.OK).send(response);
    });
});

// -> Crear un nuevo carrito
router.post("/", (req, res) => {
    gestorCarrito.nuevo().then((response) => {
        res.status(STATUS_CODE.CREATED).send(response);
    });
});

// -> Eliminar un carrito mediante su ID
router.delete("/:id", (req, res) => {
    gestorCarrito.borrar(req.params.id).then((response) => {
        res.status(STATUS_CODE.OK).send(response);
    });
});

// -> Ver los productos de un carrito mediante su ID
router.get("/:id/products", (req, res) => {
    gestorCarrito.verProductos(req.params.id).then((response) => {
        res.status(STATUS_CODE.OK).send(response);
    });
});

// -> Agregar un producto a un carrito mediante su ID
router.post("/:id/products/:id_prod", (req, res) => {
    gestorCarrito.guardarProducto(req.params.id, req.params.id_prod).then((response) => {
        res.status(STATUS_CODE.OK).send(response);
    });
});

// -> Eliminar un producto de un carrito mediante su ID
router.delete("/:id/products/:id_prod", (req, res) => {
    gestorCarrito.borrarProducto(req.params.id, req.params.id_prod).then((response) => {
        res.status(STATUS_CODE.OK).send(response);
    });
});

export default router;
