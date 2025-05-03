// App con gestión completa de administradores con edición de contraseñas y mensajes visuales
import React, { useState, useEffect } from "react";

export default function App() {
  const [user, setUser] = useState(null);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [empleados, setEmpleados] = useState(() => {
    const guardados = localStorage.getItem("empleados");
    return guardados ? JSON.parse(guardados) : [
      { id: "E001", nombre: "Juan Pérez", puesto: "Almacén", sucursal: "CDMX" },
      { id: "E002", nombre: "Laura García", puesto: "Administración", sucursal: "CDMX" },
    ];
  });
  const [formVisible, setFormVisible] = useState(false);
  const [nuevoEmpleado, setNuevoEmpleado] = useState({ nombre: "", puesto: "", sucursal: "", cuenta: "", clabe: "", banco: "", archivos: [] });
  const [nuevoAdmin, setNuevoAdmin] = useState({ usuario: "", password: "" });
  const [admins, setAdmins] = useState(() => {
    const guardados = localStorage.getItem("admins");
    return guardados ? JSON.parse(guardados) : [
      { usuario: "admin", password: "1234" },
    ];
  });
  const [editPassword, setEditPassword] = useState({});
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    localStorage.setItem("empleados", JSON.stringify(empleados));
  }, [empleados]);

  useEffect(() => {
    localStorage.setItem("admins", JSON.stringify(admins));
  }, [admins]);

  const mostrarMensaje = (texto) => {
    setMensaje(texto);
    setTimeout(() => setMensaje(""), 3000);
  };

  const handleLogin = () => {
    if (loginData.username === "super" && loginData.password === "root") {
      setUser({ nombre: "Carlos", tipo: "superusuario" });
      mostrarMensaje("🔓 Sesión iniciada como superusuario");
    } else {
      const admin = admins.find(a => a.usuario === loginData.username && a.password === loginData.password);
      if (admin) {
        setUser({ nombre: admin.usuario, tipo: "admin" });
        mostrarMensaje("🔓 Sesión iniciada como administrador");
      } else {
        alert("Usuario o contraseña incorrectos");
      }
    }
  };

  const handleAddEmpleado = () => {
    const camposCompletos = Object.values(nuevoEmpleado).every((val) => {
      if (Array.isArray(val)) return val.length > 0;
      return val.trim() !== "";
    });
    if (user.tipo === "admin" && !camposCompletos) {
      alert("Como administrador, debes llenar todos los campos y subir al menos un archivo.");
      return;
    }
    const nuevoId = `E${(empleados.length + 1).toString().padStart(3, "0")}`;
    setEmpleados([...empleados, { id: nuevoId, ...nuevoEmpleado }]);
    mostrarMensaje("✅ Empleado registrado correctamente.");
    setFormVisible(false);
    setNuevoEmpleado({ nombre: "", puesto: "", sucursal: "", cuenta: "", clabe: "", banco: "", archivos: [] });
  };

  const handleAsignarAdmin = () => {
    if (nuevoAdmin.usuario.trim() && nuevoAdmin.password.trim() && !admins.some(a => a.usuario === nuevoAdmin.usuario)) {
      setAdmins([...admins, { usuario: nuevoAdmin.usuario.trim(), password: nuevoAdmin.password.trim() }]);
      mostrarMensaje(`✅ Usuario '${nuevoAdmin.usuario}' ha sido creado como administrador.`);
      setNuevoAdmin({ usuario: "", password: "" });
    }
  };

  const handleEliminarAdmin = (usuario) => {
    if (usuario === "admin") return alert("No se puede eliminar el administrador predeterminado.");
    setAdmins(admins.filter((a) => a.usuario !== usuario));
    mostrarMensaje(`🗑️ Administrador '${usuario}' eliminado.`);
  };

  const handleActualizarPassword = (usuario) => {
    if (!editPassword[usuario]?.trim()) return alert("Ingresa una nueva contraseña para " + usuario);
    setAdmins(admins.map(a => a.usuario === usuario ? { ...a, password: editPassword[usuario].trim() } : a));
    mostrarMensaje(`🔒 Contraseña actualizada para '${usuario}'`);
  };

  const exportarJSON = () => {
    const datos = {
      empleados,
      admins
    };
    const blob = new Blob([JSON.stringify(datos, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = "respaldo_asistencia.json";
    enlace.click();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-100">
        <div className="w-full max-w-sm p-4 bg-white rounded-xl shadow">
          <h1 className="text-xl font-bold mb-4 text-center">Inicio de Sesión</h1>
          <input placeholder="Usuario" value={loginData.username} onChange={(e) => setLoginData({ ...loginData, username: e.target.value })} className="mb-2 w-full p-2 border rounded" />
          <input placeholder="Contraseña" type="password" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} className="mb-4 w-full p-2 border rounded" />
          <button onClick={handleLogin} className="w-full bg-green-500 text-white p-2 rounded">Entrar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-green-50">
      <h1 className="text-2xl font-bold mb-6">Bienvenido, {user.nombre}</h1>
      <button onClick={exportarJSON} className="mb-4 bg-blue-500 text-white p-2 rounded">📁 Descargar respaldo</button>
      {mensaje && <div className="mb-4 text-green-700 font-semibold bg-green-200 p-2 rounded-xl max-w-xl">{mensaje}</div>}

      {/* Aquí continúa la interfaz para empleados y admins... */}
    </div>
  );
}
