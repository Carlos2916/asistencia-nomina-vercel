// App mejorado con dashboard estilizado, login y formulario de alta de empleados conectado a Supabase
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
    sucursal: "",
    fecha_ingreso: "",
    sueldo_quincenal: "",
    horas_extras: "",
    puesto: "",
  });

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
    const campos = Object.values(empleado);
    if (campos.some((val) => val === "")) {
      alert("Por favor, completa todos los campos");
      return;
    }
    const { error } = await supabase.from("empleados").insert([empleado]);
    if (error) return alert("Error al guardar empleado");
    alert("✅ Empleado registrado correctamente");
    setEmpleado({
      numero_empleado: "",
      nombres: "",
      apellido_paterno: "",
      apellido_materno: "",
      sucursal: "",
      fecha_ingreso: "",
      sueldo_quincenal: "",
      horas_extras: "",
      puesto: "",
    });
    setView("dashboard");
  };

  if (view === "login") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm space-y-4">
          <h1 className="text-2xl font-bold text-center text-green-700">Iniciar Sesión</h1>
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full p-2 border rounded"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full p-2 border rounded"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button
            onClick={handleLogin}
            className="w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded"
          >
            Entrar
          </button>
        </div>
      </div>
    );
  }

  if (view === "alta") {
    return (
      <div className="min-h-screen bg-green-50 p-6 space-y-4">
        <h2 className="text-xl font-bold text-green-700">📋 Alta de empleado</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Número de empleado" className="p-2 border rounded" value={empleado.numero_empleado} onChange={(e) => setEmpleado({ ...empleado, numero_empleado: e.target.value })} />
          <input type="text" placeholder="Nombre(s)" className="p-2 border rounded" value={empleado.nombres} onChange={(e) => setEmpleado({ ...empleado, nombres: e.target.value })} />
          <input type="text" placeholder="Apellido paterno" className="p-2 border rounded" value={empleado.apellido_paterno} onChange={(e) => setEmpleado({ ...empleado, apellido_paterno: e.target.value })} />
          <input type="text" placeholder="Apellido materno" className="p-2 border rounded" value={empleado.apellido_materno} onChange={(e) => setEmpleado({ ...empleado, apellido_materno: e.target.value })} />
          <select className="p-2 border rounded" value={empleado.sucursal} onChange={(e) => setEmpleado({ ...empleado, sucursal: e.target.value })}>
            <option value="">Selecciona sucursal</option>
            <option value="Cabos">Cabos</option>
            <option value="Costa">Costa</option>
            <option value="Bonfil">Bonfil</option>
            <option value="Puerto">Puerto</option>
            <option value="Cedis">Cedis</option>
            <option value="Administrativo">Administrativo</option>
          </select>
          <input type="date" className="p-2 border rounded" value={empleado.fecha_ingreso} onChange={(e) => setEmpleado({ ...empleado, fecha_ingreso: e.target.value })} />
          <input type="number" placeholder="Sueldo quincenal" className="p-2 border rounded" value={empleado.sueldo_quincenal} onChange={(e) => setEmpleado({ ...empleado, sueldo_quincenal: e.target.value })} />
          <input type="number" placeholder="Horas extras" className="p-2 border rounded" value={empleado.horas_extras} onChange={(e) => setEmpleado({ ...empleado, horas_extras: e.target.value })} />
          <input type="text" placeholder="Puesto" className="p-2 border rounded" value={empleado.puesto} onChange={(e) => setEmpleado({ ...empleado, puesto: e.target.value })} />
        </div>
        <div className="flex space-x-4 mt-4">
          <button onClick={handleAltaEmpleado} className="bg-green-600 text-white px-4 py-2 rounded">Guardar</button>
          <button onClick={() => setView("dashboard")} className="bg-gray-300 px-4 py-2 rounded">Cancelar</button>
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
          <div className="bg-white p-4 rounded-xl shadow hover:shadow-md cursor-pointer" onClick={() => setView("alta") }>
            <h2 className="text-lg font-semibold text-green-800">📋 Alta de empleados</h2>
            <p className="text-sm text-gray-600">Registra nuevos empleados al sistema.</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow hover:shadow-md cursor-pointer">
            <h2 className="text-lg font-semibold text-green-800">🔍 Consultar empleados</h2>
            <p className="text-sm text-gray-600">Consulta y administra el personal registrado.</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
