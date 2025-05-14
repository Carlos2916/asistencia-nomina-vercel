import React, { useEffect, useState } from 'react';
import supabase from './supabaseClient';
import AltaEmpleado from './AltaEmpleado';
import ConsultaEmpleados from './ConsultaEmpleados';
import AsignarAdministrador from './AsignarAdministrador';
import ConvertirImportados from './ConvertirImportados';

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("login");
  const [form, setForm] = useState({ email: "", password: "" });
  const [empleados, setEmpleados] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [nuevaFoto, setNuevaFoto] = useState(null);

  const sucursales = ["Cabos", "Costa", "Bonfil", "Puerto", "Cedis", "Cedis Adm", "Chichen"];
  const puestos = ["Gerente", "Supervisor", "Vendedor", "Chofer", "Almacenista", "Administrativo", "Auxiliar", "Contador", "Programador", "Encargado", "Aux Sistemas", "Arquitecto", "Aux Contable"];
  const horasExtrasOptions = ["60", "70", "80", "100"];

  useEffect(() => {
    const fetchUsuario = async () => {
      const { data: authData } = await supabase.auth.getUser();

      if (authData.user) {
        const { data: usuarioData, error } = await supabase
          .from("usuarios")
          .select("*")
          .eq("email", authData.user.email)
          .single();

        if (usuarioData) {
          setUser(usuarioData);
          setView("dashboard");
          cargarEmpleados(usuarioData);
        } else {
          console.error("No se encontró el usuario en la tabla usuarios", error);
        }
      }
    };

    fetchUsuario();
  }, []);

  const handleLogin = async () => {
    const { error, data } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    if (error) return alert("Error al iniciar sesión");

    const { data: usuarioData, error: fetchError } = await supabase
      .from("usuarios")
      .select("*")
      .eq("email", form.email)
      .single();

    if (fetchError || !usuarioData) return alert("No se encontró el usuario");

    setUser(usuarioData);
    setView("dashboard");
    await cargarEmpleados(usuarioData);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setView("login");
  };

  const cargarEmpleados = async (usuario) => {
    let query = supabase.from("empleados").select("*");

    if (usuario?.rol === "administrador") {
      query = query.or(`creado_por.eq.${usuario.id},sucursal.eq.${usuario.sucursal}`);
    }

    const { data, error } = await query;

    if (!error) {
      const ordenados = data.sort((a, b) => a.apellido_paterno.localeCompare(b.apellido_paterno));
      setEmpleados(ordenados);
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

  if (view === "dashboard") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 flex flex-col items-center justify-center px-4 py-10">
        <div className="bg-white shadow-lg rounded-2xl p-6 max-w-md w-full space-y-6">
          <h1 className="text-2xl font-bold text-green-700 text-center">Panel de Administración</h1>

          <button onClick={() => setView("alta_empleado")} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-lg shadow transition duration-200">
            📋 Alta de empleado
          </button>

          <button onClick={() => { cargarEmpleados(user); setView("consulta_empleados"); }} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-lg shadow transition duration-200">
            🔍 Consultar empleados
          </button>

          {user?.rol === 'superusuario' && (
            <>
              <button onClick={() => setView("asignar_administrador")} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-lg shadow transition duration-200">
                🛠 Asignar administrador
              </button>
              <button onClick={() => setView("convertir_importados")} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-lg shadow transition duration-200">
                🔄 Convertir empleados importados
              </button>
            </>
          )}

          <button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-lg shadow transition duration-200">
            🚪 Cerrar sesión
          </button>
        </div>
      </div>
    );
  }

  if (view === "alta_empleado") return <AltaEmpleado volver={() => setView("dashboard")} usuario={user} />;

  if (view === "consulta_empleados") return (
    <ConsultaEmpleados empleados={empleados} filtro={filtro} setFiltro={setFiltro} filtrar={filtrar} setView={setView} setEmpleadoSeleccionado={setEmpleadoSeleccionado} usuario={user} />
  );

  if (view === "asignar_administrador") return <AsignarAdministrador volver={() => setView("dashboard")} />;

  if (view === "convertir_importados") return <ConvertirImportados volver={() => setView("dashboard")} usuario={user} />;

  return (
    <div className="min-h-screen flex items-center justify-center text-red-600">
      ⚠️ Vista no válida. Verifica el estado de la aplicación.
    </div>
  );
}
