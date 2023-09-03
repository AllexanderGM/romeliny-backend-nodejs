// Clases importadas
import ContenedorArchivo from '../../contenedores/ContenedorArchivo.js';

class ProductosDaoArchivo extends ContenedorArchivo {
    // Ruta del archivo de productos
    constructor() {
        super('productos.json');
    }
}

export default ProductosDaoArchivo;
