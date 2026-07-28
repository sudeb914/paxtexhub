import type { PaginatedResult } from "@/types/api";
import type { Car, CarFilters } from "@/types/car";

export interface CarService {
  getFeatured(): Promise<Car[]>;
  getCars(filters?: CarFilters): Promise<PaginatedResult<Car>>;
  getCarBySlug(slug: string): Promise<Car | null>;
}
