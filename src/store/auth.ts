import { atom } from "jotai";
import type { User } from "firebase/auth";

export interface IUser {
  uid?: string;
  displayName: string;
  avatar: string;
  score: number;
  isAdmin?: boolean;
}

interface IAuth {
  user: User | null;
  userDb: IUser | null;
  isAdmin?: boolean;
}

export const authAtom = atom<IAuth>({
  user: null,
  userDb: null,
  isAdmin: false,
});
