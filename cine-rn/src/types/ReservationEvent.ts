export type ReservationEvent = {
  _id: string;                // Mongo
  reservation_id: number;     // id de PostgreSQL
  event_type: "CREATED" | "CONFIRMED" | "CANCELLED" | "CHECKED_IN";
  source: "WEB" | "MOBILE" | "SYSTEM";
  note?: string;
  created_at: string;
};