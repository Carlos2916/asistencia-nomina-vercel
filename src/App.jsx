import React, { useState } from "react";

export default function App() {
  const [logueado, setLogueado] = useState(false);
  const [formVisible, setFormVisible] = useState(null);
  const [empleados, setEmpleados] = useState([]);
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    numero: "",
    nombre: "",
    paterno: "",
    materno: "",
    sucursal: "",
    ingreso: "",
    sueldo: "",
    extras: "",
    puesto: ""
  });

  const handleLogin = () => {
    setLogueado(true);
  };

  const handleAddEmpleado = () => {
    if (Object.values(nuevoEmpleado).some(val => val === "")) {
      alert("Completa todos los campos.");
      return;
    }
    setEmpleados([...empleados, nuevoEmpleado]);
    setNuevoEmpleado({ numero: "", nombre: "", paterno: "", materno: "", sucursal: "", ingreso: "", sueldo: "", extras: "", puesto: "" });
    alert("Empleado registrado correctamente.");
  };

  if (!logueado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-100">
        <div className="p-6 bg-white rounded-xl shadow text-center space-y-4">
          <h1 className="text-xl font-bold">Iniciar sesión</h1>
          <button onClick={handleLogin} className="bg-green-500 text-white px-4 py-2 rounded">Entrar como superusuario</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-green-50 space-y-4">
      <h1 className="text-2xl font-bold">Bienvenido</h1>
      <div className="space-x-4">
        <button onClick={() => setFormVisible("alta")} className="bg-green-600 text-white p-2 rounded">➕ Alta de empleados</button>
        <button onClick={() => setFormVisible("consulta")} className="bg-blue-600 text-white p-2 rounded">📄 Consultar empleados</button>
      </div>

      {formVisible === "alta" && (
        <div className="bg-white p-4 rounded shadow space-y-2 mt-4">
          <h2 className="font-bold">Registrar nuevo empleado</h2>
          <input className="p-2 border w-full rounded" placeholder="Número de empleado" value={nuevoEmpleado.numero} onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, numero: e.target.value })} />
          <input className="p-2 border w-full rounded" placeholder="Nombre(s)" value={nuevoEmpleado.nombre} onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, nombre: e.target.value })} />
          <input className="p-2 border w-full rounded" placeholder="Apellido paterno" value={nuevoEmpleado.paterno} onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, paterno: e.target.value })} />
          <input className="p-2 border w-full rounded" placeholder="Apellido materno" value={nuevoEmpleado.materno} onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, materno: e.target.value })} />
          <select className="p-2 border w-full rounded" value={nuevoEmpleado.sucursal} onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, sucursal: e.target.value })}>
            <option value="">Seleccione sucursal</option>
            <option value="Cabos">Cabos</option>
            <option value="Costa">Costa</option>
            <option value="Bonfil">Bonfil</option>
            <option value="Puerto">Puerto</option>
            <option value="Cedis">Cedis</option>
            <option value="Administrativo">Administrativo</option>
          </select>
          <input className="p-2 border w-full rounded" type="date" value={nuevoEmpleado.ingreso} onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, ingreso: e.target.value })} />
          <input className="p-2 border w-full rounded" type="number" placeholder="Sueldo quincenal (MXN)" value={nuevoEmpleado.sueldo} onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, sueldo: e.target.value })} />
          <input className="p-2 border w-full rounded" type="number" placeholder="Horas extras (MXN)" value={nuevoEmpleado.extras} onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, extras: e.target.value })} />
          <input className="p-2 border w-full rounded" placeholder="Puesto" value={nuevoEmpleado.puesto} onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, puesto: e.target.value })} />
          <button onClick={handleAddEmpleado} className="bg-green-600 text-white px-4 py-2 rounded">Guardar empleado</button>
        </div>
      )}

      {formVisible === "consulta" && (
        <div className="bg-white p-4 rounded shadow mt-4">
          <h2 className="font-bold mb-2">Lista de empleados registrados</h2>
          <ul className="space-y-2">
            {empleados.map((e, idx) => (
              <li key={idx} className="border p-2 rounded">
                <strong>{e.numero}</strong> - {e.nombre} {e.paterno} {e.materno} | {e.puesto} ({e.sucursal})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}