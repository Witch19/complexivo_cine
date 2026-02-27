import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from "react-native";
import { listCatalogTypesApi, createCatalogTypeApi, deleteCatalogTypeApi } from "../api/CatalogTypes.api";  
import type { CatalogType } from "../types/CatalogType";
import { toArray } from "../types/drf";

function normalizeText(input: string): string {
  return input.trim();
}

export default function MenuTypesScreen() {
  const [items, setItems] = useState<CatalogType[]>([]);
  const [name, setName] = useState("");
  const [category, setcategory] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const load = async (): Promise<void> => {
    try {
      setErrorMessage("");
      const data = await listCatalogTypesApi();
      setItems(toArray(data));
    } catch {
      setErrorMessage("No se pudo cargar los tipos de Catalogo. ¿Login? ¿Token?");
    }
  };

  useEffect(() => { load(); }, []);

  const createItem = async (): Promise<void> => {
    try {
      setErrorMessage("");

      const cleanName = normalizeText(name);
      if (!cleanName) return setErrorMessage("Name es requerido");

      const created = await createCatalogTypeApi({
        movie_title: cleanName,
        category: normalizeText(category) || undefined,
      });

      setItems((prev) => [created, ...prev]);
      setName("");
      setcategory("");
    } catch {
      setErrorMessage("No se pudo crear service type.");
    }
  };

  const removeItem = async (id: string): Promise<void> => {
    try {
      setErrorMessage("");
      await deleteCatalogTypeApi(id);
      setItems((prev) => prev.filter((it) => it.id !== id));
    } catch {
      setErrorMessage("No se pudo eliminar service type.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tipos de Catalogo</Text>
      {!!errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Ensalada"
        placeholderTextColor="#8b949e"
        style={styles.input}
      />

      <Text style={styles.label}>Categoria (opcional)</Text>
      <TextInput
        value={category}
        onChangeText={setcategory}
        placeholder="Menu de adultos"
        placeholderTextColor="#8b949e"
        style={styles.input}
      />

      <Pressable onPress={createItem} style={styles.btn}>
        <Text style={styles.btnText}>Crear</Text>
      </Pressable>

      <Pressable onPress={load} style={[styles.btn, { marginBottom: 12 }]}>
        <Text style={styles.btnText}>Refrescar</Text>
      </Pressable>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.rowText} numberOfLines={1}>{item.name}</Text>
              {!!item.category && <Text style={styles.rowSub} numberOfLines={1}>{item.category}</Text>}
            </View>

            <Pressable onPress={() => removeItem(item.id)}>
              <Text style={styles.del}>Eliminar</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d1117", padding: 16 },
  title: { color: "#58a6ff", fontSize: 22, fontWeight: "800", marginBottom: 10 },
  error: { color: "#ff7b72", marginBottom: 10 },
  label: { color: "#8b949e", marginBottom: 6, marginTop: 6 },
  input: {
    backgroundColor: "#161b22",
    color: "#c9d1d9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#30363d",
  },
  btn: { backgroundColor: "#21262d", borderColor: "#58a6ff", borderWidth: 1, padding: 12, borderRadius: 8 },
  btnText: { color: "#58a6ff", textAlign: "center", fontWeight: "700" },
  row: {
    backgroundColor: "#161b22",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#30363d",
  },
  rowText: { color: "#c9d1d9", fontWeight: "800" },
  rowSub: { color: "#8b949e", marginTop: 2 },
  del: { color: "#ff7b72", fontWeight: "700" },
});