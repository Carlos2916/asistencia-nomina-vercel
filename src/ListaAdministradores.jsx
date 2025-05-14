import React, { useEffect, useState } from 'react';
import supabase from './supabaseClient';

export default function ListaAdministradores({ volver }) {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    const cargarAdministradores = async () => {
      const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .eq("rol", "administrador");

      if (error) {
        alert("Error al cargar administradores");
        console.error(error);
      } else {
        setAdmins(data);
      }
    };

    cargarAdministradores();
  }, []);

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <button onClick={volver} className="mb-4 text-green-700 underline">← Volver</button>
      <h2 className="text-2xl font-bold text-green-800 mb-4">Administradores Actuales</h2>

      <div className="grid gap-4">
        {admins.map((admin) => (
          <div key={admin.id} className="bg-white p-4 rounded shadow space-y-2">
            <div className="font-bold text-lg text-green-700">👤 {admin.nombre}</div>
            <div className="text-sm text-gray-700">📧 {admin.email}</div>
            <div className="text-sm text-gray-600">
              🏢 Sucursales asignadas:{" "}
              {(admin.sucursales_asignadas || []).length > 0
                ? admin.sucursales_asignadas.join(", ")
                : "Ninguna"}
            </div>
            {/* Aquí puedes agregar acciones si quieres permitir editar */}
            {/* <button className="text-sm text-blue-600 underline">Editar</button> */}
          </div>
        ))}
      </div>
    </div>
  );
}
