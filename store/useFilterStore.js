import { create } from "zustand";
export const useFilterStore = create((set) => ({
  filters: { search:"", category:"", type:"", locationType:"", location:"", experience:"" },
  setFilter:   (key, value) => set((s) => ({ filters: { ...s.filters, [key]: value } })),
  resetFilters:() => set({ filters: { search:"", category:"", type:"", locationType:"", location:"", experience:"" } }),
}));
