import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Receita } from "../../models/Receita"; // Ajuste o caminho conforme seu projeto
import { listarReceitas } from "../../services/ReceitaService";

const Home = () => {
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const isFocused = useIsFocused();
  const router = useRouter();

  useEffect(() => {
    carregarReceitas();
  }, [isFocused]);

  const carregarReceitas = async () => {
    try {
      const dados = await listarReceitas();
      setReceitas(dados);
    } catch (error) {
      console.log("Erro ao carregar receitas:", error);
    }
  };

  const renderItem = ({ item }: { item: Receita }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        if (item.id) {
          router.push({
            pathname: "/addRecipe",
            params: { id: item.id.toString() },
          });
        }
      }}
    >
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.imagem} />
      ) : (
        <View style={styles.imagemPlaceholder}>
          <Text style={styles.placeholderText}>Sem imagem</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.titulo}>{item.nome}</Text>
        <Text style={styles.descricao} numberOfLines={2}>
          {item.descricao}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Minhas Receitas</Text>

      {receitas.length === 0 ? (
        <Text style={styles.semReceitas}>Nenhuma receita cadastrada.</Text>
      ) : (
        <FlatList
          data={receitas}
          keyExtractor={(item) => item.nome}
          renderItem={renderItem} //pode ser trocado por um componente
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
    bottom: 30,
    right: 20,
    elevation: 5,
  },
  textoBotao: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
