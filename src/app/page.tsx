"use client";

import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
import Image from "next/image";
import { useEffect, useState } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyD76vQKsxYk19iRzACjT_A9apXAoFEtm7Q",
  authDomain: "copilot-take-home-fc0d7.firebaseapp.com",
  projectId: "copilot-take-home-fc0d7",
  storageBucket: "copilot-take-home-fc0d7.appspot.com",
  messagingSenderId: "410259109691",
  appId: "1:410259109691:web:48c8180df4ef8cbf47a91e",
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(firebaseApp);
const birdsCol = collection(db, "birds");

export default function Home() {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [birds, setBirds] = useState<string[]>([]);

  useEffect(() => {
    signInAnonymously(auth).then(() => setIsSignedIn(true));
  }, []);

  useEffect(() => {
    if (isSignedIn) {
      getDocs(birdsCol).then((birdsDocs) =>
        setBirds(birdsDocs.docs.map((doc) => doc.data().name.english)),
      );
    }
  }, [isSignedIn]);

  return (
    <div>
      {birds.map((bird) => (
        <p>{bird}</p>
      ))}
    </div>
  );
}
