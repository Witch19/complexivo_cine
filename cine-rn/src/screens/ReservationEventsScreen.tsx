import { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

import { listReservationApi } from "../api/reservation.api";
import { listReservationEventsApi, createReservationEventApi, deleteReservationEventApi } from "../api/ReservationEvents.api";
import { listCatalogTypesApi } from "../api/CatalogTypes.api";
import type { Reservation } from "../types/reservation";
import type { CatalogType } from "../types/CatalogType";
import type { ReservationEvent } from "../types/ReservationEvent";
import { toArray } from "../types/drf";


function CatalogTypeLabel(st: CatalogType): string {
  return st.movie_title;
}

function parseOptionalNumber(input: string): { value?: number; error?: string } {
  const trimmed = input.trim();
  if (!trimmed) return { value: undefined };
  const parsed = Number(trimmed);
  if (Number.isNaN(parsed)) return { error: "Cost debe ser numérico" };
  return { value: parsed };
}

export default function ReservationEventsScreen() {
  const [services, setServices] = useState<ReservationEvent[]>([]);
  const [reservation, setReservation] = useState<Reservation[]>([]);
  const [CatalogTypes, setCatalogTypes] = useState<CatalogType[]>([]);

  const [selectedReservationId, setSelectedReservationId] = useState<number | null>(null);
  const [selectedMenuTypeId, setSelectedMenuTypeId] = useState<string>("");

  const [note, setNote] = useState("");
  const [sourceInput, setCostInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const reservationById = useMemo(() => {
    const map = new Map<number, Reservation>();
    reservation.forEach((v) => map.set(v.id, v));
    return map;
  }, [reservation]);

  const CatalogTypeById = useMemo(() => {
    const map = new Map<string, CatalogType>();
    CatalogTypes.forEach((s) => map.set(s.id, s));
    return map;
  }, [CatalogTypes]);

  const loadAll = async (): Promise<void> => {
    try {
      setErrorMessage("");

      const [servicesData, reservationData, CatalogTypesData] = await Promise.all([
        listReservationEventsApi(),
        listReservationApi(),
        listCatalogTypesApi(),
      ]);

      const servicesList = toArray(servicesData);
      const reservationList = toArray(reservationData);
      const CatalogTypesList = toArray(CatalogTypesData);

      setServices(servicesList);
      setReservation(reservationList);
      setCatalogTypes(CatalogTypesList);

      if (selectedReservationId === null && reservationList.length) setSelectedReservationId(reservationList[0].id);
      if (!selectedMenuTypeId && CatalogTypesList.length) setSelectedMenuTypeId(CatalogTypesList[0].id);
    } catch {
      setErrorMessage("No se pudo cargar info. ¿Token? ¿baseURL? ¿backend encendido?");
    }
  };

  useEffect(() => { loadAll(); }, []);

  const createService = async (): Promise<void> => {
    try {
      setErrorMessage("");

      if (selectedReservationId === null) return setErrorMessage("Seleccione una reserva");
      if (!selectedMenuTypeId) return setErrorMessage("Seleccione un tipo de servicio");

      const trimmedNote = note.trim() ? note.trim() : undefined;
      const { value: parsedCost, error } = parseOptionalNumber(sourceInput);
      if (error) return setErrorMessage(error);

      // NO enviar fecha, backend la toma actual
      const created = await createReservationEventApi({
        reservation_id: selectedReservationId,
        event_type: selectedMenuTypeId,
        source: parsedCost,
        note: trimmedNote,
      });

      setServices((prev) => [created, ...prev]);
      setNote("");
      setCostInput("");
    } catch {
      setErrorMessage("No se pudo crear order events");
    }
  };

  const removeService = async (id: string): Promise<void> => {
    try {
      setErrorMessage("");
      await deleteReservationEventApi(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch {
      setErrorMessage("No se pudo eliminar reservation events");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reservation Events</Text>
      {!!errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

      <Text style={styles.label}>Que desa ordenar</Text>
      <View style={styles.pickerWrap}>
        <Picker
          selectedValue={selectedReservationId ?? ""}
          onValueChange={(value) => setSelectedReservationId(Number(value))}
          dropdownIconColor="#58a6ff"
          style={styles.picker}
        >
          {reservation.map((v) => (
            <Picker.Item key={v.id} label={v.customer_name} value={v.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Tipo de Menu</Text>
      <View style={styles.pickerWrap}>
        <Picker
          selectedValue={selectedMenuTypeId}
          onValueChange={(value) => setSelectedMenuTypeId(String(value))}
          dropdownIconColor="#58a6ff"
          style={styles.picker}
        >
          {CatalogTypes.map((st) => (
            <Picker.Item key={st.id} label={CatalogTypeLabel(st)} value={st.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Notas (opcional)</Text>
      <TextInput
        placeholder="Notas"
        placeholderTextColor="#8b949e"
        value={note}
        onChangeText={setNote}
        style={styles.input}
      />

      <Text style={styles.label}>Costo (opcional)</Text>
      <TextInput
        placeholder="40"
        placeholderTextColor="#8b949e"
        value={sourceInput}
        onChangeText={setCostInput}
        keyboardType="numeric"
        style={styles.input}
      />

      <Pressable onPress={createService} style={[styles.btn, { marginBottom: 12 }]}>
        <Text style={styles.btnText}>Crear (sin enviar fecha)</Text>
      </Pressable>

      <Pressable onPress={loadAll} style={[styles.btn, { marginBottom: 12 }]}>
        <Text style={styles.btnText}>Refrescar</Text>
      </Pressable>

      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const v = reservationById.get(item.reservation_id);
          const st = CatalogTypeById.get(item.service_type_id);

          const line1 = v ? v.customer_name : `event_type: ${item.event_type}`;
          const line2 = st ? st.movie_title : `service_type_id: ${item.service_type_id}`;

          const extras: string[] = [];
          if (item.source !== undefined) extras.push(`Costo: ${item.source}`);
          if (item.note) extras.push(`Notas: ${item.note}`);
          if (item.created_at) extras.push(`Fecha: ${item.date}`);

          return (
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.rowText} numberOfLines={1}>{line1}</Text>
                <Text style={styles.rowSub} numberOfLines={1}>{line2}</Text>
                {extras.map((t, idx) => (
                  <Text key={idx} style={styles.rowSub} numberOfLines={1}>{t}</Text>
                ))}
              </View>

              <Pressable onPress={() => removeService(item.id)}>
                <Text style={styles.del}>Eliminar</Text>
              </Pressable>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d1117", padding: 16 },
  title: { color: "#58a6ff", fontSize: 22, fontWeight: "800", marginBottom: 10 },
  error: { color: "#ff7b72", marginBottom: 10 },
  label: { color: "#8b949e", marginBottom: 6, marginTop: 6 },

  pickerWrap: {
    backgroundColor: "#161b22",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#30363d",
    marginBottom: 10,
    overflow: "hidden",
  },
  picker: { color: "#c9d1d9" },

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
  del: { color: "#ff7b72", fontWeight: "800" },
});