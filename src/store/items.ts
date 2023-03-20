import { atom } from "jotai";

export interface IItem {
  id: string;
  categoryId: string;
  name: string;
  image: string;
  decomposeTime: string;
  wasteType: string;
  benefits?: string[];
  results?: string[];
}

export const itemsAtom = atom<{
  selectedItemId: string | null;
  items: IItem[];
}>({
  selectedItemId: null,
  items: [],
});
