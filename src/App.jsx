import { useState } from 'react';
import RecetasSection from './components/RecetasSection';
import './App.css';

function App() {
  const [vistaActiva, setVistaActiva] = useState('recetas');

  return (
    <div className="contenedor-principal">
      <header className="encabezado">
        <h1>🍲 Recetario Caucano</h1>
        <p>Patrimonio gastronómico de Popayán y el Cauca</p>
        <nav className="navegacion">
          <button
            className={vistaActiva === 'recetas' ? 'btn-tab activo' : 'btn-tab'}
            onClick={() => setVistaActiva('recetas')}
          >
            Recetas
          </button>
          <button
            className={vistaActiva === 'ingredientes' ? 'btn-tab activo' : 'btn-tab'}
            onClick={() => setVistaActiva('ingredientes')}
          >
            Ingredientes
          </button>
        </nav>
      </header>

      <main className="contenido">
        {vistaActiva === 'recetas' ? (
          <section>
            <RecetasSection />
          </section>
        ) : (
          <section className="panel-pendiente">
            <h2>Gestión de Ingredientes</h2>
            <p>Módulo asignado a Carlos David Caicedo.</p>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;