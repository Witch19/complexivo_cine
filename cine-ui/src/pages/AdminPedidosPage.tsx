import { useEffect, useState } from "react";
import {
  Container, Paper, Typography, TextField, Button, Stack,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert,
  FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { type Mesa, listMesasApi } from "../api/Mesas.api";
import { type Pedido, listPedidosAdminApi, createPedidoApi, updatePedidoApi, deletePedidoApi } from "../api/Pedidos.api";

export default function AdminPedidosPage() {
  const [items, setItems] = useState<Pedido[]>([]);
  const [Mesas, setMesas] = useState<Mesa[]>([]);
  const [error, setError] = useState("");

  const [editId, setEditId] = useState<number | null>(null);
  const [mesa, setMesa] = useState<number>(0);
  const [items_summary, setitems_summary] = useState("");
  const [total, settotal] = useState(2020);
  const [status, setstatus] = useState("");
  const [color, setColor] = useState("");

  const load = async () => {
    try {
      setError("");
      const data = await listPedidosAdminApi();
      setItems(data.results); // DRF paginado
    } catch {
      setError("No se pudo cargar Pedidos. ¿Login? ¿Token admin?");
    }
  };

  const loadMesas = async () => {
    try {
      const data = await listMesasApi();
      setMesas(data.results); // DRF paginado
      if (!mesa && data.results.length > 0) setMesa(data.results[0].id);
    } catch {
      // si falla, no bloquea la pantalla
    }
  };

  useEffect(() => { load(); loadMesas(); }, []);

  const save = async () => {
    try {
      setError("");
      if (!mesa) return setError("Seleccione una mesa");
      if (!items_summary.trim() || !status.trim()) return setError("items_summary y status son requeridos");

      const payload = {
        mesa: Number(mesa),
        items_summary: items_summary.trim(),
        total: Number(total),
        status: status.trim(),
        color: color.trim(),
      };

      if (editId) await updatePedidoApi(editId, payload);
      else await createPedidoApi(payload as any);

      setEditId(null);
      setitems_summary("");
      setstatus("");
      await load();
    } catch {
      setError("No se pudo guardar Pedido. ¿Token admin?");
    }
  };

  const startEdit = (v: Pedido) => {
    setEditId(v.id);
    setMesa(v.mesa);
    setitems_summary(v.items_summary);
    settotal(v.total);
    setstatus(v.status);
    setColor(v.color || "");
  };

  const remove = async (id: number) => {
    try {
      setError("");
      await deletePedidoApi(id);
      await load();
    } catch {
      setError("No se pudo eliminar vehículo. ¿Token admin?");
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Admin Pedidos (Privado)</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack spacing={2} sx={{ mb: 2 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>

            <FormControl sx={{ width: 260 }}>
              <InputLabel id="mesa-label">Mesa</InputLabel>
              <Select
                labelId="mesa-label"
                label="Mesa"
                value={mesa}
                onChange={(e) => setMesa(Number(e.target.value))}
              >
                {Mesas.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.name} (#{m.id})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField label="items_summary" value={items_summary} onChange={(e) => setitems_summary(e.target.value)} fullWidth />
            <TextField label="Año" type="number" value={total} onChange={(e) => settotal(Number(e.target.value))} sx={{ width: 160 }} />
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField label="status" value={status} onChange={(e) => setstatus(e.target.value)} sx={{ width: 220 }} />
            <TextField label="Color" value={color} onChange={(e) => setColor(e.target.value)} sx={{ width: 220 }} />

            <Button variant="contained" onClick={save}>{editId ? "Actualizar" : "Crear"}</Button>
            <Button variant="outlined" onClick={() => { setEditId(null); setitems_summary(""); setstatus(""); setColor(""); }}>Limpiar</Button>
            <Button variant="outlined" onClick={() => { load(); loadMesas(); }}>Refrescar</Button>
          </Stack>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Mesa</TableCell>
              <TableCell>items_summary</TableCell>
              <TableCell>Año</TableCell>
              <TableCell>status</TableCell>
              <TableCell>Color</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((v) => (
              <TableRow key={v.id}>
                <TableCell>{v.id}</TableCell>
                <TableCell>{v.mesa_nombre ?? v.mesa}</TableCell>
                <TableCell>{v.items_summary}</TableCell>
                <TableCell>{v.total}</TableCell>
                <TableCell>{v.status}</TableCell>
                <TableCell>{v.color || "-"}</TableCell>
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