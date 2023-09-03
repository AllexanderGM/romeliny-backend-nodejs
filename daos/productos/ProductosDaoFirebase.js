// Clases importadas
import ContenedorFirebase from '../../contenedores/ContenedorFirebase.js';

class ProductosDaoArchivo extends ContenedorFirebase {
    // Ruta del archivo de productos
    constructor() {
        super('productos');
    }
}

export default ProductosDaoArchivo;
