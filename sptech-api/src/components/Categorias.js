import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [nuevaCategoria, setNuevaCategoria] = useState({ nombre: '' });
  const [categoriaEditando, setCategoriaEditando] = useState(null);

  const cargarCategorias = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/categorias/');
      setCategorias(response.data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const handleChange = (e) => {
    setNuevaCategoria({ ...nuevaCategoria, [e.target.name]: e.target.value });
  };

  const agregarEditarCategoria = async () => {
    try {
      if (categoriaEditando) {
        await axios.put(`http://localhost:8000/api/categorias/${categoriaEditando.id}/`, nuevaCategoria);
      } else {
        await axios.post('http://localhost:8000/api/categorias/', nuevaCategoria);
      }
      await cargarCategorias();
      setNuevaCategoria({ nombre: '' });
      setCategoriaEditando(null);
    } catch (error) {
      console.error('Error al agregar/editar categoría:', error);
    }
  };

  const editarCategoria = (categoria) => {
    setNuevaCategoria({ nombre: categoria.nombre });
    setCategoriaEditando(categoria);
  };

  const cancelarEdicion = () => {
    setNuevaCategoria({ nombre: '' });
    setCategoriaEditando(null);
  };

  const eliminarCategoria = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/categorias/${id}/`);
      await cargarCategorias();
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  return (
    <div className="container mt-5">
      <h2>Categorías</h2>

      <div className="mb-3">
        <label htmlFor="nombre" className="form-label">Nombre de la Categoría:</label>
        <input
          type="text"
          className="form-control"
          id="nombre"
          name="nombre"
          value={nuevaCategoria.nombre}
          onChange={handleChange}
        />

        <div className="mt-3">
          <button className="btn btn-primary me-2" onClick={agregarEditarCategoria}>
            {categoriaEditando ? 'Editar Categoría' : 'Agregar Categoría'}
          </button>
          {categoriaEditando && (
            <button className="btn btn-secondary" onClick={cancelarEdicion}>
              Cancelar Edición
            </button>
          )}
        </div>
      </div>

      <ul className="list-group">
        {categorias.map(categoria => (
          <li key={categoria.id} className="list-group-item d-flex justify-content-between align-items-center">
            {categoria.nombre}
            <div>
              <button className="btn btn-warning me-2" onClick={() => editarCategoria(categoria)}>
                Editar
              </button>
              <button className="btn btn-danger" onClick={() => eliminarCategoria(categoria.id)}>
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categorias;
