import mongoose, { Schema } from "mongoose";

const productos = new Schema({
    timestamp: { type: String, require: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true, index: true },
    img: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    colors: { type: [String], default: [] },
    sizes: { type: [String], default: [] },
});

export default mongoose.model("productos", productos);
