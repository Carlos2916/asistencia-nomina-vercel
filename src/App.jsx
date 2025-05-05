// App conectado a Supabase con autenticación y registro
import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Inicializa Supabase
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usuario, setUsuario] = useState(null);
  const [modoRegistro, setModoRegistro] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const mostrarMensaje = (msg) => {
    setMensaje(msg);
    setTimeout(() => setMensaje(""), 3000);
  };

  const registrar = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) return mostrarMensaje("❌ Error al registrar: " + error.message);
    mostrarMensaje("✅ Registro exitoso. Revisa tu correo para confirmar.");
  };

  const login = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return mostrarMensaje("❌ Usuario o contraseña incorrectos");
    setUsuario(data.user);
    mostrarMensaje("🔓 Sesión iniciada correctamente");
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUsuario(null);
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUsuario(user);
    });
  }, []);

  if (!usuario) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-100">
        <div className="bg-white p-6 rounded-xl shadow w-full max-w-sm space-y-3">
          <h1 className="text-xl font-bold text-center">
            {modoRegistro ? "Registro" : "Inicio de Sesión"}
          </h1>
          <input
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            placeholder="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button
            onClick={modoRegistro ? registrar : login}
            className="bg-green-500 text-white w-full p-2 rounded"
          >
            {modoRegistro ? "Registrar" : "Entrar"}
          </button>
          <button
            onClick={() => setModoRegistro(!modoRegistro)}
            className="text-blue-600 w-full text-sm"
          >
            {modoRegistro
              ? "¿Ya tienes cuenta? Inicia sesión"
              : "¿No tienes cuenta? Regístrate"}
          </button>
          {mensaje && <div className="text-center text-sm text-red-600">{mensaje}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 space-y-4">
      <h1 className="text-2xl font-bold">Bienvenido, {usuario.email}</h1>
      <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">
        Cerrar sesión
      </button>
    </div>
  );
}
