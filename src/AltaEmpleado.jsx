import React, { useState } from 'react';
import supabase from './supabaseClient';

export default function AltaEmpleado({ volver }) {
  const [empleado, setEmpleado] = useState({
    numero_empleado: "",
    nombres: "",
    apellido_paterno: "",
    apellido_materno: "",
    sexo: "",
    sucursal: "",
    fecha_ingreso: "",
    sueldo_quincenal: "",
    horas_extras: "",
    puesto: "",
  });

  const [empleadoFoto, setEmpleadoFoto] = useState(null);

  const sucursales = ["Cabos", "Costa", "Bonfil", "Puerto", "Cedis", "Cedis Adm", "Chichen"];
  const puestos = ["Gerente", "Supervisor", "Vendedor", "Chofer", "Almacenista", "Administrativo", "Auxiliar", "Contador", "Programador", "Encargado", "Aux Sistemas", "Arquitecto", "Aux Contable"];

  const handleAltaEmpleado = async () => {
    const camposObligatorios = [
      'numero_empleado',
      'nombres',
      'apellido_paterno',
      'apellido_materno',
      'sexo',
      'sucursal',
      'fecha_ingreso',
      'sueldo_quincenal',
      'horas_extras',
      'puesto'
    ];

    for (const campo of camposObligatorios) {
      if (!empleado[campo] || empleado[campo].toString().trim() === '') {
        return alert(`El campo "${campo.replace('_', ' ')}" es obligatorio.`);
      }
    }

    if (!empleadoFoto) {
      return alert("Por favor selecciona una foto");
    }

    const nombreArchivo = `foto-${empleado.numero_empleado}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from("empleadosfotos")
      .upload(nombreArchivo, empleadoFoto, { upsert: true });

    if (uploadError) {
      console.log(uploadError);
      return alert("Error al subir la foto");
    }

    const { data, error: urlError } = await supabase.storage
      .from("empleadosfotos")
      .createSignedUrl(nombreArchivo, 3600);

    if (urlError) {
      console.log(urlError);
      return alert("Error al generar URL de imagen");
    }

    const camposTexto = ["nombres", "apellido_paterno", "apellido_materno", "sexo", "puesto", "sucursal"];
    const empleadoFormateado = { ...empleado };
    camposTexto.forEach((campo) => {
      if (empleadoFormateado[campo]) {
        empleadoFormateado[campo] = empleadoFormateado[campo].toUpperCase();
      }
    });

    const nuevoEmpleado = {
      ...empleadoFormateado,
      foto_url: data.signedUrl,
    };

    const { error } = await supabase.from("empleados").insert([nuevoEmpleado]);

    if (error) {
      console.log("Error Supabase:", error);
      alert("Error al guardar empleado");
    } else {
      alert("Empleado guardado correctamente");
      volver();
    }
  };

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <button onClick={volver} className="mb-4 text-green-700 underline">← Volver al inicio</button>
      <h2 className="text-2xl font-bold text-green-800 mb-4">Alta de empleado</h2>
      <div className="grid gap-4 max-w-xl">
        <input type="text" placeholder="Número de empleado" className="p-2 border rounded" value={empleado.numero_empleado} onChange={(e) => setEmpleado({ ...empleado, numero_empleado: e.target.value })} />
        <input type="text" placeholder="Nombre(s)" className="p-2 border rounded" value={empleado.nombres} onChange={(e) => setEmpleado({ ...empleado, nombres: e.target.value })} />
        <input type="text" placeholder="Apellido paterno" className="p-2 border rounded" value={empleado.apellido_paterno} onChange={(e) => setEmpleado({ ...empleado, apellido_paterno: e.target.value })} />
        <input type="text" placeholder="Apellido materno" className="p-2 border rounded" value={empleado.apellido_materno} onChange={(e) => setEmpleado({ ...empleado, apellido_materno: e.target.value })} />

        <select className="p-2 border rounded" value={empleado.sexo} onChange={(e) => setEmpleado({ ...empleado, sexo: e.target.value })}>
          <option value="">Selecciona sexo</option>
          <option value="Hombre">Hombre</option>
          <option value="Mujer">Mujer</option>
        </select>

        <select className="p-2 border rounded" value={empleado.sucursal} onChange={(e) => setEmpleado({ ...empleado, sucursal: e.target.value })}>
          {sucursales.map((suc) => <option key={suc} value={suc}>{suc}</option>)}
        </select>

        <input type="date" className="p-2 border rounded" value={empleado.fecha_ingreso} onChange={(e) => setEmpleado({ ...empleado, fecha_ingreso: e.target.value })} />
        <input type="number" placeholder="Sueldo quincenal" className="p-2 border rounded" value={empleado.sueldo_quincenal} onChange={(e) => setEmpleado({ ...empleado, sueldo_quincenal: e.target.value })} />
        <input type="number" placeholder="Horas extras" className="p-2 border rounded" value={empleado.horas_extras} onChange={(e) => setEmpleado({ ...empleado, horas_extras: e.target.value })} />

        <select className="p-2 border rounded" value={empleado.puesto} onChange={(e) => setEmpleado({ ...empleado, puesto: e.target.value })}>
          <option value="">Selecciona puesto</option>
          {puestos.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>

        <input type="file" accept="image/*" onChange={(e) => setEmpleadoFoto(e.target.files[0])} />
        <button onClick={handleAltaEmpleado} className="bg-green-700 text-white p-2 rounded hover:bg-green-800">Guardar empleado</button>
      </div>
    </div>
  );
}
