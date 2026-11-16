import { useState, useEffect } from "react";
import { API_BASE_URL } from "../services/api";

function RecetasSection() {
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados del formulario para crear y editar
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tiempoPreparacion, setTiempoPreparacion] = useState("");
  const [municipioOrigen, setMunicipioOrigen] = useState("");
  const [editandoId, setEditandoId] = useState(null);
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
      setError(
        "No se pudieron cargar las recetas. Verifica que el servidor Django esté encendido.",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarRecetas();
  }, []);

  const iniciarEdicion = (receta) => {
    setEditandoId(receta.id);
    setNombre(receta.nombre);
    setDescripcion(receta.descripcion);
    setTiempoPreparacion(receta.tiempo_preparacion);
    setMunicipioOrigen(receta.municipio_origen);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setNombre("");
    setDescripcion("");
    setTiempoPreparacion("");
    setMunicipioOrigen("");
  };

  // 2. Crear (POST) o actualizar (PUT) receta
  const manejarGuardar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);

    const datosReceta = {
      nombre,
      descripcion,
      tiempo_preparacion: Number(tiempoPreparacion),
      municipio_origen: municipioOrigen,
    };

    try {
      const url = editandoId
        ? `${API_BASE_URL}/recetas/${editandoId}/`
        : `${API_BASE_URL}/recetas/`;

      const metodo = editandoId ? "PUT" : "POST";

      const respuesta = await fetch(url, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosReceta),
      });

      if (!respuesta.ok) {
        throw new Error("Error al guardar los cambios de la receta");
      }

      const recetaRespuesta = await respuesta.json();

      if (editandoId) {
        setRecetas(
          recetas.map((item) =>
            item.id === editandoId ? recetaRespuesta : item,
          ),
        );
      } else {
        setRecetas([recetaRespuesta, ...recetas]);
      }

      cancelarEdicion();
    } catch (err) {
      setError(
        "No se pudo guardar la receta. Revisa la conexión con el servidor.",
      );
      console.error(err);
    } finally {
      setEnviando(false);
    }
  };

  const manejarEliminar = async (id) => {
    const confirmar = window.confirm(
      "¿Seguro que deseas eliminar esta receta?",
    );
    if (!confirmar) return;

    setError(null);

    try {
      const respuesta = await fetch(`${API_BASE_URL}/recetas/${id}/`, {
        method: "DELETE",
      });

      if (!respuesta.ok) {
        throw new Error("No se pudo eliminar la receta");
      }

      setRecetas(recetas.filter((receta) => receta.id !== id));

      if (editandoId === id) {
        cancelarEdicion();
      }
    } catch (err) {
      setError("Error al intentar eliminar la receta.");
      console.error(err);
    }
  };

  return (
    <div>
      {/* Formulario de Creación */}
      <form className="formulario-card" onSubmit={manejarGuardar}>
        <h3>{editandoId ? "Editar Receta Caucana" : "Nueva Receta Caucana"}</h3>

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
            {enviando
              ? "Guardando..."
              : editandoId
                ? "Actualizar Receta"
                : "Guardar Receta"}
          </button>

          {editandoId && (
            <button
              type="button"
              className="btn-secundario"
              onClick={cancelarEdicion}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Estados de Carga y Error */}
      {error && <div className="alerta-error">{error}</div>}
      {loading && (
        <div className="alerta-carga">
          Cargando recetas desde el servidor...
        </div>
      )}

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
                <span className="badge">
                  ⏱️ {receta.tiempo_preparacion} min
                </span>
              </div>

              <p>{receta.descripcion}</p>
            </div>

            <div className="acciones-tarjeta">
              <button
                type="button"
                className="btn-editar"
                onClick={() => iniciarEdicion(receta)}
              >
                Editar
              </button>

              <button
                type="button"
                className="btn-eliminar"
                onClick={() => manejarEliminar(receta.id)}
              >
                Eliminar
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default RecetasSection;
