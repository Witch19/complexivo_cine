import { View, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../../App"; // ajusta la ruta si no coincide

type Nav = NativeStackNavigationProp<RootStackParamList, "Home">;

type GlobalAuthStore = { accessToken?: string; refreshToken?: string };

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();

  const logout = () => {
    const store = globalThis as unknown as GlobalAuthStore;
    store.accessToken = undefined;
    store.refreshToken = undefined;

    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menú</Text>
      <Text style={styles.sub}>CRUD Mongo mínimo + selects</Text>

      <Pressable onPress={() => navigation.navigate("CatalogTypes")} style={styles.btn}>
        <Text style={styles.btnText}>Catalog Types</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate("ReservationEvents")} style={styles.btn}>
        <Text style={styles.btnText}>Reservation events</Text>
      </Pressable>

      <Pressable onPress={logout} style={[styles.btn, styles.btnDanger]}>
        <Text style={[styles.btnText, styles.btnDangerText]}>Cerrar Sesión</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d1117", padding: 16 },
  title: { color: "#58a6ff", fontSize: 24, fontWeight: "800", marginBottom: 6, marginTop: 10 },
  sub: { color: "#8b949e", marginBottom: 14 },
  btn: {
    backgroundColor: "#21262d",
    borderColor: "#58a6ff",
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  btnText: { color: "#58a6ff", textAlign: "center", fontWeight: "700" },
  btnDanger: { borderColor: "#ff7b72" },
  btnDangerText: { color: "#ff7b72" },
});