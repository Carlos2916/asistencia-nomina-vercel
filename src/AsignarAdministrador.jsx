import React, { useEffect, useState } from 'react';
import supabase from './supabaseClient';

export default function AsignarAdministrador({ volver }) {
  const [usuarios, setUsuarios] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);

  useEffect(() => {
    const cargarUsuarios = async () => {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('rol', 'usuario');

      if (error) {
        alert('Error al cargar usuarios');
        console.error(error);
      } else {
        setUsuarios(data);
      }
    };

    cargarUsuarios();
  }, []);

  const asignarAdministrador = async () => {
    if (!seleccionado) return alert("Selecciona un usuario");

    // Buscar todas las sucursales donde haya empleados
    const { data: empleados, error: empError } = await supabase
      .from("empleados")
      .select("sucursal");

    if (empError) {
      console.error(empError);
      return alert("Error al buscar sucursales");
    }

    const sucursalesUnicas = [
      ...new Set(empleados.map(emp => emp.sucursal))
    ];

    // Actualizar el usuario seleccionado
    const { error: updateError } = await supabase
      .from("usuarios")
      .update({
        rol: "administrador",
        sucursales_asignadas: sucursalesUnicas
      })
      .eq("id", seleccionado.id);

    if (updateError) {
      console.error(updateError);
      return alert("Error al asignar rol");
    }

    alert("Administrador asignado correctamente");
    volver();
  };

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <button onClick={volver} className="mb-4 text-green-700 underline">← Volver</button>
      <h2 className="text-2xl font-bold text-green-800 mb-4">Asignar Administrador</h2>

      <div className="space-y-4 max-w-xl">
        {usuarios.map((user) => (
          <div
            key={user.id}
            className={`p-4 rounded border cursor-pointer shadow ${seleccionado?.id === user.id ? "bg-green-100 border-green-600" : "bg-white"}`}
            onClick={() => setSeleccionado(user)}
          >
            <div className="font-bold text-green-700">{user.nombre}</div>
            <div className="text-sm text-gray-600">📧 {user.email}</div>
          </div>
        ))}

        <button
          onClick={asignarAdministrador}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow"
        >
          ✅ Convertir en administrador
        </button>
      </div>
    </div>
  );
}
