export type Reservation = {
  id: number;
  show: number;          // o show_id según serializer
  customer_name: string;
  seats: number;
  status: string;
  created_at: string;
};