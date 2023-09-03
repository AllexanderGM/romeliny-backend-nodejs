import mongoose from "mongoose";
const Schema = mongoose.Schema;

const user = new Schema({
    email: { type: String, require: true },
    fullname: { type: String, require: true },
    adress: { type: String, require: true },
    phone: { type: String, require: true },
    age: { type: Number, require: true },
    avatar: { type: String, require: true },
    admin: { type: Boolean, require: true },
    password: { type: String, require: true },
});

export default mongoose.model("user", user);
