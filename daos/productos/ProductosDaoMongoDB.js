// Clases importadas
import ContenedorMongoDB from '../../contenedores/ContenedorMongoDB.js';
import UserModel from '../../db/models/modelMongoProductos.js';

class ProductosDaoMongoDB extends ContenedorMongoDB {
    // Ruta del archivo de productos
    constructor() {
        super(UserModel);
    }
}

export default ProductosDaoMongoDB;
