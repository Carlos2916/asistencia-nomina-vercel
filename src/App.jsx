import React, { useState } from "react";

export default function App() {
  const [user, setUser] = useState(null);
  const [login, setLogin] = useState({ usuario: "", password: "" });

  const handleLogin = () => {
    if (login.usuario === "super" && login.password === "root") {
      setUser({ tipo: "superusuario" });
    } else if (login.usuario === "admin" && login.password === "1234") {
      setUser({ tipo: "admin" });
    } else {
      alert("Credenciales incorrectas");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="bg-white p-6 rounded shadow-md space-y-4">
          <h1 className="text-xl font-bold">Iniciar sesión</h1>
          <input
            placeholder="Usuario"
            className="border p-2 rounded w-full"
            value={login.usuario}
            onChange={(e) => setLogin({ ...login, usuario: e.target.value })}
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="border p-2 rounded w-full"
            value={login.password}
            onChange={(e) => setLogin({ ...login, password: e.target.value })}
          />
          <button className="bg-green-600 text-white p-2 rounded w-full" onClick={handleLogin}>
            Entrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-green-100">
      <h1 className="text-2xl font-bold mb-4">
        Bienvenido, {user.tipo === "superusuario" ? "Superusuario" : "Administrador"}
      </h1>
      <p>✅ Aquí irá la funcionalidad de empleados</p>
    </div>
  );
}
