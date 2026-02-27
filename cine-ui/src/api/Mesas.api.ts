import { http } from "./http";
    
export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type Mesa = { id: number; name: string };

export async function listMesasApi() {
  const { data } = await http.get<Paginated<Mesa>>("/api/Mesas/");
  return data; // { count, next, previous, results }
}

export async function createMesaApi(nombre: string) {
  const { data } = await http.post<Mesa>("/api/Mesas/", { nombre });
  return data;
}

export async function updateMesaApi(id: number, nombre: string) {
  const { data } = await http.put<Mesa>(`/api/Mesas/${id}/`, { nombre });
  return data;
}

export async function deleteMesaApi(id: number) {
  await http.delete(`/api/Mesas/${id}/`);
}