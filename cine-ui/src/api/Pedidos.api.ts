import { http } from "./http";
    
export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type Pedido = {
  id: number;
  mesa: number;
  mesa_nombre?: string;
  items_summary: string;
  total: number;
  status: string;
  color?: string;
  created_at?: string;
};

export async function listPedidosPublicApi() {
  const { data } = await http.get<Paginated<Pedido>>("/api/Pedidos/");
  return data; // { ... , results: [] }
}

export async function listPedidosAdminApi() {
  const { data } = await http.get<Paginated<Pedido>>("/api/Pedidos/");
  return data;
}

export async function createPedidoApi(payload: Omit<Pedido, "id">) {
  const { data } = await http.post<Pedido>("/api/Pedidos/", payload);
  return data;
}

export async function updatePedidoApi(id: number, payload: Partial<Pedido>) {
  const { data } = await http.put<Pedido>(`/api/Pedidos/${id}/`, payload);
  return data;
}

export async function deletePedidoApi(id: number) {
  await http.delete(`/api/Pedidos/${id}/`);
}