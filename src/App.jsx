import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import AltaEmpleado from './AltaEmpleado';
import ConsultaEmpleados from './ConsultaEmpleados';

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
  const [nuevaFoto, setNuevaFoto] = useState(null);

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
    let foto_url = empleadoSeleccionado.foto_url;

    if (nuevaFoto) {
      const nombreArchivo = `${empleadoSeleccionado.numero_empleado}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("empleadosfotos")
        .upload(nombreArchivo, nuevaFoto, { upsert: true });

      if (uploadError) {
        alert("Error al subir la nueva foto");
        return;
      }

      const { data, error: urlError } = await supabase.storage
        .from("empleadosfotos")
        .createSignedUrl(nombreArchivo, 3600);

      if (urlError) {
        alert("Error al generar nueva URL de foto");
        return;
      }

      foto_url = data.signedUrl;
    }

    const camposTexto = ["nombres", "apellido_paterno", "apellido_materno", "sexo", "puesto", "sucursal"];
    const empleadoFormateado = { ...empleadoSeleccionado };
    camposTexto.forEach((campo) => {
      if (empleadoFormateado[campo]) {
        empleadoFormateado[campo] = empleadoFormateado[campo].toUpperCase();
      }
    });

    const actualizado = { ...empleadoFormateado, foto_url };

    const { error } = await supabase
      .from("empleados")
      .update(actualizado)
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
      <ConsultaEmpleados
        empleados={empleados}
        filtro={filtro}
        setFiltro={setFiltro}
        filtrar={filtrar}
        setView={setView}
        setEmpleadoSeleccionado={setEmpleadoSeleccionado}
      />
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
          <label className="text-sm font-medium text-gray-700">Actualizar o agregar nueva foto</label>
          <input type="file" accept="image/*" onChange={(e) => setNuevaFoto(e.target.files[0])} />
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
          <select className="p-2 border rounded" value={empleadoSeleccionado.sexo || ""} onChange={(e) => setEmpleadoSeleccionado({ ...empleadoSeleccionado, sexo: e.target.value })}>
            <option value="">Selecciona sexo</option>
            <option value="MASCULINO">MASCULINO</option>
            <option value="FEMENINO">FEMENINO</option>
          </select>
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
