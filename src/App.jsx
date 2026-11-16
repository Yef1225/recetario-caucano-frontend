import { useState } from 'react';
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
            <h2>Gestión de Recetas</h2>
            {/* Aquí conectaremos los componentes de Recetas en el Commit 2 */}
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