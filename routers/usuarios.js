// Importando dependencias
import { Router } from "express";
import passport from "passport";

const router = Router();

const STATUS_CODE = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    NOT_FOUND: 404,
    BAD_REQUEST: 400,
};

// Rutas

// [POST] ruta para registrarse.
router.post(
    "/register",
    passport.authenticate("register", {
        failureMessage: false,
        failureRedirect: "",
    }),
    function (req, res) {
        res.status(STATUS_CODE.OK).send({ session: true });
    }
);

// [POST] ruta para iniciar sesión.
router.post(
    "/login",
    passport.authenticate("login", {
        failureMessage: true,
        failureRedirect: "",
    }),
    function (req, res) {
        res.status(STATUS_CODE.OK).send({ session: true });
    }
);

// [POST] ruta para cerrar sesión.
router.post("/logout", function (req, res) {
    req.logout((error) => {
        !error
            ? res.status(STATUS_CODE.OK).send({ session: false })
            : res.status(STATUS_CODE.BAD_REQUEST).send("Ocurrio un  error", error.message);
    });
});

export default router;
