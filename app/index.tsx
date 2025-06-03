import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Receita } from "../models/Receita";
import { criarTabela, listarReceitas } from "../services/ReceitaService";
import ReceitaCard from "@/components/ReceitaCard";

const Home = () => {
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [filtro, setFiltro] = useState("");
  const [receitasFiltradas, setReceitasFiltradas] = useState<Receita[]>([]);

  const isFocused = useIsFocused();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      await criarTabela();
    })();
  }, []);

  useEffect(() => {
    carregarReceitas();
  }, [isFocused]);

  useEffect(() => {
    aplicarFiltro();
  }, [filtro, receitas]);

  const carregarReceitas = async () => {
    try {
      const dados = await listarReceitas();
      setReceitas(dados);
    } catch (error) {
      console.log("Erro ao carregar receitas:", error);
    }
  };

  const aplicarFiltro = () => {
    if (filtro.trim() === "") {
      setReceitasFiltradas(receitas);
    } else {
      const texto = filtro.toLowerCase();
      const filtradas = receitas.filter(
        (r) =>
          r.nome.toLowerCase().includes(texto) ||
          r.descricao?.toLowerCase().includes(texto)
      );
      setReceitasFiltradas(filtradas);
    }
  };

  const renderItem = ({ item }: { item: Receita }) => (
    <ReceitaCard item={item} />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Minhas Receitas</Text>

      <TextInput
        style={styles.input}
        placeholder="Buscar receita..."
        placeholderTextColor="#999"
        value={filtro}
        onChangeText={setFiltro}
      />

      {receitasFiltradas.length === 0 ? (
        <Text style={styles.semReceitas}>Nenhuma receita encontrada.</Text>
      ) : (
        <FlatList
          data={receitasFiltradas}
          keyExtractor={(item) => item.nome}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      <TouchableOpacity
        style={styles.botaoAdicionar}
        onPress={() => router.push("/addRecipe")}
      >
        <Text style={styles.textoBotao}>+ Nova Receita</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    elevation: 3,
  },
  imagem: {
    width: 100,
    height: 100,
  },
  input: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#333",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },  
  imagemPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    color: "#666",
    fontSize: 12,
  },
  info: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  descricao: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  semReceitas: {
    textAlign: "center",
    color: "#999",
    marginTop: 40,
    fontSize: 16,
  },
  botaoAdicionar: {
    backgroundColor: "#2E8B57",
    padding: 16,
    borderRadius: 50,
    position: "absolute",
    bottom: 100,
    right: 20,
    elevation: 5,
  },
  textoBotao: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
