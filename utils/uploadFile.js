import fs from "fs-extra";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* Crea ruta y sube una nieva imagen */

export default function uploadFile(req, carpeta) {
    return new Promise((resolve, reject) => {
        let fstream;
        let __filename;

        req.pipe(req.busboy);

        req.busboy.on("file", (_, file, filename) => {
            __filename = filename.filename;

            console.log("Uploading: " + __filename);

            if (!fs.existsSync(__dirname + carpeta)) {
                fs.mkdirSync(__dirname + carpeta);
            }

            fstream = fs.createWriteStream(__dirname + carpeta + __filename);
            file.pipe(fstream);

            fstream.on("close", () => {
                console.log("Upload Finished of " + __filename);
                carpeta = carpeta.replace("../public/", "");
                console.log(carpeta);
                const hostname = req.hostname === "localhost" ? `${req.hostname}:${process.env.NODE_PORT}` : `https://${req.hostname}`;
                const route = path.join(hostname, carpeta, __filename).replace(/[/\\]/g, "/");

                resolve(route);
            });

            fstream.on("error", (error) => {
                reject(error);
            });
        });
    });
}
