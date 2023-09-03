let Carrito;
let Producto;
switch (process.env.DATABASE) {
    case "archivo":
        const { default: CarritosDaoArchivo } = await import("./carritos/CarritoDaoArchivo.js");
        const { default: ProductosDaoArchivo } = await import("./productos/ProductosDaoArchivo.js");
        Producto = new ProductosDaoArchivo();
        Carrito = new CarritosDaoArchivo();
        break;
    case "mongodb":
        const { default: CarritosDaosMongoDb } = await import("./carritos/CarritoDaoMongoDb.js");
        Carrito = new CarritosDaosMongoDb();
        const { default: ProductosDaosMongoDB } = await import("./productos/ProductosDaoMongoDB.js");
        Producto = new ProductosDaosMongoDB();
        Carrito.connect();
        break;
    case "firebase":
        const { default: CarritosDaosFirebase } = await import("./carritos/CarritoDaoFirebase.js");
        Carrito = new CarritosDaosFirebase();
        const { default: ProductosDaosFirebase } = await import("./productos/ProductosDaoFirebase.js");
        Producto = new ProductosDaosFirebase();
        break;
    default:
        const { default: CarritoDaoMem } = await import("./carritos/CarritoDaoMen.js");
        Carrito = new CarritoDaoMem();
        const { default: ProductosDaoMen } = await import("./productos/ProductosDaoMen.js");
        Producto = new ProductosDaoMen();
        break;
}
export { Carrito, Producto };
