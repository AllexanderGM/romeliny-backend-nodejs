import HandlerController from "../handlers/controllers.handler.js";
import MeliService from "../services/meliService.js";

class ProductsController {
    static handler = new HandlerController("información general");

    // Obtener todos los productos
    static async getAllProducts() {
        const nameMethod = "Obtener productos";

        return await this.handler.execute(nameMethod, async () => {
            const service = await MeliService.getAllProducts();
            if (!service.status) throw new Error("no se obtuvieron los productos");
            const products = service.data;

            return products.map((product) => {
                const variations = Object.values(product.variations_data).map(formatVariation);
                const attributes = product.attributes.map(formatAttributes).filter((attribute) => attribute !== null);

                return {
                    id: product.id,
                    img: product.thumbnail,
                    name: product.title,
                    price: product.price,
                    stock: product.available_quantity,
                    condition: product.condition,
                    variations,
                    attributes,
                };
            });
        });
    }

    // Obtener un solo producto por ID
    static async getProductById(id) {
        const nameMethod = "Obtener productos";
        const idRegex = /^MCO\d+$/;

        return await this.handler.execute(nameMethod, async () => {
            if (!idRegex.test(id)) throw new Error("ID de producto inválido");

            const service = await MeliService.getProductById(id);
            if (!service.status) throw new Error("no se encontró el producto");

            const product = service.data;
            const guaranty = product.sale_terms.map(formatGuaranty).filter((guaranty) => guaranty !== null);
            const attributes = product.attributes.map(formatAttributes).filter((attribute) => attribute !== null);

            return {
                id: product.id,
                status: product.status,
                name: product.title,
                price: product.price,
                stock: product.initial_quantity,
                condition: product.condition,
                meli_permalink: product.permalink,
                video: product.video_id,
                accepts_mercadopago: product.accepts_mercadopago,
                variations: product.variations,
                guaranty,
                attributes,
            };
        });
    }
}

/* --------- UTILIDADES --------- */

// Formatear variaciones
function formatVariation(variation) {
    return {
        name: variation.name,
        img: variation.thumbnail,
        num_pictures: variation.pictures_qty,
        attributes: variation.attributes,
    };
}

// Formatear atributos
function formatAttributes(attribute) {
    const attributesKeys = [
        "AGE_GROUP",
        "BRAND",
        "GENDER",
        "ITEM_CONDITION",
        "MODEL",
        "FOOTWEAR_MATERIAL",
        "OUTSOLE_MATERIAL",
    ];
    const values = attribute.values.map((value) => value.name);

    return attributesKeys.includes(attribute.id) ? { id: attribute.id, name: attribute.name, value: values } : null;
}

// Formatear garantía
function formatGuaranty(guaranty) {
    const attributesKeys = ["WARRANTY_TYPE", "WARRANTY_TIME"];
    const values = guaranty.values.map((value) => ({ type: value.name, value: value.value_name }));

    return attributesKeys.includes(guaranty.id) ? { id: guaranty.id, name: guaranty.name, value: values } : null;
}

export default ProductsController;
