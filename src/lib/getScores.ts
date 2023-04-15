import { firestore } from "@/lib/firebase";
import { IUser } from "@/store/auth";
import {
  collection,
  query,
  getDocs,
  orderBy,
  limit,
  where,
} from "firebase/firestore";

const usersCollection = collection(firestore, "users");

export const getScores = async () => {
  const scoresQuery = query(
    usersCollection,
    where("score", ">", 0),
    orderBy("score", "desc"),
    limit(10)
  );

  const querySnapshot = await getDocs(scoresQuery);
  const results: IUser[] = [];

  for (const snapshot of querySnapshot.docs) {
    results.push({
      uid: snapshot.id,
      ...snapshot.data(),
    } as IUser);
  }

  return results;
};
