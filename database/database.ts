import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export async function conectar() {
  if (db) {
    return db;
  }

  try {
    db = await SQLite.openDatabaseAsync('Receitas.db');
    await db.execAsync('PRAGMA journal_mode = WAL');
    console.log('Banco conectado com sucesso');
    return db;
  } catch (error) {
    console.error('Erro ao conectar com o banco:', error);
    throw error;
  }
}

export async function desconectar() {
  if (db) {
    await db.closeAsync();
    console.log('Banco desconectado');
    db = null;
  }
}
