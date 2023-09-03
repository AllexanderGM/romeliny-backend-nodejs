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
import minimist from "minimist"; // Manejo de parametros de entrada
import bcrypt from "bcrypt"; // Cifrado de contraseñas

// --> 🧺 Midelware 🧺 <--
import busboy from "connect-busboy"; // Formularios con archivos
import cookieParser from "cookie-parser"; // Uso de cookies encriptadas
import logger from "morgan"; // Manejar registros en la aplicación
import session from "express-session"; // Manejo de sesiones [usuario] en la aplicación.
import passport from "passport"; // Manejo en las estrategias de autenticación de usuario.
import { Strategy as LocalStrategy } from "passport-local"; // Estrategias de autenticación locales.

// --> 👥 Servidor Web Socket 👥 <--
import initSocket from "./Socket.js";

// --> 📖 DataBase 📖 <--
import mongoose from "mongoose"; // Manejo de bases de datos con Mongo DB
import MongoStore from "connect-mongo"; // Manejo de sesiones [usuario] en Mongo DB
import UserModel from "./db/models/modelMongoUser.js"; // Modelo para el usuario

// --> ♾️ Rutas de la API ♾️ <--
import carrito from "./routers/carrito.js";
import productos from "./routers/productos.js";
import usuarios from "./routers/usuarios.js";
import messageEmail from "./routers/messageEmail.js";

// * ----- PARAMETROS DE ENTRADA ----- * \\

const optsMinimist = {
    default: {
        port: process.env.NODE_PORT,
        mode: "fork",
    },
    alias: {
        p: "port",
        m: "mode",
    },
};

const { port: NODE_PORT, mode } = minimist(process.argv.slice(2), optsMinimist);

// --> Se toma el puerto de las variables de entorno
const ENV = process.env.NODE_ENV;
const PORT = normalizePort(NODE_PORT);

// --> Se configura las rutas path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// * ----- SE INICIA EL SERVIDOR EN EXPRESS ----- * \\

const app = express();

// --> Se guarda el puerto en Express
app.set("port", PORT);

// * ----- MIDDLEWARE ----- * \\

// * --> Midelware de autenticación

// --> Conexión con la base de datos
(() => {
    try {
        const URL = process.env.MONGO_CLOUD_URL;
        mongoose.connect(URL);
        console.log("Conectado a la base de datos.");
    } catch (error) {
        console.error("Error en conectarse a la base de datos: ", error.message);
    }
})();

// --> Autenticación: [inicio de sesion] podemos autenticarnos de muchas maneras (google, twiter, facebook, local, etc...)
passport.use(
    "login",
    new LocalStrategy(
        {
            usernameField: "email",
        },
        (email, password, done) => {
            UserModel.findOne({ email })
                .then((user) => {
                    if (!user) {
                        console.log(`El usuario ${email} no se encuentra.`);

                        return done(null, true, {
                            message: `El usuario ${email} no fue encontrado.`,
                        });
                    }

                    if (!bcrypt.compareSync(password, user.password)) {
                        console.log("contraseña invalida.");

                        return done(null, false, {
                            message: "Contraseña invalida.",
                        });
                    }
                    console.log(user);
                    done(null, user);
                })
                .catch((error) => {
                    console.log("Error al iniciar sesion\n", error.message);
                    done(error);
                });

            app.use((req, res, next) => {
                res.sendResponse = res.send;
                res.send = function (body) {
                    if (body && body.error && body.status) {
                        return res.status(body.status).json({
                            error: -2,
                            descripcion: body.error,
                            método: req.method,
                        });
                    }
                    return res.sendResponse(body);
                };
                next();
            });
        }
    )
);

