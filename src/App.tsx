import { useState, useEffect, useRef, useMemo } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, remove } from "firebase/database";

import "./App.css";

{
  /** 
  TODO:
  - accessibility
  - design (li, alert)
  - firebase structure
  - extension chrome (manifest)
*/
}
const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: "leads-tracker-app-f3167.firebaseapp.com",
  databaseURL:
    "https://leads-tracker-app-f3167-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "leads-tracker-app-f3167",
  storageBucket: "leads-tracker-app-f3167.firebasestorage.app",
  messagingSenderId: "790813084858",
  appId: "1:790813084858:web:60f50cb888a46591600683",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function App() {
  const [saves, setSaves] = useState<string[]>([]);
  const [currentUrl, setCurrentUrl] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const referenceInDb = useMemo(() => ref(database, "saves"), [])

  useEffect(() => {
    const unsubscribe = onValue(referenceInDb, (snapshot) => {
      if (snapshot.exists()) {
        const snapshotValues = snapshot.val();
        const values: string[] = Object.values(snapshotValues);
        setSaves(values);
      } else {
        setSaves([]);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        if (tab?.url) {
          setCurrentUrl(tab.url);
        }
      });
    }
  }, []);

  function saveValue() {
    if (inputRef.current?.value) {
      push(referenceInDb, inputRef.current.value.trim());
      inputRef.current.value = "";
    }
  }

  function eraseAll() {
    const confirmed = window.confirm("Etes-vous sûr de vouloir supprimer l'intégralité de vos notes ?")
    if (confirmed) {
      remove(referenceInDb);
    }
  }

  function saveCurrentTab() {
    if (currentUrl) {
      push(referenceInDb, currentUrl);
    }
  }

  return (
    <section className="app-body">
      <label htmlFor="app-input">
        Entrer un URL ou une note à sauvegarder :
      </label>
      <input
        ref={inputRef}
        type="text"
        className="app-input"
        id="app-input"
        name="app-input"
      />
      <div className="buttons">
        <div className="box-btn">
          <button onClick={saveValue}>SAUVEGARDER</button>
          <button onClick={saveCurrentTab}>SAUVEGARDER <br /> L'ONGLET ACTIF</button>
        </div>
        <div className="box-btn">
          <button onClick={eraseAll} className="delete-btn">TOUT EFFACER</button>
        </div>
      </div>
      <div className="saved-list">
        <ul>
          {saves.map((save, idx) => (
            <li key={idx}>{save}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default App;
