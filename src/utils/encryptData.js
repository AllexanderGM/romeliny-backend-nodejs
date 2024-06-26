import CryptoJS from "crypto-js";

class EncryptData {
    static algorithm = process.env.ALGORITHM;
    static key = process.env.KEY;
    static iv = process.env.IV;

    // Encriptar datos
    static async encrypt(data) {
        try {
            const encrypted = CryptoJS.AES.encrypt(data, EncryptData.key, {
                iv: CryptoJS.enc.Hex.parse(EncryptData.iv),
            }).toString();
            return encrypted;
        } catch (error) {
            console.error("Error al encriptar:", error);
            throw error;
        }
    }

    // Desencriptar datos
    static async decrypt(encryptedData) {
        console.log("Encrypted data:", encryptedData);

        try {
            const bytes = CryptoJS.AES.decrypt(encryptedData, EncryptData.key, {
                iv: CryptoJS.enc.Hex.parse(EncryptData.iv),
            });

            console.log("Decrypted bytes:", bytes.toString());

            const decrypted = bytes.toString(CryptoJS.enc.Utf8);
            return decrypted;
        } catch (error) {
            console.error("Error al desencriptar:", error);
            return null;
        }
    }

    // Encriptar JSON
    static async encryptJSON(data) {
        try {
            return this.encrypt(JSON.stringify(data));
        } catch (error) {
            console.error("Error al encriptar JSON:", error);
            throw error;
        }
    }

    // Desencriptar JSON
    static async decryptJSON(data) {
        try {
            return JSON.parse(await this.decrypt(data));
        } catch (error) {
            console.error("Error al desencriptar JSON:", error);
            return error;
        }
    }
}

export default EncryptData;
