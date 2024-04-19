import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import { getAuth, signInAnonymously } from "firebase/auth";
import Image from "next/image";

const firebaseConfig = {
  apiKey: "AIzaSyD76vQKsxYk19iRzACjT_A9apXAoFEtm7Q",
  authDomain: "copilot-take-home-fc0d7.firebaseapp.com",
  projectId: "copilot-take-home-fc0d7",
  storageBucket: "copilot-take-home-fc0d7.appspot.com",
  messagingSenderId: "410259109691",
  appId: "1:410259109691:web:48c8180df4ef8cbf47a91e",
};

export default function Home() {
  const firebaseApp = initializeApp(firebaseConfig);
  const auth = getAuth();
  signInAnonymously(auth).then(() => {
    const db = getFirestore(firebaseApp);
    const birdsCol = collection(db, 'birds');
    return getDocs(birdsCol);
  }).then(birds => console.log(birds)).catch(error => console.log(error));

  return (
    <div>
      {JSON.stringify(firebaseConfig)}
    </div>
  );
}
