
// App con formulario de alta de empleados corregido (solo un campo de sucursal tipo select)
import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

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

  const registrarEmpleado = async () => {
    const { error } = await supabase.from("empleados").insert([empleado]);
    if (error) return alert("Error al registrar empleado");
    alert("Empleado registrado correctamente");
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
  };

  if (view === "login") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-100">
        <div className="bg-white p-6 rounded-lg shadow w-full max-w-sm">
          <h2 className="text-xl font-bold mb-4 text-center text-green-700">Iniciar sesión</h2>
          <input type="email" placeholder="Correo" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full p-2 mb-2 border rounded" />
          <input type="password" placeholder="Contraseña" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full p-2 mb-4 border rounded" />
          <button onClick={handleLogin} className="w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded">Entrar</button>
        </div>
      </div>
    );
  }

  if (view === "dashboard") {
    return (
      <div className="min-h-screen p-6 bg-green-50">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-green-700">Bienvenido, {user.email}</h1>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">Cerrar sesión</button>
        </div>
        <div className="bg-white rounded-xl p-6 shadow max-w-2xl mx-auto">
          <h2 className="text-lg font-semibold mb-4">Alta de Empleado</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Número de empleado" type="number" value={empleado.numero_empleado} onChange={(e) => setEmpleado({ ...empleado, numero_empleado: e.target.value })} className="p-2 border rounded" />
            <input placeholder="Nombres" value={empleado.nombres} onChange={(e) => setEmpleado({ ...empleado, nombres: e.target.value })} className="p-2 border rounded" />
            <input placeholder="Apellido paterno" value={empleado.apellido_paterno} onChange={(e) => setEmpleado({ ...empleado, apellido_paterno: e.target.value })} className="p-2 border rounded" />
            <input placeholder="Apellido materno" value={empleado.apellido_materno} onChange={(e) => setEmpleado({ ...empleado, apellido_materno: e.target.value })} className="p-2 border rounded" />
            <select value={empleado.sucursal} onChange={(e) => setEmpleado({ ...empleado, sucursal: e.target.value })} className="p-2 border rounded">
              <option>Cabos</option>
              <option>Costa</option>
              <option>Bonfil</option>
              <option>Puerto</option>
              <option>Cedis</option>
              <option>Administrativo</option>
            </select>
            <input type="date" value={empleado.fecha_ingreso} onChange={(e) => setEmpleado({ ...empleado, fecha_ingreso: e.target.value })} className="p-2 border rounded" />
            <input placeholder="Sueldo quincenal" type="number" value={empleado.sueldo_quincenal} onChange={(e) => setEmpleado({ ...empleado, sueldo_quincenal: e.target.value })} className="p-2 border rounded" />
            <input placeholder="Horas extras" type="number" value={empleado.horas_extras} onChange={(e) => setEmpleado({ ...empleado, horas_extras: e.target.value })} className="p-2 border rounded" />
            <input placeholder="Puesto" value={empleado.puesto} onChange={(e) => setEmpleado({ ...empleado, puesto: e.target.value })} className="p-2 border rounded" />
          </div>
          <button onClick={registrarEmpleado} className="mt-4 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded">Registrar empleado</button>
        </div>
      </div>
    );
  }

  return null;
}
