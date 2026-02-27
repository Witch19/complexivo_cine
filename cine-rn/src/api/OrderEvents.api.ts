import { http } from "./http";
import type { OrderEvent } from "../types/OrderEvent";
import type { Paginated } from "../types/drf";

export type OrderEventCreatePayload = {
  event_type: number;
  service_type_id: string;
  note?: string;
  source?: number;
};

export async function listOrderEventsApi(): Promise<Paginated<OrderEvent> | OrderEvent[]> {
  const { data } = await http.get<Paginated<OrderEvent> | OrderEvent[]>("/api/order-events/");
  return data;
}

export async function createOrderEventApi(payload: OrderEventCreatePayload): Promise<OrderEvent> {
  const { data } = await http.post<OrderEvent>("/api/order-events/", payload);
  return data;
}

export async function deleteOrderEventApi(id: string): Promise<void> {
  await http.delete(`/api/order-events/${id}/`);
}