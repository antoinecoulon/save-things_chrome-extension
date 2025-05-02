import { useState, useRef } from 'react'
import './App.css'

{/** 
  TODO:
  - logic
  - accessibility
  - design
  - extension chrome (manifest)
  - firebase  
*/}

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
            {savedList.map(saved => (
              <li>{saved}</li>              
            ))}
          </ul>
        </div>
    </section>
  )
}

export default App
