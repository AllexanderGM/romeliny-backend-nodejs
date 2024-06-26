import process from "process";
import fetch from "node-fetch";

import HandlerServices from "../handlers/services.handler.js";

class MeliService {
    // Configuración estática
    static MELI_SELLER_ID = process.env.MELI_SELLER_ID;
    static MELI_AUTH_URL = process.env.MELI_AUTH_URL;
    static MELI_API = process.env.MELI_API;
    static MELI_APP_ID = process.env.MELI_APP_ID;
    static MELI_CLIENT_SECRET = process.env.MELI_CLIENT_SECRET;
    static MELI_REDIRECT_URI = process.env.MELI_REDIRECT_URI;
    static MELI_CODE = process.env.MELI_CODE;

    static CONTEXT = "MercadoLibre";
    static handler = new HandlerServices(this.CONTEXT);

    // Verifica el servicio de MercadoLibre.
    static async checkMeliService() {
        const nameMethod = "verifica servicio";

        return await this.handler.execute(nameMethod, async () => {
            const data = await this.getUserData();
            if (!data.status) throw new Error("servicio no disponible");
            return "servicio disponible";
        });
    }

    // Obtener datos del usuario
    static async getUserData() {
        const nameMethod = "obtener datos de usuario";
        const apiUrl = `${this.MELI_API}/sites/MCO/search?seller_id=${this.MELI_SELLER_ID}`;

        return await this.handler.execute(nameMethod, async () => {
            const data = await this.fetchGet(apiUrl);
            if (data.seller === undefined) throw new Error("no se encuentra el usuario");
            return data.seller;
        });
    }

    // Obtener los filtros de un usuario
    static async getUserFilters() {
        const nameMethod = "obtener filtros de usuario";
        const apiUrl = `${this.MELI_API}/sites/MCO/search?seller_id=${this.MELI_SELLER_ID}`;

        return await this.handler.execute(nameMethod, async () => {
            const data = await this.fetchGet(apiUrl);
            if (data.available_filters.length <= 0) throw new Error("no se encuentran filtros");
            return data.available_filters;
        });
    }

    // Obtener todos los productos
    static async getAllProducts() {
        const nameMethod = "obtener productos";
        const apiUrl = `${this.MELI_API}/sites/MCO/search?seller_id=${this.MELI_SELLER_ID}`;

        return await this.handler.execute(nameMethod, async () => {
            const data = await this.fetchGet(apiUrl);
            if (data.results.length <= 0) throw new Error("no se encuentran productos");
            return data.results;
        });
    }

    // Obtener un producto por ID
    static async getProductById(id) {
        const nameMethod = "obtener producto por ID";
        const apiUrl = `${this.MELI_API}/items/${id}`;

        return await this.handler.execute(nameMethod, async () => {
            const data = await this.fetchGet(apiUrl);
            if (data.id === undefined) throw new Error("no se encuentra el producto");
            return data;
        });
    }

    // Obtener las categorías de un producto
    static async getProductCategories(id) {
        const nameMethod = "obtener categorías de producto";
        const apiUrl = `${this.MELI_API}/categories/${id}`;

        return await this.handler.execute(nameMethod, async () => {
            const data = await this.fetchGet(apiUrl);
            if (data.id === undefined) throw new Error("no se encuentra las categorías del producto");
            return data;
        });
    }

    /* --------- UTILIDADES --------- */

    // Función para realizar solicitudes GET
    static async fetchGet(url) {
        const requestOptions = {
            method: "GET",
            redirect: "follow",
        };

        const response = await fetch(url, requestOptions);
        if (!response.ok) throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
        return response.json();
    }
}

export default MeliService;
