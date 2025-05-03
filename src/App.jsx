// App moderna conectada a Supabase con diseño elegante
import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://jkhjxjpseqloqbabsrnx.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpraGp4anBzZXFsb3FiYWJzcm54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMjkzMzYsImV4cCI6MjA2MTgwNTMzNn0.mgqgvFTNQ_hGq_oF6cT2rkyJjC-hOudalTBRZX5XhT0";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function App() {
  const [user, setUser] = useState(null);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [empleados, setEmpleados] = useState([]);
  const [formVisible, setFormVisible] = useState(null);
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
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (user) fetchEmpleados();
  }, [user]);

  const mostrarMensaje = (texto) => {
    setMensaje(texto);
    setTimeout(() => setMensaje(""), 3000);
  };

  const fetchEmpleados = async () => {
    const { data, error } = await supabase.from("empleados").select("*");
    if (!error) setEmpleados(data);
  };

  const handleLogin = () => {
    if (loginData.username === "super" && loginData.password === "root") {
      setUser({ nombre: "Carlos", tipo: "superusuario" });
      mostrarMensaje("🔓 Sesión iniciada como superusuario");
    } else if (loginData.username === "admin" && loginData.password === "1234") {
      setUser({ nombre: "Admin", tipo: "admin" });
      mostrarMensaje("🔓 Sesión iniciada como administrador");
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  };

  const handleAddEmpleado = async () => {
    const camposCompletos = Object.values(nuevoEmpleado).every(val => val.trim() !== "");
    if (user.tipo === "admin" && !camposCompletos) {
      alert("Como administrador, debes llenar todos los campos.");
      return;
    }
    const { error } = await supabase.from("empleados").insert([nuevoEmpleado]);
    if (!error) {
      mostrarMensaje("✅ Empleado guardado en Supabase");
      setNuevoEmpleado({ numero: "", nombre: "", paterno: "", materno: "", sucursal: "", ingreso: "", sueldo: "", extras: "", puesto: "" });
      fetchEmpleados();
    } else {
      alert("❌ Error al guardar en Supabase");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-100">
        <div className="w-full max-w-sm p-6 bg-white rounded-xl shadow-xl">
          <h1 className="text-2xl font-bold mb-4 text-center">Iniciar sesión</h1>
          <input className="mb-2 w-full p-2 border rounded" placeholder="Usuario" value={loginData.username} onChange={e => setLoginData({ ...loginData, username: e.target.value })} />
          <input className="mb-4 w-full p-2 border rounded" placeholder="Contraseña" type="password" value={loginData.password} onChange={e => setLoginData({ ...loginData, password: e.target.value })} />
          <button className="w-full bg-green-600 text-white p-2 rounded" onClick={handleLogin}>Entrar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-green-50 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">👋 Bienvenido, {user.nombre}</h1>
        <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => location.reload()}>Cerrar sesión</button>
      </div>

      {mensaje && <div className="bg-green-200 text-green-800 p-2 rounded-xl">{mensaje}</div>}

      <div className="space-x-3">
        <button onClick={() => setFormVisible("alta")} className="bg-green-600 text-white px-4 py-2 rounded">➕ Alta empleados</button>
        <button onClick={() => setFormVisible("consulta")} className="bg-blue-600 text-white px-4 py-2 rounded">📄 Consultar empleados</button>
      </div>

      {formVisible === "alta" && (
        <div className="p-4 bg-white rounded shadow-md space-y-2">
          <h2 className="font-bold text-lg">➕ Registrar nuevo empleado</h2>
          <input className="p-2 border w-full rounded" placeholder="Número de empleado" value={nuevoEmpleado.numero} onChange={e => setNuevoEmpleado({ ...nuevoEmpleado, numero: e.target.value })} />
          <input className="p-2 border w-full rounded" placeholder="Nombre(s)" value={nuevoEmpleado.nombre} onChange={e => setNuevoEmpleado({ ...nuevoEmpleado, nombre: e.target.value })} />
          <input className="p-2 border w-full rounded" placeholder="Apellido paterno" value={nuevoEmpleado.paterno} onChange={e => setNuevoEmpleado({ ...nuevoEmpleado, paterno: e.target.value })} />
          <input className="p-2 border w-full rounded" placeholder="Apellido materno" value={nuevoEmpleado.materno} onChange={e => setNuevoEmpleado({ ...nuevoEmpleado, materno: e.target.value })} />
          <select className="p-2 border w-full rounded" value={nuevoEmpleado.sucursal} onChange={e => setNuevoEmpleado({ ...nuevoEmpleado, sucursal: e.target.value })}>
            <option value="">Seleccione una sucursal</option>
            <option value="Cabos">Cabos</option>
            <option value="Costa">Costa</option>
            <option value="Bonfil">Bonfil</option>
            <option value="Puerto">Puerto</option>
            <option value="Cedis">Cedis</option>
            <option value="Administrativo">Administrativo</option>
          </select>
          <input type="date" className="p-2 border w-full rounded" value={nuevoEmpleado.ingreso} onChange={e => setNuevoEmpleado({ ...nuevoEmpleado, ingreso: e.target.value })} />
          <input type="number" className="p-2 border w-full rounded" placeholder="Sueldo quincenal" value={nuevoEmpleado.sueldo} onChange={e => setNuevoEmpleado({ ...nuevoEmpleado, sueldo: e.target.value })} />
          <input type="number" className="p-2 border w-full rounded" placeholder="Horas extras" value={nuevoEmpleado.extras} onChange={e => setNuevoEmpleado({ ...nuevoEmpleado, extras: e.target.value })} />
          <input className="p-2 border w-full rounded" placeholder="Puesto" value={nuevoEmpleado.puesto} onChange={e => setNuevoEmpleado({ ...nuevoEmpleado, puesto: e.target.value })} />
          <button className="bg-green-700 text-white p-2 rounded" onClick={handleAddEmpleado}>Guardar</button>
        </div>
      )}

      {formVisible === "consulta" && (
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-bold mb-2">📋 Lista de empleados</h2>
          <ul className="space-y-1">
            {empleados.map((e, i) => (
              <li key={i} className="border-b p-2">
                <strong>{e.numero}</strong> - {e.nombre} {e.paterno} {e.materno} | {e.puesto} ({e.sucursal})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
