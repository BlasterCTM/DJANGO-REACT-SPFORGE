// src/components/Clientes.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [nuevoCliente, setNuevoCliente] = useState({ nombre: '', apellido: '', cedula: '' });
  const [clienteEditando, setClienteEditando] = useState(null);

  // Función para cargar la lista de clientes
  const cargarClientes = () => {
    axios.get('http://localhost:8000/api/clientes/')
      .then(response => setClientes(response.data))
      .catch(error => console.error('Error:', error));
  };

  // Función para manejar cambios en el formulario de nuevo cliente
  const handleChange = (e) => {
    setNuevoCliente({ ...nuevoCliente, [e.target.name]: e.target.value });
  };

  // Función para agregar o editar un cliente
  const agregarEditarCliente = async () => {
    try {
      if (clienteEditando) {
        // Si estamos editando, realiza una solicitud PUT
        await axios.put(`http://localhost:8000/api/clientes/${clienteEditando.id}/`, nuevoCliente);
      } else {
        // Si no estamos editando, realiza una solicitud POST
        await axios.post('http://localhost:8000/api/clientes/', nuevoCliente);
      }
      cargarClientes(); // Actualizar la lista después de agregar/editar un cliente
      setNuevoCliente({ nombre: '', apellido: '', cedula: '' });
      setClienteEditando(null); // Limpiar la información de cliente en edición
    } catch (error) {
      console.error('Error al agregar/editar cliente:', error);
    }
  };

  // Función para cargar la información de un cliente para editar
  const editarCliente = (cliente) => {
    setNuevoCliente({ nombre: cliente.nombre, apellido: cliente.apellido, cedula: cliente.cedula });
    setClienteEditando(cliente);
  };

  // Función para cancelar la edición y limpiar el formulario
  const cancelarEdicion = () => {
    setNuevoCliente({ nombre: '', apellido: '', cedula: '' });
    setClienteEditando(null);
  };

  // Función para eliminar un cliente
  const eliminarCliente = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/clientes/${id}/`);
      cargarClientes(); // Actualizar la lista después de eliminar un cliente
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []); // Se ejecuta solo al montar el componente

  return (
    <div>
      <h2>Clientes</h2>

      {/* Formulario para agregar o editar un cliente */}
      <div className="mb-3">
        <label htmlFor="nombre" className="form-label">Nombre:</label>
        <input
          type="text"
          className="form-control"
          id="nombre"
          name="nombre"
          value={nuevoCliente.nombre}
          onChange={handleChange}
        />
        <label htmlFor="apellido" className="form-label">Apellido:</label>
        <input
          type="text"
          className="form-control"
          id="apellido"
          name="apellido"
          value={nuevoCliente.apellido}
          onChange={handleChange}
        />
        <label htmlFor="cedula" className="form-label">Cédula:</label>
        <input
          type="text"
          className="form-control"
          id="cedula"
          name="cedula"
          value={nuevoCliente.cedula}
          onChange={handleChange}
        />
        <div className="mt-2">
          <button className="btn btn-primary me-2" onClick={agregarEditarCliente}>
            {clienteEditando ? 'Editar Cliente' : 'Agregar Cliente'}
          </button>
          {clienteEditando && (
            <button className="btn btn-secondary" onClick={cancelarEdicion}>
              Cancelar Edición
            </button>
          )}
        </div>
      </div>

      {/* Lista de clientes */}
      <ul className="list-group">
        {clientes.map(cliente => (
          <li key={cliente.id} className="list-group-item d-flex justify-content-between align-items-center">
            {cliente.nombre} {cliente.apellido} - Cédula: {cliente.cedula}
            <div>
              <button className="btn btn-warning me-2" onClick={() => editarCliente(cliente)}>
                Editar
              </button>
              <button className="btn btn-danger" onClick={() => eliminarCliente(cliente.id)}>
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Clientes;
