import mongoose, { Schema } from 'mongoose';

const carrito = new Schema({
    id: { type: String, require: true },
    timestamp: { type: String, required: true },
    products: { type: [], required: true },
});

export default mongoose.model('carrito', carrito);
