import './App.css'

{/** 
  TODO:
    - accessibility
    - design
    - extension chrome (manifest)
    - firebase  
*/}

function App() {
  

  return (
    <section className='app-body'>
        <label htmlFor='app-input'>Entrer un URL ou une note à sauvegarder :</label>
        <input type="text" className='app-input' id='app-input' name='app-input'/>
        <button>SAUVEGARDER</button><button>EFFACER</button>
    </section>
  )
}

export default App
