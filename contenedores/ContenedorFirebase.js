// Importando dependencias
import FirebaseAdmin from 'firebase-admin';
import path from 'path';
import { fileURLToPath } from 'url';

// generador de hora
const today = new Date();

// generador de id
import { v4 as uuidv4 } from 'uuid';

// Ruta del archivo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccount = path.join(__dirname, '../db/Firebase/', process.env.FIREBASE_CERT_PATH);

FirebaseAdmin.initializeApp({
    credential: FirebaseAdmin.credential.cert(serviceAccount),
});

console.log('Conectados a Firebase!');

class ContenedorFirebase {
    constructor(coleccion) {
        this.coleccion = coleccion;
    }

    // Método que obtiene un objeto por su ID

    async listar(id) {
        try {
            const db = FirebaseAdmin.firestore();
            const query = db.collection(this.coleccion);
            const snapshot = await query.where('id', '==', id).get();
            if (!snapshot.empty) {
                return snapshot.docs[0].data();
            } else {
                return { error: `El documento con el id: ${id} no encontrado` };
            }
        } catch (error) {
            return { error: `error al leer la base de datos, ${error.message}` };
        }
    }

    // Método que obtiene todos los objetos

    async listarTodos() {
        try {
            const db = FirebaseAdmin.firestore();
            const query = db.collection(this.coleccion);
            const querySnapshot = await query.get();
            let docs = querySnapshot.docs;
            const response = docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            return response;
        } catch (error) {
            return { error: `error al leer la base de datos, ${error.message}` };
        }
    }

    // Método que crea un nuevo objeto

    async nuevo(objeto) {
        try {
            const hora = today.toLocaleString();
            const nuevoObjeto = {
                id: uuidv4(),
                timestamp: hora,
                ...objeto,
            };
            const db = FirebaseAdmin.firestore();
            const query = db.collection(this.coleccion);
            let doc = query.doc(uuidv4());
            await doc.create(nuevoObjeto);
            return nuevoObjeto.id;
        } catch (error) {
            return { error: `error al crear en la base de datos, ${error.message}` };
        }
    }

    // Método que modifica algun objeto por su ID

    async modificar(id, nuevoObjeto) {
        try {
            const db = FirebaseAdmin.firestore();
            const query = db.collection(this.coleccion);
            const snapshot = await query.where('id', '==', id).get();
            if (!snapshot.empty) {
                const doc = query.doc(snapshot.docs[0].id);
                await doc.update(nuevoObjeto);
                return true;
            } else {
                return { error: `El documento con el id: ${id} no encontrado` };
            }
        } catch (error) {
            return { error: `error al intentar modificar el objeto con el id ${id}, ${error.message}` };
        }
    }

    // Nétodo que borra un objeto por su ID

    async borrar(id) {
        try {
            const db = FirebaseAdmin.firestore();
            const query = db.collection(this.coleccion);
            const snapshot = await query.where('id', '==', id).get();
            console.log(snapshot.empty);
            if (!snapshot.empty) {
                const doc = query.doc(snapshot.docs[0].id);
                await doc.delete();
                return true;
            } else {
                return { error: `El documento con el id: ${id} no encontrado` };
            }
        } catch (error) {
            return { error: `error al intentar borrar el objeto con el id ${id}, ${error.message}` };
        }
    }
}

export default ContenedorFirebase;
