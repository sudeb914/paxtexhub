import { cars } from "@/data/cars";
import type { CarService } from "@/services/contracts/car-service";
import type { Car, CarFilters } from "@/types/car";

const PAGE_SIZE = 4;

function includes(value: string, query?: string) {
  return !query || value.toLowerCase().includes(query.toLowerCase());
}

export const mockCarService: CarService = {
  async getFeatured() {
    return cars.slice(0, 4);
  },

  async getCars(filters: CarFilters = {}) {
    let results = cars.filter((car) =>
      includes(car.make, filters.make) &&
      includes(car.model, filters.model) &&
      includes(car.location, filters.location) &&
      (!filters.category || car.categoryId === filters.category),
    );

    results = [...results].sort((a, b) => {
      if (filters.sort === "price-asc") return a.price - b.price;
      if (filters.sort === "price-desc") return b.price - a.price;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const page = Math.max(1, filters.page ?? 1);
    const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * PAGE_SIZE;

    return {
      items: results.slice(start, start + PAGE_SIZE),
      page: safePage,
      pageSize: PAGE_SIZE,
      totalItems: results.length,
      totalPages,
    };
  },

  async getCarBySlug(slug: string): Promise<Car | null> {
    return cars.find((car) => car.slug === slug) ?? null;
  },
};
