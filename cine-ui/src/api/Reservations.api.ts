import { http } from "./http";

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type Reservation = {
  id: number;
  show: number;              // FK
  show_title?: string;       // solo lectura (opcional)
  customer_name: string;
  seats: number;
  status: "RESERVED" | "CONFIRMED" | "CANCELLED";
  created_at?: string;
};

// Payload para crear (normalmente no envías id, show_title, created_at)
export type CreateReservationPayload = {
  show: number;
  customer_name: string;
  seats: number;
  status: "RESERVED" | "CONFIRMED" | "CANCELLED";
};

export async function listReservationsPublicApi() {
  const { data } = await http.get<Paginated<Reservation>>("/api/Reservations/");
  return data; // { ... , results: [] }
}

export async function listReservationsAdminApi() {
  const { data } = await http.get<Paginated<Reservation>>("/api/Reservations/");
  return data;
}

export async function createReservationApi(payload: Omit<Reservation, "id">) {
  const { data } = await http.post<Reservation>("/api/Reservations/", payload);
  return data;
}

export async function updateReservationApi(id: number, payload: Partial<Reservation>) {
  const { data } = await http.put<Reservation>(`/api/Reservations/${id}/`, payload);
  return data;
}

export async function deleteReservationApi(id: number) {
  await http.delete(`/api/Reservations/${id}/`);
}