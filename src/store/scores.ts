import { IUser } from "@/store/auth";
import { atom } from "jotai";

export const scoresAtom = atom<IUser[]>([]);
