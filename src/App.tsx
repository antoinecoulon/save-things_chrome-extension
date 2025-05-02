import { useState, useRef } from 'react'
import { initializeApp } from 'firebase/app'
import './App.css'

{/** 
  TODO:
  - logic
  - accessibility
  - design
  - extension chrome (manifest)
  - firebase  
*/}
const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY
const firebaseConfig = {

  apiKey: API_KEY,
  authDomain: "leads-tracker-app-f3167.firebaseapp.com",
  databaseURL: "https://leads-tracker-app-f3167-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "leads-tracker-app-f3167",
  storageBucket: "leads-tracker-app-f3167.firebasestorage.app",
  messagingSenderId: "790813084858",
  appId: "1:790813084858:web:60f50cb888a46591600683"
};
const app = initializeApp(firebaseConfig)


function App() {
  const [savedList, setSavedList] = useState(["test", "test"])
  const inputRef = useRef<HTMLInputElement>(null)

  function saveValue() {
    if (inputRef.current?.value != null && inputRef.current?.value != "") {
      const inputValue = inputRef.current?.value
      setSavedList([...savedList, inputValue])
      inputRef.current.value = ""
    }
  }

  function eraseAll() {
    setSavedList([])
  }

  return (
    <section className='app-body'>
        <label htmlFor='app-input'>
          Entrer un URL ou une note à sauvegarder :
        </label>
        <input ref={inputRef} type="text" className='app-input' id='app-input' name='app-input'/>
        <div className="buttons">
          <button onClick={saveValue}>SAUVEGARDER</button>
          <button onClick={eraseAll}>TOUT EFFACER</button>
        </div>
        <div className="saved-list">
          <ul>
            {savedList.map((saved, idx) => (
              <li key={idx}>{saved}</li>              
            ))}
          </ul>
        </div>
    </section>
  )
}

export default App
