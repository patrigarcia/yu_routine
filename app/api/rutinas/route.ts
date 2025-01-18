import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../lib/mongo';
import { MongoClient } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    // Conectar a MongoDB
    const client: MongoClient = await clientPromise;
    
    // Obtener la base de datos
    const db = client.db('rutinasDB'); 
    
    // Probar la conexión listando colecciones
    const collections = await db.listCollections().toArray();
    
    return NextResponse.json({
      status: 'success',
      message: 'Conexión a MongoDB establecida correctamente',
      collectionsCount: collections.length,
      collections: collections.map(col => col.name)
    }, { status: 200 });
  } catch (error) {
    console.error('Error en la conexión a MongoDB:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'No se pudo conectar a MongoDB',
      errorDetails: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const client: MongoClient = await clientPromise;
    const db = client.db('rutinasDB'); 
    
    const body = await request.json();

    const result = await db.collection("rutinas").insertOne(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error al insertar documento:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'No se pudo insertar el documento',
      errorDetails: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}