// --> Autenticación: [registro]
passport.use(
    "register",
    new LocalStrategy(
        {
            usernameField: "email",
            passReqToCallback: true, // Este parametro si esta en true, especifica que el callback reciba el objeto req (request)
        },
        (req, email, password, done) => {
            UserModel.findOne({ email })
                .then((user) => {
                    if (user) {
                        console.log(`El usuario ${email} ya existe.`);

                        return done(null, false);
                    } else {
                        const salt = bcrypt.genSaltSync(10);
                        const hash = bcrypt.hashSync(req.body.password, salt);
                        req.body.password = hash;

                        return UserModel.create(req.body);
                    }
                })
                .then((newUser) => {
                    console.log(newUser);
                    if (newUser) {
                        console.log(`EL usuario ${newUser.email} se registro de manera exitosa.`);

                        done(null, newUser, { message: "" });
                    } else {
                        throw new Error("El usuario ya existe");
                    }
                })
                .catch((error) => {
                    console.log("Error al registrarse", error.message);
                    done(error);
                });
        }
    )
);

// --> Serializador de passport
passport.serializeUser((user, done) => {
    done(null, user._id);
});

// --> deserializador de passport
passport.deserializeUser((_id, done) => {
    UserModel.findOne({ _id })
        .then((user) => done(null, user))
        .catch(done);
});

// --> Opciones de Express sesion
const advancedOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

// --> configuraciones de Express sesion
app.use(
    session({
        secret: process.env.SECRET_SESSION,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_CLOUD_URL,
            mongoOptions: advancedOptions,
            ttl: process.env.TTL,
        }),
        rolling: true,
        resave: false,
        saveUninitialized: false,
    })
);

// --> Midelware de aplicación <--

// -> Control de acceso HTTP
app.use(cors());
// -> Formulario con archivos
app.use(busboy());
// --> Registro en la aplicación [Logs, alerts, etc]
app.use(logger("dev"));
// --> Cookies encriptadas
app.use(cookieParser());
// --> Inicializa una sesión con Passport
app.use(passport.initialize());
// --> Crea una sesion con passport
app.use(passport.session());
// -> Pasa de JSON a objeto
app.use(express.json());
// -> Pasa rutas a objeto
app.use(express.urlencoded({ extended: true }));
// -> Se define una carpeta publica
app.use("/", express.static(path.join(__dirname, "public/")));

//  --> Middleware de manejo de errores
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

// * ----- RUTAS DE APLICACIÓN ----- * \\

app.use("/api", usuarios);
app.use("/api/products", productos);
app.use("/api/cars", carrito);
app.use("/api/message", messageEmail);

// --> Middleware petición a otra pagina
app.use((req, res) => {
    res.status(404).json({
        error: -2,
        descripcion: `ruta: ${req.originalUrl} `,
        método: req.method,
        estado: "no implementada",
    });
});

// --> Captura 404 y reenvía al controlador de errores
app.use(function (req, res, next) {
    next(createError(404));
});

// --> Controlador de errores
app.use(function (err, req, res, next) {
    // Establecer locales, solo proporcionando error en el desarrollo
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // Renderizar la página de error
    res.status(err.status || 500);
    res.render("error");
});

// * ----- ESCUCHA EN EL PUERTO DEFINIDO ----- * \\

const server = http.createServer(app);

initSocket(server);

server.listen(PORT, () => {
    console.log(`Servidor http esta escuchando en el puerto ${server.address().port}`);
    console.log(`http://localhost:${server.address().port}`);
    console.log(`Environment:${ENV}`);
});

server.on("error", (error) => console.log(`Error en servidor ${error}`));

//* ----- FUNCIONES ----- *\\

// --> Normaliza un puerto en un número, cadena o falso.
function normalizePort(val) {
    let port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

// --> Escucha de eventos para el evento de "error" del servidor HTTP.
function onError(error) {
    if (error.syscall !== "listen") {
        throw error;
    }

    let bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

    // manejar errores de escucha específicos con mensajes amistosos
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}

// --> Escucha de eventos para el evento de "escucha" del servidor HTTP.
function onListening() {
    let addr = server.address();
    let bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    debug("Listening on " + bind);
}
