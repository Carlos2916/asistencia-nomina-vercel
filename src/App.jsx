import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import AltaEmpleado from './AltaEmpleado';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("login");
  const [form, setForm] = useState({ email: "", password: "" });
  const [empleados, setEmpleados] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);

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

  const cargarEmpleados = async () => {
    const { data, error } = await supabase.from("empleados").select("*");
    if (!error) setEmpleados(data);
  };

  const actualizarEmpleado = async () => {
    const { error } = await supabase
      .from("empleados")
      .update(empleadoSeleccionado)
      .eq("id", empleadoSeleccionado.id);
    if (error) {
      alert("Error al actualizar");
    } else {
      alert("Empleado actualizado");
      setEmpleadoSeleccionado(null);
      cargarEmpleados();
      setView("consulta_empleados");
    }
  };

  const eliminarEmpleado = async () => {
    if (!confirm("¿Estás seguro de eliminar este empleado?")) return;
    const { error } = await supabase
      .from("empleados")
      .delete()
      .eq("id", empleadoSeleccionado.id);
    if (error) {
      alert("Error al eliminar empleado");
      console.log(error);
    } else {
      alert("Empleado eliminado correctamente");
      setEmpleadoSeleccionado(null);
      cargarEmpleados();
      setView("consulta_empleados");
    }
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
    return <AltaEmpleado volver={() => setView("dashboard")} />;
  }

  if (view === "consulta_empleados") {
    return (
      <div className="min-h-screen bg-green-50 p-6">
        <button onClick={() => setView("dashboard")} className="mb-4 text-green-700 underline">← Volver al inicio</button>
        <h2 className="text-2xl font-bold text-green-800 mb-4">Consulta de empleados</h2>
        <input type="text" className="p-2 mb-4 w-full max-w-md border rounded" placeholder="Buscar por cualquier campo" value={filtro} onChange={(e) => setFiltro(e.target.value)} />
        <div className="grid gap-4">
          {empleados.filter(filtrar).map((emp) => (
            <div key={emp.id} onClick={() => { setEmpleadoSeleccionado(emp); setView("cardex"); }} className="bg-white p-4 rounded-xl shadow hover:shadow-md cursor-pointer space-y-1">
              <div className="font-bold text-lg text-green-800">👤 {emp.nombres} {emp.apellido_paterno} {emp.apellido_materno}</div>
              <div className="text-sm text-gray-600">🧾 Número: {emp.numero_empleado} • Puesto: {emp.puesto}</div>
              <div className="text-sm text-gray-600">🏢 Sucursal: {emp.sucursal}</div>
              <div className="text-sm text-gray-600">💵 Sueldo: ${emp.sueldo_quincenal} • Extras: ${emp.horas_extras}</div>
              <div className="text-sm text-gray-600">📅 Ingreso: {emp.fecha_ingreso}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (view === "cardex" && empleadoSeleccionado) {
    return (
      <div className="min-h-screen bg-green-50 p-6">
        <button onClick={() => setView("consulta_empleados")} className="mb-4 text-green-700 underline">← Volver</button>
        <h2 className="text-2xl font-bold text-green-800 mb-4">Editar Empleado</h2>
        <div className="grid gap-4 max-w-xl">
          {empleadoSeleccionado.foto_url && (
            <div className="mb-4">
              <img
                src={empleadoSeleccionado.foto_url}
                alt="Foto del empleado"
                className="w-32 h-32 object-cover rounded-full border"
              />
            </div>
          )}
          <input type="text" className="p-2 border rounded" value={empleadoSeleccionado.numero_empleado} onChange={(e) => setEmpleadoSeleccionado({ ...empleadoSeleccionado, numero_empleado: e.target.value })} placeholder="Número de empleado" />
          <input type="text" className="p-2 border rounded" value={empleadoSeleccionado.nombres} onChange={(e) => setEmpleadoSeleccionado({ ...empleadoSeleccionado, nombres: e.target.value })} placeholder="Nombre(s)" />
          <input type="text" className="p-2 border rounded" value={empleadoSeleccionado.apellido_paterno} onChange={(e) => setEmpleadoSeleccionado({ ...empleadoSeleccionado, apellido_paterno: e.target.value })} placeholder="Apellido paterno" />
          <input type="text" className="p-2 border rounded" value={empleadoSeleccionado.apellido_materno} onChange={(e) => setEmpleadoSeleccionado({ ...empleadoSeleccionado, apellido_materno: e.target.value })} placeholder="Apellido materno" />
          <select className="p-2 border rounded" value={empleadoSeleccionado.sucursal} onChange={(e) => setEmpleadoSeleccionado({ ...empleadoSeleccionado, sucursal: e.target.value })}>
            {sucursales.map((suc) => <option key={suc} value={suc}>{suc}</option>)}
          </select>
          <input type="date" className="p-2 border rounded" value={empleadoSeleccionado.fecha_ingreso} onChange={(e) => setEmpleadoSeleccionado({ ...empleadoSeleccionado, fecha_ingreso: e.target.value })} />
          <input type="number" className="p-2 border rounded" value={empleadoSeleccionado.sueldo_quincenal} onChange={(e) => setEmpleadoSeleccionado({ ...empleadoSeleccionado, sueldo_quincenal: e.target.value })} placeholder="Sueldo quincenal" />
          <input type="number" className="p-2 border rounded" value={empleadoSeleccionado.horas_extras} onChange={(e) => setEmpleadoSeleccionado({ ...empleadoSeleccionado, horas_extras: e.target.value })} placeholder="Horas extras" />
          <input type="text" className="p-2 border rounded" value={empleadoSeleccionado.puesto} onChange={(e) => setEmpleadoSeleccionado({ ...empleadoSeleccionado, puesto: e.target.value })} placeholder="Puesto" />
          <button onClick={actualizarEmpleado} className="bg-green-700 text-white p-2 rounded hover:bg-green-800">Guardar cambios</button>
          <button onClick={eliminarEmpleado} className="bg-red-600 text-white p-2 rounded hover:bg-red-700">Eliminar empleado</button>
        </div>
      </div>
    );
  }

  if (view === "dashboard") {
    return (
      <div className="min-h-screen bg-green-50 p-6">
        <div className="flex justify-between mb-6">
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
