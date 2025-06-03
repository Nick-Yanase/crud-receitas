import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | undefined;

export async function conectar() {
  if (!db) {
    db = await SQLite.openDatabaseAsync('Receitas.db');
    await db.execAsync('PRAGMA journal_mode = WAL');
  }
  return db;
}
