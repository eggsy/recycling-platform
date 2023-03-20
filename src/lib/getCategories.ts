import { firestore } from "@/lib/firebase";
import { ICategory } from "@/store/categories";
import { collection, query, getDocs, orderBy } from "firebase/firestore";

const categoriesCollection = collection(firestore, "categories");

export const getCategories = async () => {
  const todosQuery = query(categoriesCollection, orderBy("name", "asc"));
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
