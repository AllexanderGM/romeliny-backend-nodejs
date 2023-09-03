// Importando dependencias
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// generador de hora
const today = new Date();

// generador de id
import randomId from 'random-id';

// Ruta del archivo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(__dirname);
class ContenedorArchivo {
    constructor(archivo) {
        this.archivo = path.join(__filename, '..', '../db/Archivo', archivo);
    }

    leerArchivo() {
        try {
            const data = fs.readFileSync(this.archivo, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.log('No se puede leer el archivo', error.message);
        }
    }

    verificarExistencia() {
        return this.leerArchivo().length > 0;
    }

    // Método que obtiene un objeto por su ID

    async listar(id) {
        try {
            let data = await this.leerArchivo();
            const [objeto] = data.filter((item) => item.id === id);
            if (this.verificarExistencia() && objeto) {
                return objeto;
            } else {
                return { error: `No se encuentra el id: ${id}` };
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    // Método que obtiene todos los objetos

    async listarTodos() {
        try {
            if (this.verificarExistencia()) {
                let data = await this.leerArchivo();
                return data;
            } else {
                return { error: 'el archivo está vacio' };
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    // Método que crea un nuevo objeto

    async nuevo(objeto) {
        try {
            let data = await this.leerArchivo();
            const hora = today.toLocaleString();
            const nuevoObjeto = {
                id: randomId(8, 'aA0'),
                timestamp: hora,
                ...objeto,
            };
            data.push(nuevoObjeto);
            fs.writeFileSync(this.archivo, JSON.stringify(data, '', 4), 'utf-8');
            return data[data.length - 1].id;
        } catch (error) {
            return { error: `No se pudo crear el objeto: ${error.message}` };
        }
    }

    // Método que modifica algun objeto por su ID

    async modificar(id, nuevoObjeto) {
        try {
            let data = await this.leerArchivo();
            const [objeto] = data.filter((item) => item.id === id);
            const posObjeto = data.indexOf(objeto);
            const now = today.toLocaleString();
            if (this.verificarExistencia() && objeto) {
                data[posObjeto] = {
                    id: id,
                    timestamp: now,
                    ...nuevoObjeto,
                };
                fs.writeFileSync(this.archivo, JSON.stringify(data, '', 4), 'utf-8');
                return true;
            } else {
                return { error: 'No se encuentra el objeto' };
            }
        } catch (error) {
            return { error: `hubo un error al modificar un objeto ${error.message}` };
        }
    }

    // Nétodo que borra un objeto por su ID

    async borrar(id) {
        try {
            let data = await this.leerArchivo();
            const [objeto] = data.filter((item) => item.id === id);
            const posObjeto = data.indexOf(objeto);
            if (this.verificarExistencia() && objeto) {
                data.splice(posObjeto, 1);
                fs.writeFileSync(this.archivo, JSON.stringify(data, '', 4), 'utf-8');
                return true;
            } else {
                return { error: 'No se pudo borrar el objeto' };
            }
        } catch (error) {
            return { error: `No se pudo borrar el objeto ${error.message}` };
        }
    }
}

export default ContenedorArchivo;
