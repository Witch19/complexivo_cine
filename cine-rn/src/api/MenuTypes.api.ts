import { http } from "./http";
import type { MenuType } from "../types/MenuType";
import type { Paginated } from "../types/drf";

export async function listMenuTypesApi(): Promise<Paginated<MenuType> | MenuType[]> {
  const { data } = await http.get<Paginated<MenuType> | MenuType[]>("/api/menu-types/");
  return data;
}

export async function createMenuTypeApi(payload: Pick<MenuType, "name"> & Partial<MenuType>): Promise<MenuType> {
  const { data } = await http.post<MenuType>("/api/menu-types/", payload);
  return data;
}

export async function deleteMenuTypeApi(id: string): Promise<void> {
  await http.delete(`/api/menu-types/${id}/`);
}