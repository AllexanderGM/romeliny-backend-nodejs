// Importando dependencias
import mongoose from "mongoose";

mongoose.set("strictQuery", false);

// generador de id
import { v4 as uuidv4 } from "uuid";

// generador de hora
const today = new Date();

class ContenedorMongoDB {
    constructor(schema) {
        this.connect();
        this.schema = schema;
    }

    // Metodo para Conectarse a la base de datos
    connect() {
        try {
            const URI = process.env.MONGO_CLOUD_URL;
            mongoose.connect(URI);
            console.log("Conectado a la Base de datos MongoDb");
        } catch (error) {
            console.log("hubo un error en la conección a la base de datos", error.message);
        }
    }

    // Metodo para obtener Item por iD
    async listar(id) {
        try {
            const result = await this.schema.find({ _id: id }, { __v: 0 });
            return result[0];
        } catch (error) {
            return { error: `No se encuentra el id: ${id}` };
        }
    }

    // Metodo para obtener todos los Item
    async listarTodos() {
        try {
            const result = await this.schema.find({}, { __v: 0 });
            return result;
        } catch (error) {
            return { error: "el archivo está vacio" };
        }
    }

    // Metodo para Guardar
    async nuevo(objeto) {
        try {
            const hora = today.toLocaleString();
            const data = this.schema({
                id: uuidv4(),
                timestamp: hora,
                ...objeto,
            });
            const result = await data.save();
            return result;
        } catch (error) {
            return { error: `No se pudo crear el objeto: ${error.message}` };
        }
    }

    // Metodo para Modificar
    async modificar(id, data) {
        try {
            const result = await this.schema.updateOne({ _id: id }, { $set: data });
            return result;
        } catch (error) {
            return { error: `hubo un error al modificar un objeto ${error.message}` };
        }
    }

    // Metodo para borrar
    async borrar(id) {
        try {
            const data = await this.listarTodos();
            if (data.find((item) => item._id.toString() === id)) {
                await this.schema.deleteOne({ _id: id });
                return id;
            } else {
                throw new Error(`no se encontro  el id ${id}`);
            }
        } catch (error) {
            return { error: `No se pudo borrar el objeto ${error.message}` };
        }
    }
}

export default ContenedorMongoDB;
