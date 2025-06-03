import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Receita } from "../models/Receita";
import {
  buscarReceitaPorId,
  excluirReceita,
  salvarReceita,
} from "../services/ReceitaService";

export default function AddRecipe() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tempoTotal, setTempoTotal] = useState("");
  const [ingredientes, setIngredientes] = useState<string[]>([""]);
  const [passoAPasso, setPassoAPasso] = useState<string[]>([""]);
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
        setIngredientes(
          receita.ingredientes.length > 0 ? receita.ingredientes : [""]
        );
        setPassoAPasso(
          receita.passo_a_passo.length > 0 ? receita.passo_a_passo : [""]
        );
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
      tempo_total: tempoTotal,
      ingredientes: ingredientes.filter((i) => i.trim() !== ""),
      passo_a_passo: passoAPasso.filter((p) => p.trim() !== ""),
      image: imagem,
    };

    try {
      await salvarReceita(novaReceita);
      router.push('/');
    } catch (error) {
      console.log("Erro ao salvar receita:", error);
    }
  };

  const handleExcluir = () => {
    Alert.alert("Confirmar", "Deseja realmente excluir essa receita?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await excluirReceita(Number(id));
            router.push("/");
          } catch (error) {
            console.log("Erro ao excluir:", error);
          }
        },
      },
    ]);
  };

  const adicionarIngrediente = () => {
    setIngredientes([...ingredientes, ""]);
  };

  const removerIngrediente = (index: number) => {
    const novos = [...ingredientes];
    novos.splice(index, 1);
    setIngredientes(novos.length > 0 ? novos : [""]);
  };

  const adicionarPasso = () => {
    setPassoAPasso([...passoAPasso, ""]);
  };

  const removerPasso = (index: number) => {
    const novos = [...passoAPasso];
    novos.splice(index, 1);
    setPassoAPasso(novos.length > 0 ? novos : [""]);
  };

  const selecionarImagem = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão negada",
        "Precisamos da sua permissão para acessar a galeria."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImagem(result.assets[0].uri);
    }
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
        placeholder="30 minutos"
        value={tempoTotal}
        onChangeText={setTempoTotal}
      />

      <Text style={[styles.subtitulo, { marginTop: 20 }]}>
        Imagem da Receita (opcional):
      </Text>
      <TouchableOpacity style={styles.botaoImagem} onPress={selecionarImagem}>
        <Text style={styles.textoBotao}>Selecionar Imagem</Text>
      </TouchableOpacity>

      {imagem ? (
        <Image source={{ uri: imagem }} style={styles.previewImagem} />
      ) : null}

      <Text style={styles.subtitulo}>Ingredientes</Text>
      {ingredientes.map((item, index) => (
        <View key={index} style={styles.itemContainer}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder={`Ingrediente ${index + 1}`}
            value={item}
            onChangeText={(text) => {
              const novos = [...ingredientes];
              novos[index] = text;
              setIngredientes(novos);
            }}
          />
          <TouchableOpacity
            onPress={() => removerIngrediente(index)}
            style={styles.botaoRemover}
          >
            <Text style={{ color: "#FFF" }}>X</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity
        style={styles.botaoAdicionar}
        onPress={adicionarIngrediente}
      >
        <Text style={styles.textoBotao}>+ Ingrediente</Text>
      </TouchableOpacity>

      <Text style={styles.subtitulo}>Passo a Passo</Text>
      {passoAPasso.map((item, index) => (
        <View key={index} style={styles.itemContainer}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder={`Passo ${index + 1}`}
            value={item}
            onChangeText={(text) => {
              const novos = [...passoAPasso];
              novos[index] = text;
              setPassoAPasso(novos);
            }}
          />
          <TouchableOpacity
            onPress={() => removerPasso(index)}
            style={styles.botaoRemover}
          >
            <Text style={{ color: "#FFF" }}>X</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity style={styles.botaoAdicionar} onPress={adicionarPasso}>
        <Text style={styles.textoBotao}>+ Passo</Text>
      </TouchableOpacity>

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
  subtitulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    backgroundColor: "#F8F8F8",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  botaoRemover: {
    backgroundColor: "#B22222",
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  botaoAdicionar: {
    backgroundColor: "#4682B4",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  botaoImagem: {
    backgroundColor: "#4682B4",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  previewImagem: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
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
