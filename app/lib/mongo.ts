import { MongoClient } from "mongodb";

// Verifica si la URI está configurada
if (!process.env.MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable inside .env.local");
}

const uri = process.env.MONGO_URI;
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

// Declarar cliente y promesa de cliente
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Declarar global para TypeScript
declare global {
  // Extiende globalThis para incluir _mongoClientPromise
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Conectar al cliente de MongoDB
if (process.env.NODE_ENV === "development") {
  // Usa una variable global para almacenar la promesa en desarrollo
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options as any);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // En producción, no usar global para evitar conflictos
  client = new MongoClient(uri, options as any);
  clientPromise = client.connect();
}

export default clientPromise;
