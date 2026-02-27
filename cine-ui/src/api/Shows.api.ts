import { http } from "./http";
    
export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type Show = { id: number; movie_title: string };

export async function listShowsApi() {
  const { data } = await http.get<Paginated<Show>>("/api/Shows/");
  return data; // { count, next, previous, results }
}

export async function createShowApi(nombre: string) {
  const { data } = await http.post<Show>("/api/Shows/", { nombre });
  return data;
}

export async function updateShowApi(id: number, nombre: string) {
  const { data } = await http.put<Show>(`/api/Shows/${id}/`, { nombre });
  return data;
}

export async function deleteShowApi(id: number) {
  await http.delete(`/api/Shows/${id}/`);
}