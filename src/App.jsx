
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("login");
  const [form, setForm] = useState({ email: "", password: "" });

  const [empleado, setEmpleado] = useState({
    numero_empleado: "",
    nombres: "",
    apellido_paterno: "",
    apellido_materno: "",
    sucursal: "Cabos",
    fecha_ingreso: "",
    sueldo_quincenal: "",
    horas_extras: "",
    puesto: "",
  });

  const [empleados, setEmpleados] = useState([]);
  const [filtro, setFiltro] = useState("");
  const sucursales = ["Cabos", "Costa", "Bonfil", "Puerto", "Cedis", "Administrativo"];

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user);
        setView("dashboard");
      }
    });
  }, []);

  const handleLogin = async () => {
    const { error, data } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    if (error) return alert("Error al iniciar sesión");
    setUser(data.user);
    setView("dashboard");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setView("login");
  };

  const handleAltaEmpleado = async () => {
    const { error } = await supabase.from("empleados").insert([empleado]);
    if (error) {
      console.log("Error Supabase:", error);
      alert("Error al guardar empleado");
    } else {
      alert("Empleado guardado correctamente");
      setView("dashboard");
      setEmpleado({
        numero_empleado: "",
        nombres: "",
        apellido_paterno: "",
        apellido_materno: "",
        sucursal: "Cabos",
        fecha_ingreso: "",
        sueldo_quincenal: "",
        horas_extras: "",
        puesto: "",
      });
    }
  };

  const cargarEmpleados = async () => {
    const { data, error } = await supabase.from("empleados").select("*");
    if (!error) setEmpleados(data);
  };

  const filtrar = (emp) => {
    const texto = filtro.toLowerCase();
    return (
      emp.numero_empleado.toString().includes(texto) ||
      emp.nombres.toLowerCase().includes(texto) ||
      emp.apellido_paterno.toLowerCase().includes(texto) ||
      emp.apellido_materno.toLowerCase().includes(texto) ||
      emp.sucursal.toLowerCase().includes(texto) ||
      emp.puesto.toLowerCase().includes(texto)
    );
  };

  if (view === "login") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm space-y-4">
          <h1 className="text-2xl font-bold text-center text-green-700">Iniciar Sesión</h1>
          <input type="email" placeholder="Correo electrónico" className="w-full p-2 border rounded" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input type="password" placeholder="Contraseña" className="w-full p-2 border rounded" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button onClick={handleLogin} className="w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded">Entrar</button>
        </div>
      </div>
    );
  }

  if (view === "alta_empleado") {
    return (
      <div className="min-h-screen bg-green-50 p-6">
        <button onClick={() => setView("dashboard")} className="mb-4 text-green-700 underline">← Volver al inicio</button>
        <h2 className="text-2xl font-bold text-green-800 mb-4">Alta de empleado</h2>
        <div className="grid gap-4 max-w-xl">
          <input type="text" placeholder="Número de empleado" className="p-2 border rounded" value={empleado.numero_empleado} onChange={(e) => setEmpleado({ ...empleado, numero_empleado: e.target.value })} />
          <input type="text" placeholder="Nombre(s)" className="p-2 border rounded" value={empleado.nombres} onChange={(e) => setEmpleado({ ...empleado, nombres: e.target.value })} />
          <input type="text" placeholder="Apellido paterno" className="p-2 border rounded" value={empleado.apellido_paterno} onChange={(e) => setEmpleado({ ...empleado, apellido_paterno: e.target.value })} />
          <input type="text" placeholder="Apellido materno" className="p-2 border rounded" value={empleado.apellido_materno} onChange={(e) => setEmpleado({ ...empleado, apellido_materno: e.target.value })} />
          <select className="p-2 border rounded" value={empleado.sucursal} onChange={(e) => setEmpleado({ ...empleado, sucursal: e.target.value })}>
            {sucursales.map((suc) => <option key={suc} value={suc}>{suc}</option>)}
          </select>
          <input type="date" className="p-2 border rounded" value={empleado.fecha_ingreso} onChange={(e) => setEmpleado({ ...empleado, fecha_ingreso: e.target.value })} />
          <input type="number" placeholder="Sueldo quincenal (MXN)" className="p-2 border rounded" value={empleado.sueldo_quincenal} onChange={(e) => setEmpleado({ ...empleado, sueldo_quincenal: e.target.value })} />
          <input type="number" placeholder="Horas extras (MXN)" className="p-2 border rounded" value={empleado.horas_extras} onChange={(e) => setEmpleado({ ...empleado, horas_extras: e.target.value })} />
          <input type="text" placeholder="Puesto" className="p-2 border rounded" value={empleado.puesto} onChange={(e) => setEmpleado({ ...empleado, puesto: e.target.value })} />
          <button onClick={handleAltaEmpleado} className="bg-green-700 text-white p-2 rounded hover:bg-green-800">Guardar empleado</button>
        </div>
      </div>
    );
  }

  if (view === "consulta_empleados") {
    return (
      <div className="min-h-screen bg-green-50 p-6">
        <button onClick={() => setView("dashboard")} className="mb-4 text-green-700 underline">← Volver al inicio</button>
        <h2 className="text-2xl font-bold text-green-800 mb-4">Consulta de empleados</h2>
        <input type="text" className="p-2 mb-4 w-full max-w-md border rounded" placeholder="Buscar por cualquier campo" value={filtro} onChange={(e) => setFiltro(e.target.value)} />
        <div className="space-y-2">
          {empleados.filter(filtrar).map((emp) => (
            <div key={emp.id} className="bg-white p-4 rounded shadow cursor-pointer">
              <div className="font-bold">{emp.nombres} {emp.apellido_paterno}</div>
              <div className="text-sm text-gray-600">Sucursal: {emp.sucursal} — Puesto: {emp.puesto}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (view === "dashboard") {
    return (
      <div className="min-h-screen bg-green-50 p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-green-700">Bienvenido, {user.email}</h1>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">Cerrar sesión</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div onClick={() => setView("alta_empleado")} className="bg-white p-4 rounded-xl shadow hover:shadow-md cursor-pointer">
            <h2 className="text-lg font-semibold text-green-800">📋 Alta de empleados</h2>
            <p className="text-sm text-gray-600">Registra nuevos empleados al sistema.</p>
          </div>
          <div onClick={() => { cargarEmpleados(); setView("consulta_empleados"); }} className="bg-white p-4 rounded-xl shadow hover:shadow-md cursor-pointer">
            <h2 className="text-lg font-semibold text-green-800">🔍 Consultar empleados</h2>
            <p className="text-sm text-gray-600">Consulta y administra el personal registrado.</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
