
// App con menú principal restaurado y limpio
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
          <div className="bg-white p-4 rounded-xl shadow hover:shadow-md cursor-pointer">
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
