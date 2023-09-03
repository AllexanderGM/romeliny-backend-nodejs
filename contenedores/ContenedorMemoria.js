// generador de hora
const today = new Date();

// generador de id
import { v4 as uuidv4 } from 'uuid';

class ContenedorMemoria {
    constructor() {
        this.archivo = [];
    }

    verificarExistencia() {
        {
            return this.archivo.length > 0;
        }
    }

    // Método que obtiene un objeto por su ID

    async listar(id) {
        try {
            const objeto = this.archivo.filter((item) => item.id === id);
            return objeto;
        } catch (error) {
            return { error: `No se encuentra el id: ${id} ${error.message}` };
        }
    }

    // Método que obtiene todos los objetos

    async listarTodos() {
        if (this.archivo.length > 0) {
            return this.archivo;
        } else {
            return { error: 'el archivo está vacio' };
        }
    }

    // Método que crea un nuevo objeto

    async nuevo(objeto) {
        try {
            const hora = today.toLocaleString();
            const nuevoObjeto = {
                id: uuidv4(),
                timestamp: hora,
                ...objeto,
            };
            this.archivo.push(nuevoObjeto);
            return nuevoObjeto.id;
        } catch (error) {
            return { error: `no se pudo agregar el archivo ${error.message}` };
        }
    }

    // Método que modifica algun objeto por su ID

    async modificar(id, nuevoObjeto) {
        try {
            const [objeto] = this.archivo.filter((item) => item.id === id);
            const posObjeto = this.archivo.indexOf(objeto);
            const now = today.toLocaleString();
            if (this.verificarExistencia() && objeto) {
                this.archivo[posObjeto] = {
                    id: id,
                    timestamp: now,
                    ...nuevoObjeto,
                };
                return true;
            } else {
                return { error: 'No se encuentra el objeto' };
            }
        } catch (error) {
            return { error: `Ocurrio un error en modificar el archivo ${error.message}` };
        }
    }

    async borrar(id) {
        try {
            const [objeto] = this.archivo.filter((item) => item.id === id);
            const posObjeto = this.archivo.indexOf(objeto);
            if (this.verificarExistencia() && objeto) {
                this.archivo.splice(posObjeto, 1);
                return true;
            } else {
                return { error: 'No se pudo borrar el objeto' };
            }
        } catch (error) {
            console.log(error.message);
        }
    }
}

export default ContenedorMemoria;
