import { atom } from "jotai";

export interface ICategory {
  id: string;
  name: string;
  image: string;
}

export const categoriesAtom = atom<{
  selectedCategoryId: string | null;
  categories: ICategory[];
}>({
  selectedCategoryId: null,
  categories: [],
});
