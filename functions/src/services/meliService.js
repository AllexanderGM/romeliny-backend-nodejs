// meliService.js
import HandlerServices from "../handlers/services.handler.js";

export default class MeliService {
    constructor() {
        this.MELI_SELLER_ID = process.env.MELI_SELLER_ID;
        this.MELI_API = process.env.MELI_API;
        this.handler = new HandlerServices("MercadoLibre");
    }

    // Verifica el servicio de MercadoLibre.
    async checkMeliService() {
        const nameMethod = "verifica servicio";

        return await this.handler.execute(nameMethod, async () => {
            const data = await this.getUserData();
            if (!data.status) throw new Error("servicio no disponible");
            return "servicio disponible";
        });
    }

    // Obtener datos del usuario
    async getUserData() {
        const nameMethod = "obtener datos de usuario";
        const apiUrl = `${this.MELI_API}/sites/MCO/search?seller_id=${this.MELI_SELLER_ID}`;

        return await this.handler.execute(nameMethod, async () => {
            const data = await this.fetchGet(apiUrl);
            if (data.seller === undefined) throw new Error("no se encuentra el usuario");
            return data.seller;
        });
    }

    // Obtener los filtros de un usuario
    async getUserFilters() {
        const nameMethod = "obtener filtros de usuario";
        const apiUrl = `${this.MELI_API}/sites/MCO/search?seller_id=${this.MELI_SELLER_ID}`;

        return await this.handler.execute(nameMethod, async () => {
            const data = await this.fetchGet(apiUrl);
            if (data.available_filters.length <= 0) throw new Error("no se encuentran filtros");
            return data.available_filters;
        });
    }

    // Obtener todos los productos
    async getAllProducts() {
        const nameMethod = "obtener productos";
        const apiUrl = `${this.MELI_API}/sites/MCO/search?seller_id=${this.MELI_SELLER_ID}`;

        return await this.handler.execute(nameMethod, async () => {
            const data = await this.fetchGet(apiUrl);
            if (data.results.length <= 0) throw new Error("no se encuentran productos");
            return data.results;
        });
    }

    // Obtener un producto por ID
    async getProductById(id) {
        const nameMethod = "obtener producto por ID";
        const apiUrl = `${this.MELI_API}/items/${id}`;

        return await this.handler.execute(nameMethod, async () => {
            const data = await this.fetchGet(apiUrl);
            if (data.id === undefined) throw new Error("no se encuentra el producto");
            return data;
        });
    }

    // Obtener las categorías de un producto
    async getProductCategories(id) {
        const nameMethod = "obtener categorías de producto";
        const apiUrl = `${this.MELI_API}/categories/${id}`;

        return await this.handler.execute(nameMethod, async () => {
            const data = await this.fetchGet(apiUrl);
            if (data.id === undefined) throw new Error("no se encuentra las categorías del producto");
            return data;
        });
    }

    // Función para realizar solicitudes GET
    async fetchGet(url) {
        const requestOptions = {
            method: "GET",
            redirect: "follow",
        };

        const response = await fetch(url, requestOptions);
        if (!response.ok) throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
        return response.json();
    }
}
