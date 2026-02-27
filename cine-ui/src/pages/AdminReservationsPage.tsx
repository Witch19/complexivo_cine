import { useEffect, useState } from "react";
import {
  Container, Paper, Typography, TextField, Button, Stack,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert,
  FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { type Show, listShowsApi } from "../api/Shows.api";
import { type Reservation, listReservationsAdminApi, createReservationApi, updateReservationApi, deleteReservationApi } from "../api/Reservations.api";

export default function AdminReservationsPage() {
  const [items, setItems] = useState<Reservation[]>([]);
  const [Shows, setShows] = useState<Show[]>([]);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

const [show, setShow] = useState<number>(0);
const [customerName, setCustomerName] = useState("");
const [seats, setSeats] = useState<number>(1);
const [status, setStatus] = useState<"RESERVED" | "CONFIRMED" | "CANCELLED">("RESERVED");

  

  const load = async () => {
    try {
      setError("");
      const data = await listReservationsAdminApi();
      setItems(data.results); // DRF paginado
    } catch (error) {
      setError("No se pudo cargar Reservations. ¿Login? ¿Token admin?");
    }
  };

  const loadShows = async () => {
    try {
      const data = await listShowsApi();
      setShows(data.results); // DRF paginado
      if (!show && data.results.length > 0) setShow(data.results[0].id);
    } catch (error) {
      // si falla, no bloquea la pantalla
    }
  };

  useEffect(() => { load(); loadShows(); }, []);

  const save = async () => {
    try {
      setError("");
      if (!show) return setError("Seleccione una show");
      if (!customerName.trim()) return setError("customer_name es requerido");
      if (!seats || seats < 1) return setError("seats debe ser >= 1");

      // Payload para crear (normalmente no envías id, show_title, created_at)
      /*const payload = {
        show: number;
        customer_name: string;
        seats: number;
        status: "RESERVED" | "CONFIRMED" | "CANCELLED";
      };*/
      const payload = {
        show: Number(show),
        customer_name: customerName.trim(),
        seats: Number(seats),
        status, // RESERVED | CONFIRMED | CANCELLED
    };

      if (editId) await updateReservationApi(editId, payload);
      else await createReservationApi(payload as any);

      setEditId(null);
      setCustomerName("");
      setStatus("RESERVED");
      await load();
    } catch (error) {
      setError("No se pudo guardar Reservation. ¿Token admin?");
    }
  };

  const startEdit = (v: Reservation) => {
    setEditId(v.id);
    setShow(v.show);
    setCustomerName(v.customer_name);
    setSeats(v.seats);
    setStatus(v.status);
  };

  const remove = async (id: number) => {
    try {
      setError("");
      await deleteReservationApi(id);
      await load();
    } catch (error) {
      setError("No se pudo eliminar reserva. ¿Token admin?");
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Admin Reservas (Privado)</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack spacing={2} sx={{ mb: 2 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>

            <FormControl sx={{ width: 260 }}>
              <InputLabel id="show-label">Show</InputLabel>
              <Select
                labelId="show-label"
                label="Show"
                value={show}
                onChange={(e) => setShow(Number(e.target.value))}
              >
                {Shows.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.movie_title} (#{m.id})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField label="customer_name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} fullWidth />
            <TextField label="Seats" type="number" value={seats} onChange={(e) => setSeats(Number(e.target.value))} sx={{ width: 160 }} />
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField label="status" value={status} onChange={(e) => setStatus(e.target.value)} sx={{ width: 220 }} />

            <Button variant="contained" onClick={save}>{editId ? "Actualizar" : "Crear"}</Button>
            <Button variant="outlined" onClick={() => { setEditId(null); setCustomerName(""); setStatus("RESERVED"); setColor(""); }}>Limpiar</Button>
            <Button variant="outlined" onClick={() => { load(); loadShows(); }}>Refrescar</Button>
          </Stack>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Mesa</TableCell>
              <TableCell>customer_name</TableCell>
              <TableCell>Seats</TableCell>
              <TableCell>status</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((v) => (
              <TableRow key={v.id}>
                <TableCell>{v.id}</TableCell>
                <TableCell>{v.show_title ?? v.show}</TableCell>
                <TableCell>{v.customer_name}</TableCell>
                <TableCell>{v.seats}</TableCell>
                <TableCell>{v.status}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => startEdit(v)}><EditIcon /></IconButton>
                  <IconButton onClick={() => remove(v.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}