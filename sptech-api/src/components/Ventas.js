import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Ventas = () => {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [nuevaVenta, setNuevaVenta] = useState({
    cliente: '',
    producto: '',  // Nuevo campo para el producto
    cantidad: 0,
    fecha: '',
  });
  const [ventaEditando, setVentaEditando] = useState(null);

  const cargarClientes = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/clientes/');
      setClientes(response.data);
    } catch (error) {
      console.error('Error cargando clientes:', error);
    }
  };

  const cargarProductos = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/productos/');
      setProductos(response.data);
    } catch (error) {
      console.error('Error cargando productos:', error);
    }
  };

  const cargarVentas = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/ventas/');
      setVentas(response.data);
    } catch (error) {
      console.error('Error cargando ventas:', error);
    }
  };

  const handleChange = (e) => {
    setNuevaVenta({ ...nuevaVenta, [e.target.name]: e.target.value });
  };

  const agregarEditarVenta = async () => {
    try {
      if (ventaEditando) {
        await axios.put(`http://localhost:8000/api/ventas/${ventaEditando.id}/`, nuevaVenta);
      } else {
        await axios.post('http://localhost:8000/api/ventas/', nuevaVenta);
      }
      cargarVentas();
      setNuevaVenta({
        cliente: '',
        producto: '',  // Restablece el campo de producto después de la venta
        cantidad: 0,
        fecha: '',
      });
      setVentaEditando(null);
    } catch (error) {
      console.error('Error al agregar/editar venta:', error);
    }
  };

  const editarVenta = (venta) => {
    setNuevaVenta({
      cliente: venta.cliente,
      producto: venta.producto,  // Asegúrate de que el nombre del campo coincida con tu modelo Django
      cantidad: venta.cantidad,
      fecha: venta.fecha,
    });
    setVentaEditando(venta);
  };

  const cancelarEdicion = () => {
    setNuevaVenta({
      cliente: '',
      producto: '',  // Restablece el campo de producto después de cancelar la edición
      cantidad: 0,
      fecha: '',
    });
    setVentaEditando(null);
  };

  const eliminarVenta = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/ventas/${id}/`);
      cargarVentas();
    } catch (error) {
      console.error('Error al eliminar venta:', error);
    }
  };

  useEffect(() => {
    cargarClientes();
    cargarProductos();
    cargarVentas();
  }, []);

  return (
    <div className="container mt-5">
      <h2>Ventas</h2>

      <div className="mb-3">
        {/* Campo de selección para los clientes */}
        <label htmlFor="cliente" className="form-label">Cliente:</label>
        <select
          className="form-control"
          id="cliente"
          name="cliente"
          value={nuevaVenta.cliente}
          onChange={handleChange}
        >
          <option value="">Seleccione un cliente</option>
          {clientes.map(cliente => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nombre} {cliente.apellido}
            </option>
          ))}
        </select>

        {/* Campo de selección para los productos */}
        <label htmlFor="producto" className="form-label mt-3">Producto:</label>
        <select
          className="form-control"
          id="producto"
          name="producto"
          value={nuevaVenta.producto}
          onChange={handleChange}
        >
          <option value="">Seleccione un producto</option>
          {productos.map(producto => (
            <option key={producto.id} value={producto.id}>
              {producto.nombre}
            </option>
          ))}
        </select>

        <label htmlFor="cantidad" className="form-label mt-3">Cantidad:</label>
        <input
          type="number"
          className="form-control"
          id="cantidad"
          name="cantidad"
          value={nuevaVenta.cantidad}
          onChange={handleChange}
        />

        <label htmlFor="fecha" className="form-label mt-3">Fecha:</label>
        <input
          type="date"
          className="form-control"
          id="fecha"
          name="fecha"
          value={nuevaVenta.fecha}
          onChange={handleChange}
        />

        <div className="mt-3">
          <button className="btn btn-primary me-2" onClick={agregarEditarVenta}>
            {ventaEditando ? 'Editar Venta' : 'Agregar Venta'}
          </button>
          {ventaEditando && (
            <button className="btn btn-secondary" onClick={cancelarEdicion}>
              Cancelar Edición
            </button>
          )}
        </div>
      </div>

      <ul className="list-group">
        {ventas.map(venta => (
          <li key={venta.id} className="list-group-item d-flex justify-content-between align-items-center">
            Cliente: {venta.cliente.nombre} {venta.cliente.apellido} - Producto: {venta.producto.nombre} - Cantidad: {venta.cantidad} - Fecha: {venta.fecha}
            <div>
              <button className="btn btn-warning me-2" onClick={() => editarVenta(venta)}>
                Editar
              </button>
              <button className="btn btn-danger" onClick={() => eliminarVenta(venta.id)}>
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Ventas;
