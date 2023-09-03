// Clases importadas
import ContenedorFirebase from '../../contenedores/ContenedorFirebase.js';
import ProductoDaoFirebase from '../productos/ProductosDaoFirebase.js';

// Generador de hora
const today = new Date();

// Generador de id
import { v4 as uuidv4 } from 'uuid';

// Instancia de productos

const archivoProductos = new ProductoDaoFirebase();

class CarritoDaoArchivo extends ContenedorFirebase {
    // Ruta del archivo de productos

    constructor() {
        super('carrito');
    }

    // Método modificado para la el archivo carrito

    async nuevo(carrito = { productos: [] }) {
        return await super.nuevo(carrito);
    }

    // Método para ver los productos del carrito

    async verProductos(id) {
        try {
            let objeto = await super.listar(id);
            if (objeto.productos.length > 0) {
                return objeto.productos;
            } else {
                return { error: 'No hay productos asociados a esa id' };
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    // Método para agregar productos a un carrito por su ID

    async guardarProducto(idCarrito, idProducto) {
        try {
            let carrito = await super.listar(idCarrito);
            const producto = await archivoProductos.listar(idProducto);

            if (Object.values(producto).length > 1 && Object.values(carrito).length > 1) {
                const now = today.toLocaleString();
                producto.id = uuidv4();
                producto.timestamp = now;
                carrito.productos.push(producto);
                super.modificar(idCarrito, carrito);
                return true;
            } else {
                return { error: 'No se pudo agregar el producto al carrito' };
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    // Método para borrar productos

    async borrarProducto(idCarrito, idProducto) {
        try {
            let carrito = await super.listar(idCarrito);
            let producto = 0;

            if (Object.values(carrito).length > 1) {
                [producto] = await carrito.productos.filter((item) => item.id === idProducto);
            } else {
                return { error: `El carrito con la id: ${idCarrito} no existe` };
            }

            if (!producto == null) {
                const posProducto = await carrito.productos.indexOf(producto);
                carrito.productos.splice(posProducto, 1);
                super.modificar(idCarrito, carrito);
                return true;
            } else {
                return {
                    error: `No se pudo borrar el producto del carrito el producto con el id: ${idProducto} no se encuentra`,
                };
            }
        } catch (error) {
            console.log(error.message);
        }
    }
}

export default CarritoDaoArchivo;
