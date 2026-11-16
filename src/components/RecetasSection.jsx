import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../services/api';

function RecetasSection() {
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados del formulario de creación
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tiempoPreparacion, setTiempoPreparacion] = useState('');
  const [municipioOrigen, setMunicipioOrigen] = useState('');
  const [enviando, setEnviando] = useState(false);

  // 1. Listar recetas al cargar el componente (GET)
  const cargarRecetas = async () => {
    setLoading(true);
    setError(null);
    try {
      const respuesta = await fetch(`${API_BASE_URL}/recetas/`);
      if (!respuesta.ok) {
        throw new Error(`Error del servidor: ${respuesta.status}`);
      }
      const datos = await respuesta.json();
      setRecetas(datos);
    } catch (err) {
      setError('No se pudieron cargar las recetas. Verifica que el servidor Django esté encendido.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarRecetas();
  }, []);

  // 2. Crear nueva receta (POST)
  const manejarCrear = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);

    const nuevaReceta = {
      nombre,
      descripcion,
      tiempo_preparacion: Number(tiempoPreparacion),
      municipio_origen: municipioOrigen,
    };

    try {
      const respuesta = await fetch(`${API_BASE_URL}/recetas/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevaReceta),
      });

      if (!respuesta.ok) {
        throw new Error('Error al guardar la receta');
      }

      const recetaCreada = await respuesta.json();
      setRecetas([recetaCreada, ...recetas]);

      // Limpiar formulario
      setNombre('');
      setDescripcion('');
      setTiempoPreparacion('');
      setMunicipioOrigen('');
    } catch (err) {
      setError('No se pudo crear la receta. Revisa los datos e intenta nuevamente.');
      console.error(err);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div>
      {/* Formulario de Creación */}
      <form className="formulario-card" onSubmit={manejarCrear}>
        <h3>Nueva Receta Caucana</h3>

        <div className="fila-doble">
          <div className="campo">
            <label>Nombre del plato</label>
            <input
              type="text"
              placeholder="Ej. Empanadas de Pipián"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div className="campo">
            <label>Municipio de origen</label>
            <input
              type="text"
              placeholder="Ej. Popayán, Silvia, Patía..."
              value={municipioOrigen}
              onChange={(e) => setMunicipioOrigen(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="campo">
          <label>Tiempo de preparación (minutos)</label>
          <input
            type="number"
            min="1"
            placeholder="Ej. 45"
            value={tiempoPreparacion}
            onChange={(e) => setTiempoPreparacion(e.target.value)}
            required
          />
        </div>

        <div className="campo">
          <label>Descripción y preparación</label>
          <textarea
            rows="3"
            placeholder="Describe la historia o pasos principales de la receta..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />
        </div>

        <div className="acciones-form">
          <button type="submit" className="btn-primario" disabled={enviando}>
            {enviando ? 'Guardando...' : 'Guardar Receta'}
          </button>
        </div>
      </form>

      {/* Estados de Carga y Error */}
      {error && <div className="alerta-error">{error}</div>}
      {loading && <div className="alerta-carga">Cargando recetas desde el servidor...</div>}

      {/* Listado de Recetas */}
      {!loading && recetas.length === 0 && !error && (
        <p>Aún no hay recetas registradas. ¡Crea la primera arriba!</p>
      )}

      <div className="grid-tarjetas">
        {recetas.map((receta) => (
          <article key={receta.id} className="tarjeta">
            <div>
              <h4>{receta.nombre}</h4>
              <div className="etiquetas">
                <span className="badge">📍 {receta.municipio_origen}</span>
                <span className="badge">⏱️ {receta.tiempo_preparacion} min</span>
              </div>
              <p>{receta.descripcion}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default RecetasSection;