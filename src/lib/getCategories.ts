import { firestore } from "@/lib/firebase";
import { ICategory } from "@/store/categories";
import { collection, query, getDocs, orderBy } from "firebase/firestore";

const categoriesCollection = collection(firestore, "categories");

export const getCategories = async () => {
  const categoriesQuery = query(categoriesCollection, orderBy("name", "asc"));
  const querySnapshot = await getDocs(categoriesQuery);

  const results: ICategory[] = [];

  for (const snapshot of querySnapshot.docs) {
    results.push({
      id: snapshot.id,
      ...snapshot.data(),
    } as ICategory);
  }

  return results;
};
