import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { Receita } from "../models/Receita";

type Props = {
  item: Receita;
};

const ReceitaCard = ({ item }: Props) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        if (item.id) {
          router.push({
            pathname: "/details",
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
};

export default ReceitaCard;

const styles = StyleSheet.create({
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
});
