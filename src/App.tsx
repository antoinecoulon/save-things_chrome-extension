import './App.css'

function App() {
  

  return (
    <section className='app-body'>
        <h1>Entrer un URL ou une note à sauvegarder :</h1>
        <input type="text" className='app-input' id='app-input' name='app-input'/>
        <button>Sauvegarder</button><button>Effacer</button>
    </section>
  )
}

export default App
