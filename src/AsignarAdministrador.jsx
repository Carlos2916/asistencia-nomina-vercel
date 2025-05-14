import React, { useEffect, useState } from 'react';
import supabase from './supabaseClient';

export default function AsignarAdministrador({ volver }) {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [sucursalesAsignadas, setSucursalesAsignadas] = useState([]);

  const sucursalesDisponibles = ["Cabos", "Costa", "Bonfil", "Puerto", "Cedis", "Cedis Adm", "Chichen"];

  useEffect(() => {
    const cargarUsuarios = async () => {
      const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .eq("rol", "usuario");

      if (error) {
        alert("Error al cargar usuarios");
        console.error(error);
      } else {
        setUsuarios(data);
      }
    };

    cargarUsuarios();
  }, []);

  const filtrarUsuarios = () => {
    const texto = busqueda.toLowerCase();
    return usuarios.filter(
      (u) =>
        u.nombre.toLowerCase().includes(texto) ||
        u.email.toLowerCase().includes(texto)
    );
  };

  const toggleSucursal = (sucursal) => {
    if (sucursalesAsignadas.includes(sucursal)) {
      setSucursalesAsignadas(sucursalesAsignadas.filter(s => s !== sucursal));
    } else {
      setSucursalesAsignadas([...sucursalesAsignadas, sucursal]);
    }
  };

  const asignarComoAdministrador = async () => {
    if (!usuarioSeleccionado) return;
    if (sucursalesAsignadas.length === 0) {
      return alert("Selecciona al menos una sucursal");
    }

    const { error } = await supabase
      .from("usuarios")
      .update({
        rol: "administrador",
        sucursales_asignadas: sucursalesAsignadas,
      })
      .eq("id", usuarioSeleccionado.id);

    if (error) {
      console.error(error);
      alert("Error al actualizar usuario");
    } else {
      alert("Administrador asignado correctamente");
      setUsuarioSeleccionado(null);
      setSucursalesAsignadas([]);
      volver(); // Regresa al dashboard
    }
  };

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <button onClick={volver} className="mb-4 text-green-700 underline">← Volver</button>
      <h2 className="text-2xl font-bold text-green-800 mb-4">Asignar Administrador</h2>

      {!usuarioSeleccionado ? (
        <>
          <input
            type="text"
            placeholder="Buscar por nombre o correo"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="p-2 border rounded mb-4 w-full max-w-md"
          />
          <div className="space-y-4">
            {filtrarUsuarios().map((u) => (
              <div key={u.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                <div>
                  <div className="font-bold">{u.nombre}</div>
                  <div className="text-sm text-gray-600">{u.email}</div>
                </div>
                <button
                  className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                  onClick={() => {
                    setUsuarioSeleccionado(u);
                    setSucursalesAsignadas([]);
                  }}
                >
                  Asignar
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-green-700">Selecciona sucursales para {usuarioSeleccionado.nombre}</h3>
          <div className="grid grid-cols-2 gap-2">
            {sucursalesDisponibles.map((sucursal) => (
              <label key={sucursal} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={sucursalesAsignadas.includes(sucursal)}
                  onChange={() => toggleSucursal(sucursal)}
                />
                <span>{sucursal}</span>
              </label>
            ))}
          </div>
          <button
            className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
            onClick={asignarComoAdministrador}
          >
            Confirmar asignación
          </button>
          <button
            className="text-sm text-red-600 underline mt-2"
            onClick={() => setUsuarioSeleccionado(null)}
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}
