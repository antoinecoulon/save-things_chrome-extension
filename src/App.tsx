import { useState, useEffect, useRef, useMemo } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, remove } from "firebase/database";

import "./App.css";

const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: "react-projects-ea755.firebaseapp.com",
  projectId: "react-projects-ea755",
  storageBucket: "react-projects-ea755.firebasestorage.app",
  appId: "1:842922221823:web:114f715b125b5148b3ecca",
  databaseURL:
    "https://react-projects-ea755-default-rtdb.europe-west1.firebasedatabase.app/",
};
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function App() {
  const [saves, setSaves] = useState<string[]>([]);
  const [currentUrl, setCurrentUrl] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);
  const referenceInDb = useMemo(() => ref(database, "saves"), []);

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
    const confirmed = window.confirm(
      "Etes-vous sûr de vouloir supprimer l'intégralité de vos notes ?"
    );
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
    <main className="app-body" aria-labelledby="main-title">
      <h1 id="main-title" className="sr-only">
        Application de sauvegarde de notes et d’URLs
      </h1>
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
          <button
            onClick={saveValue}
            aria-label="Sauvegarder la vlauer de l'input"
          >
            SAUVEGARDER
          </button>
          <button
            onClick={saveCurrentTab}
            aria-label="Sauvegarder l'URL de l'onglet actif"
          >
            SAUVEGARDER <br /> L'ONGLET ACTIF
          </button>
        </div>
        <div className="box-btn">
          <button
            onClick={eraseAll}
            className="delete-btn"
            aria-label="Effacer toutes les notes sauvegardées"
          >
            TOUT EFFACER
          </button>
        </div>
      </div>
      <section className="saved-list" aria-labelledby="saved-links-title">
        <h2 id="saved-links-title" className="sr-only">
          Liens ou notes sauvegardés
        </h2>
        <ul aria-live="polite">
          {saves.map((save, idx) => {
            const isLink = /^https?:\/\//.test(save);
            return (
              <li key={idx}>
                {isLink ? (
                  <a href={save} target="_blank" rel="noopener noreferrer">
                    {save}
                  </a>
                ) : (
                  <span>{save}</span>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}

export default App;
