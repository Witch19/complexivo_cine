import { http } from "./http";
import type { Paginated } from "../types/drf";
import type { Pedido } from "../types/pedido";

export async function listPedidosApi(): Promise<Paginated<Pedido> | Pedido[]> {
  const { data } = await http.get<Paginated<Pedido> | Pedido[]>("/api/Pedidos/");
  return data;
}