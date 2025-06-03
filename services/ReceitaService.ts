import { conectar } from '../database/database';
import { Receita } from '../models/Receita';

type ReceitaDB = {
  id: number;
  nome: string;
  descricao: string;
  tempo_total: string;
  ingredientes: string;
  passo_a_passo: string;
  imagem: string;
};

export async function criarTabela() {
  const database = await conectar();
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS receitas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      descricao TEXT,
      tempo_total TEXT,
      ingredientes TEXT,
      passo_a_passo TEXT,
      imagem TEXT
    );
  `);
}

export async function inserirReceita(receita: Receita) {
  const db = await conectar();
  await db.runAsync(
    `INSERT INTO receitas (nome, descricao, tempo_total, ingredientes, passo_a_passo, imagem) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      receita.nome,
      receita.descricao,
      receita.tempo_total,
      JSON.stringify(receita.ingredientes),
      JSON.stringify(receita.passo_a_passo),
      receita.image,
    ]
  );
}

export async function listarReceitas(): Promise<Receita[]> {
  const db = await conectar();
  const resultado = await db.getAllAsync(`SELECT * FROM receitas`);

  return (resultado as ReceitaDB[]).map(item => ({
    id: item.id,
    nome: item.nome,
    descricao: item.descricao,
    tempo_total: item.tempo_total,
    ingredientes: JSON.parse(item.ingredientes),
    passo_a_passo: JSON.parse(item.passo_a_passo),
    image: item.imagem,
  }));
}

export async function buscarReceitaPorId(id: number): Promise<Receita | null> {
  const db = await conectar();
  const resultado = await db.getFirstAsync(`SELECT * FROM receitas WHERE id = ?`, [id]);

  if (!resultado) {
    return null;
  }

  const item = resultado as ReceitaDB;

  return {
    id: item.id,
    nome: item.nome,
    descricao: item.descricao,
    tempo_total: item.tempo_total,
    ingredientes: JSON.parse(item.ingredientes),
    passo_a_passo: JSON.parse(item.passo_a_passo),
    image: item.imagem,
  };
}

export async function atualizarReceita(id: number, receita: Receita) {
  const db = await conectar();
  await db.runAsync(
    `UPDATE receitas 
     SET nome = ?, descricao = ?, tempo_total = ?, ingredientes = ?, passo_a_passo = ?, imagem = ? 
     WHERE id = ?`,
    [
      receita.nome,
      receita.descricao,
      receita.tempo_total,
      JSON.stringify(receita.ingredientes),
      JSON.stringify(receita.passo_a_passo),
      receita.image,
      id,
    ]
  );
}

export async function salvarReceita(receita: Receita) {
  if (receita.id) {
    await atualizarReceita(receita.id, receita);
  } else {
    await inserirReceita(receita);
  }
}

export async function excluirReceita(id: number) {
  const db = await conectar();
  await db.runAsync(`DELETE FROM receitas WHERE id = ?`, [id]);
}
