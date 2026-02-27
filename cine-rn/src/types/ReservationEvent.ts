export type ReservationEvent = {
    id: string;
    event_type: number;       // Postgres
    reservation_id: string;   // Mongo
    date?: string;             // backend asigna fecha al crear (NO se envía desde app)
    note?: string;
    source?: string;
  };