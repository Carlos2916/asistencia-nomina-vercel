import React, { useEffect, useState } from 'react';
import supabase from './supabaseClient';

export default function ConvertirImportados({ volver, usuario }) {
  const [empleadosNoUsuarios, setEmpleadosNoUsuarios] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);

  useEffect(() => {
    const cargar = async () => {
      const { data: empleados, error: empError } = await supabase.from('empleados').select('*');
      const { data: usuarios, error: usrError } = await supabase.from('usuarios').select('email');

      if (empError || usrError) {
        console.error(empError || usrError);
        return alert('Error al cargar datos');
      }

      const existentes = new Set(usuarios.map(u => u.email));
      const filtrados = empleados.filter(e => {
        const anio = e.fecha_ingreso?.split('-')[0];
        const correo = `${e.nombres?.toLowerCase().split(" ")[0]}${anio}@empresa.local`;
        return !existentes.has(correo);
      });

      setEmpleadosNoUsuarios(filtrados);
    };

    cargar();
  }, []);

  const toggleSeleccion = (emp) => {
    const existe = seleccionados.find(s => s.numero_empleado === emp.numero_empleado && s.sucursal === emp.sucursal);
    if (existe) {
      setSeleccionados(seleccionados.filter(s => s.numero_empleado !== emp.numero_empleado || s.sucursal !== emp.sucursal));
    } else {
      setSeleccionados([...seleccionados, emp]);
    }
  };

  const convertirSeleccionados = async () => {
    if (seleccionados.length === 0) return alert('Selecciona al menos un empleado');

    for (const emp of seleccionados) {
      const anio = emp.fecha_ingreso?.split('-')[0];
      const correo = `${emp.nombres.toLowerCase().split(" ")[0]}${anio}@empresa.local`;
      const contrasena = `${emp.apellido_paterno.toLowerCase()}${anio}`;

      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: correo,
        password: contrasena,
        email_confirm: true
      });

      if (authError) {
        console.error("Error al crear auth:", authError);
        alert(`Error con ${emp.nombres} ${emp.apellido_paterno}`);
        continue;
      }

      await supabase.from('usuarios').insert({
        id: authUser.user.id,
        email: correo,
        nombre: `${emp.nombres} ${emp.apellido_paterno}`,
        rol: 'usuario',
        sucursal: emp.sucursal
      });
    }

    alert('Usuarios creados correctamente');
    volver();
  };

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <button onClick={volver} className="mb-4 text-green-700 underline">← Volver</button>
      <h2 className="text-2xl font-bold text-green-800 mb-4">Convertir empleados importados</h2>

      {empleadosNoUsuarios.length === 0 ? (
        <p className="text-gray-600">No hay empleados pendientes por convertir.</p>
      ) : (
        <>
          <p className="text-sm text-gray-600 mb-4">Selecciona los empleados que deseas convertir en usuarios.</p>
          <div className="space-y-2">
            {empleadosNoUsuarios.map(emp => {
              const seleccionado = seleccionados.find(s => s.numero_empleado === emp.numero_empleado && s.sucursal === emp.sucursal);
              return (
                <div
                  key={`${emp.numero_empleado}-${emp.sucursal}`}
                  onClick={() => toggleSeleccion(emp)}
                  className={`p-4 rounded border cursor-pointer ${seleccionado ? 'bg-green-100 border-green-500' : 'bg-white'}`}
                >
                  <div className="font-bold">{emp.nombres} {emp.apellido_paterno}</div>
                  <div className="text-sm text-gray-600">N°: {emp.numero_empleado} • Sucursal: {emp.sucursal}</div>
                </div>
              );
            })}
          </div>

          <button
            onClick={convertirSeleccionados}
            className="mt-6 w-full bg-green-700 hover:bg-green-800 text-white py-2 px-4 rounded-lg shadow"
          >
            ✅ Convertir seleccionados en usuarios
          </button>
        </>
      )}
    </div>
  );
}
