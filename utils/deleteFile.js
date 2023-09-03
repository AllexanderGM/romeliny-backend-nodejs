import fs from "fs-extra";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* Elimina una imagen dentro de la carpeta especificada */

export default function deleteFile(ruta) {
    ruta = ruta.replace(/.*\/(imgProductos\/.*)/, "/$1");
    try {
        fs.removeSync(path.join(__dirname, `../public/${ruta}`));
        console.log("File removed");
        return true;
    } catch (error) {
        console.log("Hubo un error en eliminar el archivo", error.message);
        return { error: ` Hubo un error a la hora de borrar la imagen: ${error.message}` };
    }
}
