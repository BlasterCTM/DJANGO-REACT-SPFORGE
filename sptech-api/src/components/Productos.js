import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Productos = () => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [nuevoProducto, setNuevoProducto] = useState({
      nombre: '',
      categoria: null,
      precio: 0,
      descuento: 0,
      cantidad_disponibles: 0,
      imagen: null,
      total: 0,
    });
    const [productoEditando, setProductoEditando] = useState(null);
  
    const { nombre, categoria, precio, descuento, cantidad_disponibles, imagen, total } = nuevoProducto;

    const cargarProductos = async () => {
        try {
          const responseCategorias = await axios.get('http://localhost:8000/api/categorias/');
          setCategorias(responseCategorias.data);
      
          const responseProductos = await axios.get('http://localhost:8000/api/productos/');
          setProductos(responseProductos.data);
        } catch (error) {
          console.error('Error:', error);
        }
      };
      
      useEffect(() => {
        cargarProductos();
      }, []);
  

  const handleChange = (e) => {
    setNuevoProducto({ ...nuevoProducto, [e.target.name]: e.target.value });
  };

  const agregarEditarProducto = async () => {
    try {
      const categoriaExistente = categorias.find(categoria => categoria.id === parseInt(nuevoProducto.categoria, 10));
  
      if (!categoriaExistente) {
        console.error('La categoría seleccionada no es válida.');
        return;
      }
  
      const formData = new FormData();
      formData.append('nombre', nuevoProducto.nombre);
      formData.append('categoria', parseInt(nuevoProducto.categoria, 10));
      formData.append('precio', parseFloat(nuevoProducto.precio));
      formData.append('descuento', parseFloat(nuevoProducto.descuento));
      formData.append('cantidad_disponibles', parseInt(nuevoProducto.cantidad_disponibles));
      formData.append('total', parseFloat(nuevoProducto.total));
  
      if (productoEditando) {
        await axios.put(`http://localhost:8000/api/productos/${productoEditando.id}/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await axios.post('http://localhost:8000/api/productos/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
  
      cargarProductos();
      setNuevoProducto({
        categoria: null,
      });
      setProductoEditando(null);
    } catch (error) {
      console.error('Error al agregar/editar producto:', error);
    }
  };
  

  const editarProducto = (producto) => {
    setNuevoProducto({
      nombre: producto.nombre,
      categoria: producto.categoria,
      precio: producto.precio,
      descuento: producto.descuento,
      cantidad_disponibles: producto.cantidad_disponibles,
      imagen: producto.imagen,
      total: producto.total,
    });
    setProductoEditando(producto);
  };

  const cancelarEdicion = () => {
    setNuevoProducto({
      nombre: '',
      categoria: null,
      precio: 0,
      descuento: 0,
      cantidad_disponibles: 0,
      imagen: null,
      total: 0,
    });
    setProductoEditando(null);
  };

  const eliminarProducto = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/productos/${id}/`);
      cargarProductos();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  return (
    <div className="container mt-5">
      <h2>Productos</h2>

      <div className="mb-3">
        <label htmlFor="nombre" className="form-label">Nombre:</label>
        <input
          type="text"
          className="form-control"
          id="nombre"
          name="nombre"
          value={nuevoProducto.nombre}
          onChange={handleChange}
        />

        <label htmlFor="categoria" className="form-label mt-3">Categoría:</label>
        <select
          className="form-select"
          id="categoria"
          name="categoria"
          value={nuevoProducto.categoria}
          onChange={handleChange}
        >
          <option value={null}>Selecciona una categoría</option>
          {categorias.map(categoria => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nombre}
            </option>
          ))}
        </select>

        <label htmlFor="precio" className="form-label mt-3">Precio:</label>
        <input
          type="number"
          className="form-control"
          id="precio"
          name="precio"
          value={nuevoProducto.precio}
          onChange={handleChange}
        />

        <label htmlFor="descuento" className="form-label mt-3">Descuento:</label>
        <input
          type="number"
          className="form-control"
          id="descuento"
          name="descuento"
          value={nuevoProducto.descuento}
          onChange={handleChange}
        />

        <label htmlFor="cantidad_disponibles" className="form-label mt-3">Cantidad Disponibles:</label>
        <input
          type="number"
          className="form-control"
          id="cantidad_disponibles"
          name="cantidad_disponibles"
          value={nuevoProducto.cantidad_disponibles}
          onChange={handleChange}
        />

        

        <label htmlFor="total" className="form-label mt-3">Total:</label>
        <input
        type="number"
        className="form-control"
        id="total"
        name="total"
        value={nuevoProducto.total}
        onChange={handleChange}
        />

        <div className="mt-3">
          <button className="btn btn-primary me-2" onClick={agregarEditarProducto}>
            {productoEditando ? 'Editar Producto' : 'Agregar Producto'}
          </button>
          {productoEditando && (
            <button className="btn btn-secondary" onClick={cancelarEdicion}>
              Cancelar Edición
            </button>
          )}
        </div>
      </div>

      <ul className="list-group">
        {productos.map(producto => (
          <li key={producto.id} className="list-group-item d-flex justify-content-between align-items-center">
            {producto.nombre} - Precio: {producto.precio} - Descuento: {producto.descuento}%
            <div>
              <button className="btn btn-warning me-2" onClick={() => editarProducto(producto)}>
                Editar
              </button>
              <button className="btn btn-danger" onClick={() => eliminarProducto(producto.id)}>
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Productos;
