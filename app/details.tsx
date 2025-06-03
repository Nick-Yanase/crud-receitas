import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import { buscarReceitaPorId } from "../services/ReceitaService";
import { Receita } from "../models/Receita";

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [receita, setReceita] = useState<Receita | null>(null);

  useEffect(() => {
    if (id) {
      carregarReceita();
    }
  }, [id]);

  const carregarReceita = async () => {
    try {
      const data = await buscarReceitaPorId(Number(id));
      setReceita(data);
    } catch (error) {
      console.log("Erro ao carregar detalhes:", error);
    }
  };

  if (!receita) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {receita.image ? (
        <Image source={{ uri: receita.image }} style={styles.imagem} />
      ) : null}

      <Text style={styles.nome}>{receita.nome}</Text>
      <Text style={styles.tempo}>⏱️ {receita.tempo_total || "Tempo não informado"}</Text>
      <Text style={styles.descricao}>{receita.descricao}</Text>

      <Text style={styles.subtitulo}>Ingredientes:</Text>
      {receita.ingredientes.map((item, index) => (
        <Text key={index} style={styles.item}>- {item}</Text>
      ))}

      <Text style={styles.subtitulo}>Modo de preparo:</Text>
      {receita.passo_a_passo.map((passo, index) => (
        <Text key={index} style={styles.item}>{index + 1}. {passo}</Text>
      ))}

      <TouchableOpacity 
        style={styles.botaoEditar}
        onPress={() => router.push({ pathname: "/addRecipe", params: { id: receita.id } })}
      >
        <Text style={styles.textoBotao}>Editar Receita</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  imagem: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  nome: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  tempo: {
    fontSize: 16,
    color: "#555",
    marginBottom: 12,
  },
  descricao: {
    fontSize: 16,
    marginBottom: 12,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  item: {
    fontSize: 14,
    marginBottom: 4,
  },
  botaoEditar: {
    backgroundColor: "#2E8B57",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  textoBotao: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
