import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Receita } from "../../models/Receita";
import {
  buscarReceitaPorId,
  excluirReceita,
  salvarReceita,
} from "../../services/ReceitaService";

export default function AddRecipe() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [ingredientes, setIngredientes] = useState("");
  const [passoAPasso, setPassoAPasso] = useState("");
  const [imagem, setImagem] = useState("");

  useEffect(() => {
    if (id) {
      carregarReceita();
    }
  }, [id]);

  const carregarReceita = async () => {
    try {
      const receita = await buscarReceitaPorId(Number(id));
      if (receita) {
        setNome(receita.nome);
        setDescricao(receita.descricao);
        setIngredientes(receita.ingredientes.join(", "));
        setPassoAPasso(receita.passo_a_passo.join(", "));
        setImagem(receita.image || "");
      }
    } catch (error) {
      console.log("Erro ao carregar receita:", error);
    }
  };

  const handleSalvar = async () => {
    if (!nome.trim()) {
      Alert.alert("Erro", "Preencha o nome da receita");
      return;
    }

    const novaReceita: Receita = {
      id: id ? Number(id) : undefined,
      nome,
      descricao,
      tempo_total: "",
      ingredientes: ingredientes.split(",").map((item) => item.trim()),
      passo_a_passo: passoAPasso.split(",").map((item) => item.trim()),
      image: imagem,
    };

    try {
      await salvarReceita(novaReceita);

      router.back();
    } catch (error) {
      console.log("Erro ao salvar receita:", error);
    }
  };
  // const limparFormulario = () => {
  //   setNome('');
  //   setDescricao('');
  //   setTempoTotal('');
  //   setIngredientes(['']);
  //   setPassoAPasso(['']);
  //   setImageUri(null);
  // };

  const handleExcluir = () => {
    Alert.alert("Confirmar", "Deseja realmente excluir essa receita?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await excluirReceita(Number(id));
            router.back();
          } catch (error) {
            console.log("Erro ao excluir:", error);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>
        {id ? "Editar Receita" : "Nova Receita"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
      />

      <TextInput
        style={styles.input}
        placeholder="Ingredientes (separados por vírgula)"
        value={ingredientes}
        onChangeText={setIngredientes}
      />

      <TextInput
        style={styles.input}
        placeholder="Passo a passo (separado por vírgula)"
        value={passoAPasso}
        onChangeText={setPassoAPasso}
      />

      <TextInput
        style={styles.input}
        placeholder="URL da imagem (opcional)"
        value={imagem}
        onChangeText={setImagem}
      />

      <TouchableOpacity style={styles.botaoSalvar} onPress={handleSalvar}>
        <Text style={styles.textoBotao}>Salvar</Text>
      </TouchableOpacity>

      {id && (
        <TouchableOpacity style={styles.botaoExcluir} onPress={handleExcluir}>
          <Text style={styles.textoBotao}>Excluir</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#FFF",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#F8F8F8",
  },
  botaoSalvar: {
    backgroundColor: "#2E8B57",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  botaoExcluir: {
    backgroundColor: "#B22222",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  textoBotao: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
