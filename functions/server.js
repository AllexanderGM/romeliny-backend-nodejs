// * ----- Dependencias ----- * \\

// --> 🌍 Server web 🌍 <--
import express from "express"; // Framework para crear servidores web
import cors from "cors"; // Control de acceso HTTP
import debug from "debug"; // Configuraciones para la depuración
import http from "http"; // Funciones del protocolo
import createError from "http-errors"; // Manejador de errores HTTP

// --> 🛠️ Utilidades 🛠️ <--
import { fileURLToPath } from "url"; // Manejo de rutas con PATH
import path from "path"; // Manejo de rutas de archivos
import minimist from "minimist"; // Manejo de parámetros de entrada

// --> 🧺 Middleware 🧺 <--
import cookieParser from "cookie-parser"; // Uso de cookies encriptadas
import logger from "morgan"; // Manejar registros en la aplicación

// --> ♾️ Rutas de la API ♾️ <--
import infoRouter from "./src/routers/info.js";
import productsRouter from "./src/routers/products.js";

// * ----- PARAMETROS DE ENTRADA ----- * \\

const optsMinimist = {
    default: {
        port: process.env.NODE_PORT || 3000,
        mode: "fork",
    },
    alias: {
        p: "port",
        m: "mode",
    },
};

const { port: NODE_PORT } = minimist(process.argv.slice(2), optsMinimist);
const PORT = normalizePort(NODE_PORT);
const ENV = process.env.NODE_ENV || "development";

// * ----- SE INICIA EL SERVIDOR EN EXPRESS ----- * \\

const app = express();

// --> Se guarda el puerto en Express
app.set("port", PORT);

// --> Middleware de aplicación <--

app.use(cors()); // Control de acceso HTTP
app.use(logger("dev")); // Registro en la aplicación [Logs, alerts, etc]
app.use(cookieParser()); // Cookies encriptadas
app.use(express.json()); // Pasa de JSON a objeto
app.use(express.urlencoded({ extended: true })); // Pasa rutas a objeto
app.use(express.static(path.join(__dirname, "public"))); // Define una carpeta pública

// * ----- RUTAS DE APLICACIÓN ----- * \\

app.use("/", infoRouter);
app.use("/products", productsRouter);

// --> Middleware para manejar rutas no implementadas
app.use((req, res, next) => {
    res.status(404).json({
        error: -2,
        descripcion: `ruta: ${req.originalUrl}`,
        método: req.method,
        estado: "no implementada",
    });
    next(createError(404));
});

// --> Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).send("Servidor roto!");
});

// * ----- ESCUCHA EN EL PUERTO DEFINIDO ----- * \\

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Servidor http está escuchando en el puerto ${server.address().port}`);
    console.log(`http://localhost:${server.address().port}`);
    console.log(`Environment: ${ENV}`);
});

server.on("error", onError);
server.on("listening", onListening);

//* ----- FUNCIONES ----- *\\

// --> Normaliza un puerto en un número, cadena o falso.
function normalizePort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) return val; // Named pipe
    if (port >= 0) return port; // Port number
    return false;
}

// --> Escucha de eventos para el evento de "error" del servidor HTTP.
function onError(error) {
    if (error.syscall !== "listen") throw error;

    const bind = typeof PORT === "string" ? "Pipe " + PORT : "Port " + PORT;

    // Manejar errores de escucha específicos con mensajes amistosos
    switch (error.code) {
        case "EACCES":
            console.error(`${bind} requiere privilegios elevados`);
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(`${bind} está en uso`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

// --> Escucha de eventos para el evento de "escucha" del servidor HTTP.
function onListening() {
    const addr = server.address();
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    debug(`Listening on ${bind}`);
}
