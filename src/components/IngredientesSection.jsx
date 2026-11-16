
import { useState, useEffect } from "react";
import { API_BASE_URL } from "../services/api";

function IngredientesSection() {
  const [ingredientes, setIngredientes] = useState([]);
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [nombre, setNombre] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [unidadMedida, setUnidadMedida] = useState("");
  const [receta, setReceta] = useState("");
  const [esOpcional, setEsOpcional] = useState(false);

  const [editandoId, setEditandoId] = useState(null);
  const [enviando, setEnviando] = useState(false);

  // Consultar ingredientes y recetas
  const cargarDatos = async () => {
    setLoading(true);
    setError(null);

    try {
      const [respuestaIngredientes, respuestaRecetas] =
        await Promise.all([
          fetch(`${API_BASE_URL}/ingredientes/`),
          fetch(`${API_BASE_URL}/recetas/`),
        ]);

      if (!respuestaIngredientes.ok || !respuestaRecetas.ok) {
        throw new Error("Error al consultar los datos");
      }

      const datosIngredientes = await respuestaIngredientes.json();
      const datosRecetas = await respuestaRecetas.json();

      setIngredientes(datosIngredientes);
      setRecetas(datosRecetas);
    } catch (err) {
      setError("No se pudieron cargar los datos. Verifica Django.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // Preparar formulario para editar
  const iniciarEdicion = (ingrediente) => {
    setEditandoId(ingrediente.id);
    setNombre(ingrediente.nombre);
    setCantidad(ingrediente.cantidad);
    setUnidadMedida(ingrediente.unidad_medida);
    setReceta(String(ingrediente.receta));
    setEsOpcional(ingrediente.es_opcional);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Limpiar formulario
  const cancelarEdicion = () => {
    setEditandoId(null);
    setNombre("");
    setCantidad("");
    setUnidadMedida("");
    setReceta("");
    setEsOpcional(false);
  };

  // Crear o actualizar ingrediente
  const manejarGuardar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);

    const datosIngrediente = {
      receta: Number(receta),
      nombre,
      cantidad,
      unidad_medida: unidadMedida,
      es_opcional: esOpcional,
    };

    try {
      const url = editandoId
        ? `${API_BASE_URL}/ingredientes/${editandoId}/`
        : `${API_BASE_URL}/ingredientes/`;

      const metodo = editandoId ? "PUT" : "POST";

      const respuesta = await fetch(url, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosIngrediente),
      });

      if (!respuesta.ok) {
        throw new Error("No se pudo guardar el ingrediente");
      }

      const ingredienteRespuesta = await respuesta.json();

            if (editandoId) {
        await cargarDatos();
      } else {
        setIngredientes((anteriores) => [
          ...anteriores,
          ingredienteRespuesta,
        ]);
      }

      cancelarEdicion();
    } catch (err) {
      setError("No se pudo guardar el ingrediente.");
      console.error(err);
    } finally {
      setEnviando(false);
    }
  };

  // Eliminar ingrediente
  const manejarEliminar = async (id) => {
    const confirmar = window.confirm(
      "¿Seguro que deseas eliminar este ingrediente?"
    );

    if (!confirmar) return;

    setError(null);

    try {
      const respuesta = await fetch(
        `${API_BASE_URL}/ingredientes/${id}/`,
        {
          method: "DELETE",
        }
      );

      if (!respuesta.ok) {
        throw new Error("No se pudo eliminar el ingrediente");
      }

      setIngredientes((anteriores) =>
        anteriores.filter((item) => item.id !== id)
      );

      if (editandoId === id) {
        cancelarEdicion();
      }
    } catch (err) {
      setError("Error al intentar eliminar el ingrediente.");
      console.error(err);
    }
  };

  return (
    <div>
      <form className="formulario-card" onSubmit={manejarGuardar}>
        <h3>
          {editandoId ? "Editar ingrediente" : "Nuevo ingrediente"}
        </h3>

        <div className="campo">
          <label>Receta</label>
          <select
            value={receta}
            onChange={(e) => setReceta(e.target.value)}
            required
          >
            <option value="">Selecciona una receta</option>
            {recetas.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="fila-doble">
          <div className="campo">
            <label>Nombre del ingrediente</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Papa"
              required
            />
          </div>

          <div className="campo">
            <label>Cantidad</label>
            <input
              type="text"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              placeholder="Ej. 3"
              required
            />
          </div>
        </div>

        <div className="campo">
          <label>Unidad de medida</label>
          <input
            type="text"
            value={unidadMedida}
            onChange={(e) => setUnidadMedida(e.target.value)}
            placeholder="Ej. unidades, gramos, tazas"
            required
          />
        </div>

        <div className="campo">
          <label>
            <input
              type="checkbox"
              checked={esOpcional}
              onChange={(e) => setEsOpcional(e.target.checked)}
            />
            {" "}Ingrediente opcional
          </label>
        </div>

        <div className="acciones-form">
          <button
            type="submit"
            className="btn-primario"
            disabled={enviando || loading || recetas.length === 0}
          >
            {enviando
              ? "Guardando..."
              : editandoId
                ? "Actualizar ingrediente"
                : "Guardar ingrediente"}
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

      {error && <div className="alerta-error">{error}</div>}

      {loading && (
        <div className="alerta-carga">
          Cargando ingredientes...
        </div>
      )}

      {!loading && ingredientes.length === 0 && (
        <p>Aún no hay ingredientes registrados.</p>
      )}

      <div className="grid-tarjetas">
        {ingredientes.map((item) => (
          <article key={item.id} className="tarjeta">
            <div>
              <h4>{item.nombre}</h4>

              <div className="etiquetas">
                <span className="badge">
                  Cantidad: {item.cantidad} {item.unidad_medida}
                </span>

                <span className="badge">
                  {item.receta_nombre}
                </span>
              </div>

              <p>
                {item.es_opcional
                  ? "Ingrediente opcional"
                  : "Ingrediente obligatorio"}
              </p>
            </div>

            <div className="acciones-tarjeta">
              <button
                type="button"
                className="btn-editar"
                onClick={() => iniciarEdicion(item)}
              >
                Editar
              </button>

              <button
                type="button"
                className="btn-eliminar"
                onClick={() => manejarEliminar(item.id)}
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

export default IngredientesSection;
