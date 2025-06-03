export interface Receita {
  id?: number;
  nome: string;
  descricao: string;
  tempo_total: string;
  ingredientes: string[];
  passo_a_passo: string[];
  image: string;
}
