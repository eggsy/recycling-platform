import { firestore } from "@/firebase/clientApp";
import { ICategory } from "@/store/categories";
import { collection, query, getDocs } from "firebase/firestore";

const categoriesCollection = collection(firestore, "categories");

export const getCategories = async () => {
  const todosQuery = query(categoriesCollection);
  const querySnapshot = await getDocs(todosQuery);

  const results: ICategory[] = [];

  for (const snapshot of querySnapshot.docs) {
    results.push({
      id: snapshot.id,
      ...snapshot.data(),
    } as ICategory);
  }

  return results;
};
