import mongoose, { Schema } from "mongoose";

const productos = new Schema({
    timestamp: { type: String, require: true },
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    codigo: { type: Number, required: true, index: true },
    foto: { type: String, required: true },
    precio: { type: Number, required: true },
    stock: { type: Number, required: true },
});

export default mongoose.model("productos", productos);
