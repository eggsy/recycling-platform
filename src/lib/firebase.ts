import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";
import { toast } from "sonner";
import { IUser } from "@/store/auth";

initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
});

const firestore = getFirestore();
const googleProvider = new GoogleAuthProvider();
const auth = getAuth();
const storage = getStorage();

let analytics = null;
isSupported().then((supported) => {
  if (supported) analytics = getAnalytics();
});

export const signInPopup = () => {
  const sure = confirm(
    "By logging you agree to share your display name and avatar with us."
  );

  if (!sure) {
    toast.error("Okay.");
    return;
  }

  signInWithPopup(auth, googleProvider)
    .then((user) => {
      toast.success(`Welcome ${user.user.displayName}!`);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);

      console.error(errorCode, errorMessage, email, credential);
    });
};

export const getCurrentUser = async () => {
  const user = auth.currentUser;

  if (!user?.uid) return null;

  return await getDoc(doc(firestore, `users/${user.uid}`))
    .then(async (userDoc) => {
      if (!userDoc.exists()) {
        const newUser = await createUser({
          displayName: user.displayName,
          avatar: user.photoURL,
          lastUpdatedAt: new Date(),
          uid: user.uid,
        });

        return newUser as IUser;
      }

      return userDoc.data() as IUser;
    })
    .catch((err) => {
      toast.error(err.message);
      return null;
    });
};

const createUser = async ({
  displayName,
  avatar,
  lastUpdatedAt,
  uid,
}: {
  displayName: string | null;
  avatar: string | null;
  lastUpdatedAt: Date;
  uid: string;
}) => {
  const dataObject = {
    displayName,
    avatar,
    lastUpdatedAt,
    score: 0,
  };

  await setDoc(doc(firestore, `users/${uid}`), dataObject);
  return dataObject;
};

export const updateScore = async (score: number) => {
  const user = auth.currentUser;

  if (user) {
    await updateDoc(doc(firestore, `users/${user.uid}`), {
      lastUpdatedAt: new Date(),
      score,
    });
  }
};

export { firestore, auth, storage, analytics };
