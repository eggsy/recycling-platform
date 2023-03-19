import { atom } from "jotai";
import type { User } from "firebase/auth";

interface IAuth {
  user: User | null;
  isAdmin?: boolean;
}

export const adminUids = ["ONv2wcb0FcS82mpZiYE1EZDgmHs1"];

export const authAtom = atom<IAuth>({
  user: null,
  isAdmin: false,
});
