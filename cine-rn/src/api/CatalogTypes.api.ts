import { http } from "./http";
import type { CatalogType } from "../types/CatalogType";
import type { Paginated } from "../types/drf";

export async function listCatalogTypesApi(): Promise<Paginated<CatalogType> | CatalogType[]> {
  const { data } = await http.get<Paginated<CatalogType> | CatalogType[]>("/api/catalog-types/");
  return data;
}

export async function createCatalogTypeApi(payload: Pick<CatalogType, "movie_title"> & Partial<CatalogType>): Promise<CatalogType> {
  const { data } = await http.post<CatalogType>("/api/catalog-types/", payload);
  return data;
}

export async function deleteCatalogTypeApi(id: string): Promise<void> {
  await http.delete(`/api/catalog-types/${id}/`);
}