import React, { useEffect, useState } from 'react';
import supabase from './supabaseClient';

export default function ListaUsuarios({ volver }) {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const cargarUsuarios = async () => {
      const { data, error } = await supabase.from('usuarios').select('*');
      if (error) {
        console.error(error);
        alert('Error al cargar usuarios');
      } else {
        setUsuarios(data);
      }
    };
    cargarUsuarios();
  }, []);

  const cambiarRol = async (usuario, nuevoRol) => {
    const { error } = await supabase
      .from('usuarios')
      .update({ rol: nuevoRol })
      .eq('id', usuario.id);

    if (error) {
      console.error(error);
      alert('Error al actualizar rol');
    } else {
      alert(`Rol actualizado a ${nuevoRol}`);
      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === usuario.id ? { ...u, rol: nuevoRol } : u
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <button onClick={volver} className="mb-4 text-green-700 underline">← Volver</button>
      <h2 className="text-2xl font-bold text-green-800 mb-6">Usuarios del sistema</h2>
      <div className="grid gap-4">
        {usuarios.map((user) => (
          <div
            key={user.id}
            className="bg-white p-4 rounded-xl shadow hover:shadow-md space-y-2"
          >
            <div className="font-bold text-lg text-green-800">👤 {user.nombre}</div>
            <div className="text-sm text-gray-600">📧 {user.email}</div>
            <div className="text-sm text-gray-600">🏢 Sucursal: {user.sucursal}</div>
            <div className="text-sm text-blue-600">🔐 Rol: {user.rol}</div>

            {user.rol === 'usuario' && (
              <button
                onClick={() => cambiarRol(user, 'administrador')}
                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
              >
                🔁 Convertir en administrador
              </button>
            )}

            {user.rol === 'administrador' && (
              <button
                onClick={() => cambiarRol(user, 'usuario')}
                className="mt-2 bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded"
              >
                🔙 Revertir a usuario
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
