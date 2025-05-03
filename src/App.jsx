import React, { useState } from "react";

export default function App() {
  const [logueado, setLogueado] = useState(false);
  const [tipoUsuario, setTipoUsuario] = useState("");
  const [formVisible, setFormVisible] = useState(null);
  const [empleados, setEmpleados] = useState([]);
  const [login, setLogin] = useState({ usuario: "", password: "" });
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    numero: "", nombre: "", paterno: "", materno: "", sucursal: "",
    ingreso: "", sueldo: "", extras: "", puesto: ""
  });

  const handleLogin = () => {
    if (login.usuario === "super" && login.password === "root") {
      setLogueado(true);
      setTipoUsuario("superusuario");
    } else if (login.usuario === "admin" && login.password === "1234") {
      setLogueado(true);
      setTipoUsuario("admin");
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  };

  const handleAddEmpleado = () => {
    const camposCompletos = Object.values(nuevoEmpleado).every(v => v.trim() !== "");
    if (tipoUsuario === "admin" && !camposCompletos) {
      alert("Debes llenar todos los campos");
      return;
    }
    setEmpleados([...empleados, nuevoEmpleado]);
    setNuevoEmpleado({ numero: "", nombre: "", paterno: "", materno: "", sucursal: "", ingreso: "", sueldo: "", extras: "", puesto: "" });
    alert("Empleado registrado correctamente");
  };

  if (!logueado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm space-y-4">
          <h1 className="text-xl font-bold text-center text-green-800">Login</h1>
          <input className="border p-2 rounded w-full" placeholder="Usuario" value={login.usuario} onChange={e => setLogin({ ...login, usuario: e.target.value })} />
          <input type="password" className="border p-2 rounded w-full" placeholder="Contraseña" value={login.password} onChange={e => setLogin({ ...login, password: e.target.value })} />
          <button onClick={handleLogin} className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">Entrar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-green-100 to-white space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-700">Bienvenido: {login.usuario} ({tipoUsuario})</h1>
        <button onClick={() => { setLogueado(false); setLogin({ usuario: "", password: "" }); }} className="bg-red-500 text-white px-3 py-1 rounded">Cerrar sesión</button>
      </div>
      <div className="space-x-4">
        <button onClick={() => setFormVisible("alta")} className="bg-green-600 text-white px-4 py-2 rounded shadow">➕ Alta empleados</button>
        <button onClick={() => setFormVisible("consulta")} className="bg-blue-600 text-white px-4 py-2 rounded shadow">📄 Consultar empleados</button>
      </div>

      {formVisible === "alta" && (
        <div className="bg-white p-6 mt-4 rounded-xl shadow space-y-3">
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
          <input type="date" className="p-2 border w-full rounded" value={nuevoEmpleado.ingreso} onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, ingreso: e.target.value })} />
          <input type="number" className="p-2 border w-full rounded" placeholder="Sueldo quincenal" value={nuevoEmpleado.sueldo} onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, sueldo: e.target.value })} />
          <input type="number" className="p-2 border w-full rounded" placeholder="Horas extras" value={nuevoEmpleado.extras} onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, extras: e.target.value })} />
          <button onClick={handleAddEmpleado} className="bg-green-500 text-white px-4 py-2 rounded shadow">Guardar empleado</button>
        </div>
      )}

      {formVisible === "consulta" && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-blue-700 mb-3">Empleados registrados</h2>
          <ul className="space-y-2">
            {empleados.map((e, idx) => (
              <li key={idx} className="border p-2 rounded bg-gray-50">
                <strong>{e.numero}</strong> - {e.nombre} {e.paterno} {e.materno} | {e.puesto} ({e.sucursal})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
