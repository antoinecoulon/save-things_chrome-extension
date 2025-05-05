import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    databaseURL: "https://react-projects-ea755-default-rtdb.europe-west1.firebasedatabase.app/",
};
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
function App() {
    const [saves, setSaves] = useState([]);
    const [currentUrl, setCurrentUrl] = useState("");
    const inputRef = useRef(null);
    const referenceInDb = useMemo(() => ref(database, "saves"), []);
    useEffect(() => {
        const unsubscribe = onValue(referenceInDb, (snapshot) => {
            if (snapshot.exists()) {
                const snapshotValues = snapshot.val();
                const values = Object.values(snapshotValues);
                setSaves(values);
            }
            else {
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
        const confirmed = window.confirm("Etes-vous sûr de vouloir supprimer l'intégralité de vos notes ?");
        if (confirmed) {
            remove(referenceInDb);
        }
    }
    function saveCurrentTab() {
        if (currentUrl) {
            push(referenceInDb, currentUrl);
        }
    }
    return (_jsxs("main", { className: "app-body", "aria-labelledby": "main-title", children: [_jsx("h1", { id: "main-title", className: "sr-only", children: "Application de sauvegarde de notes et d\u2019URLs" }), _jsx("label", { htmlFor: "app-input", children: "Entrer un URL ou une note \u00E0 sauvegarder :" }), _jsx("input", { ref: inputRef, type: "text", className: "app-input", id: "app-input", name: "app-input" }), _jsxs("div", { className: "buttons", children: [_jsxs("div", { className: "box-btn", children: [_jsx("button", { onClick: saveValue, "aria-label": "Sauvegarder la vlauer de l'input", children: "SAUVEGARDER" }), _jsxs("button", { onClick: saveCurrentTab, "aria-label": "Sauvegarder l'URL de l'onglet actif", children: ["SAUVEGARDER ", _jsx("br", {}), " L'ONGLET ACTIF"] })] }), _jsx("div", { className: "box-btn", children: _jsx("button", { onClick: eraseAll, className: "delete-btn", "aria-label": "Effacer toutes les notes sauvegard\u00E9es", children: "TOUT EFFACER" }) })] }), _jsxs("section", { className: "saved-list", "aria-labelledby": "saved-links-title", children: [_jsx("h2", { id: "saved-links-title", className: "sr-only", children: "Liens ou notes sauvegard\u00E9s" }), _jsx("ul", { "aria-live": "polite", children: saves.map((save, idx) => {
                            const isLink = /^https?:\/\//.test(save);
                            return (_jsx("li", { children: isLink ? (_jsx("a", { href: save, target: "_blank", rel: "noopener noreferrer", children: save })) : (_jsx("span", { children: save })) }, idx));
                        }) })] })] }));
}
export default App;
