import { http } from "./http";
import type { ReservationEvent } from "../types/ReservationEvent";
import type { Paginated } from "../types/drf";

export type OrderEventCreatePayload = {
  event_type: number;
  service_type_id: string;
  note?: string;
  source?: number;
};

export async function listReservationEventsApi(): Promise<Paginated<ReservationEvent> | ReservationEvent[]> {
  const { data } = await http.get<Paginated<ReservationEvent> | ReservationEvent[]>("/api/order-events/");
  return data;
}

export async function createReservationEventApi(payload: OrderEventCreatePayload): Promise<ReservationEvent> {
  const { data } = await http.post<ReservationEvent>("/api/order-events/", payload);
  return data;
}

export async function deleteReservationEventApi(id: string): Promise<void> {
  await http.delete(`/api/order-events/${id}/`);
}