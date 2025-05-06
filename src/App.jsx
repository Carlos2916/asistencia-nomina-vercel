
// App mejorado con alta de empleados y corrección de campo duplicado
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
  const [employee, setEmployee] = useState({
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
    const { error } = await supabase.from("empleados").insert([employee]);
    if (error) {
      alert("Error al registrar empleado");
    } else {
      alert("Empleado registrado correctamente");
      setEmployee({
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
    }
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

  if (view === "dashboard") {
    return (
      <div className="min-h-screen bg-green-50 p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-green-700">Bienvenido, {user.email}</h1>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">Cerrar sesión</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl shadow space-y-2">
            <h2 className="text-lg font-semibold text-green-800">📋 Alta de empleados</h2>
            <input
              type="text"
              placeholder="Número de empleado"
              className="w-full p-2 border rounded"
              value={employee.numero_empleado}
              onChange={(e) => setEmployee({ ...employee, numero_empleado: e.target.value })}
            />
            <input
              type="text"
              placeholder="Nombres"
              className="w-full p-2 border rounded"
              value={employee.nombres}
              onChange={(e) => setEmployee({ ...employee, nombres: e.target.value })}
            />
            <input
              type="text"
              placeholder="Apellido paterno"
              className="w-full p-2 border rounded"
              value={employee.apellido_paterno}
              onChange={(e) => setEmployee({ ...employee, apellido_paterno: e.target.value })}
            />
            <input
              type="text"
              placeholder="Apellido materno"
              className="w-full p-2 border rounded"
              value={employee.apellido_materno}
              onChange={(e) => setEmployee({ ...employee, apellido_materno: e.target.value })}
            />
            <select
              className="w-full p-2 border rounded"
              value={employee.sucursal}
              onChange={(e) => setEmployee({ ...employee, sucursal: e.target.value })}
            >
              <option value="">Selecciona sucursal</option>
              <option value="Cabos">Cabos</option>
              <option value="Costa">Costa</option>
              <option value="Bonfil">Bonfil</option>
              <option value="Puerto">Puerto</option>
              <option value="Cedis">Cedis</option>
              <option value="Administrativo">Administrativo</option>
            </select>
            <input
              type="date"
              className="w-full p-2 border rounded"
              value={employee.fecha_ingreso}
              onChange={(e) => setEmployee({ ...employee, fecha_ingreso: e.target.value })}
            />
            <input
              type="number"
              placeholder="Sueldo quincenal (MXN)"
              className="w-full p-2 border rounded"
              value={employee.sueldo_quincenal}
              onChange={(e) => setEmployee({ ...employee, sueldo_quincenal: e.target.value })}
            />
            <input
              type="number"
              placeholder="Horas extras (MXN)"
              className="w-full p-2 border rounded"
              value={employee.horas_extras}
              onChange={(e) => setEmployee({ ...employee, horas_extras: e.target.value })}
            />
            <input
              type="text"
              placeholder="Puesto"
              className="w-full p-2 border rounded"
              value={employee.puesto}
              onChange={(e) => setEmployee({ ...employee, puesto: e.target.value })}
            />
            <button
              onClick={handleAltaEmpleado}
              className="w-full bg-green-700 text-white p-2 rounded"
            >
              Registrar empleado
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
