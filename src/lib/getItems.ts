import { firestore } from "@/firebase/clientApp";
import { IItem } from "@/store/items";
import { collection, query, getDocs, where } from "firebase/firestore";

const itemsCollection = collection(firestore, "items");

export const getItems = async (id: string) => {
  const todosQuery = query(itemsCollection, where("categoryId", "==", id));

  const querySnapshot = await getDocs(todosQuery);

  const results: IItem[] = [];

  for (const snapshot of querySnapshot.docs) {
    results.push({
      id: snapshot.id,
      ...snapshot.data(),
    } as IItem);
  }

  return results;
};
