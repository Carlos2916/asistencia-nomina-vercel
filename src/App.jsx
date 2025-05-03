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

  const handleLogin = () => setLogueado(true);

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
      <div className="min-h-screen flex items-center justify-center bg-[#f0fff4]">
        <div className="p-8 bg-white rounded-2xl shadow-xl text-center space-y-4 border border-green-300">
          <h1 className="text-3xl font-bold text-green-700">Bienvenido</h1>
          <p className="text-gray-600">Sistema de Asistencia y Nómina</p>
          <button onClick={handleLogin} className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full shadow">Entrar como superusuario</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-green-100 to-white space-y-4">
      <h1 className="text-2xl font-bold text-green-800">Hola, superusuario 👋</h1>
      <div className="space-x-4 mb-4">
        <button onClick={() => setFormVisible("alta")} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow">➕ Alta de empleados</button>
        <button onClick={() => setFormVisible("consulta")} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow">📄 Consultar empleados</button>
      </div>

      {formVisible === "alta" && (
        <div className="bg-white p-6 rounded-xl shadow space-y-3 border border-green-200">
          <h2 className="text-xl font-semibold text-green-700">Registrar nuevo empleado</h2>
          {["numero", "nombre", "paterno", "materno", "puesto"].map((campo) => (
            <input key={campo} className="p-2 border w-full rounded" placeholder={campo.charAt(0).toUpperCase() + campo.slice(1)} value={nuevoEmpleado[campo]} onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, [campo]: e.target.value })} />
          ))}
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
          <button onClick={handleAddEmpleado} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow">Guardar empleado</button>
        </div>
      )}

      {formVisible === "consulta" && (
        <div className="bg-white p-6 rounded-xl shadow border border-blue-200">
          <h2 className="text-xl font-semibold text-blue-700 mb-3">Empleados registrados</h2>
          <ul className="space-y-2">
            {empleados.map((e, idx) => (
              <li key={idx} className="border border-gray-300 p-3 rounded bg-gray-50">
                <strong>{e.numero}</strong> - {e.nombre} {e.paterno} {e.materno} | {e.puesto} ({e.sucursal})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
